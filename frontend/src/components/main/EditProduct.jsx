import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [product, setProduct] = useState({
    name: '',
    desc: '',
    price: '',
    image: '',
    inStock: true,
  });

  const [previewImage, setPreviewImage] = useState(null);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_GET_SINGLE_PRODUCT_URL}/${id}`);
      const { name, desc, price, image, inStock } = res.data.product;
      setProduct({ name, desc, price, image, inStock });
      setPreviewImage(`${import.meta.env.VITE_PRODUCT_IMAGE_URL}/${image}`);
    } catch (err) {
      console.error("Error fetching product:", err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleChange = (e) => {
    const { name, type, value, files, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === "file" ? files[0]
        : type === "checkbox" ? checked
        : value
    }));

    if (type === 'file') {
      const file = files[0];
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('desc', product.desc);
      formData.append('price', product.price);
      formData.append('inStock', product.inStock ? 'true' : 'false');
      if (product.image instanceof File) {
        formData.append('image', product.image);
      }

      // Update product info
      await axios.put(`${import.meta.env.VITE_PRODUCT_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Fetch productId from updated product data
      const productRes = await axios.get(`${import.meta.env.VITE_GET_SINGLE_PRODUCT_URL}/${id}`);
      const productId = productRes.data.product.productId;

      // Bulk update carts for this productId
      await axios.put(`${import.meta.env.VITE_CART_URL}/product/${productId}`, {
        inStock: product.inStock,
        quantity: 1
      });

      alert("Product and carts updated!");
      navigate('/admin');
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-violet-700">✏️ Edit Product</h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        <form onSubmit={updateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-48 object-contain rounded-md border mb-3"
              />
            )}
            <input
              type="file"
              name="image"
              ref={fileInputRef}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-sm"
            />
          </div>

          <div className="col-span-1 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="desc"
                rows="4"
                value={product.desc}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-sm resize-none"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-sm"
              />
            </div>
            <div className='flex items-center'>
              <label className="text-sm text-nowrap font-medium text-gray-700 mb-1 mr-1">inStock:</label>
              <input
                type="checkbox"
                name="inStock"
                checked={product.inStock}
                onChange={handleChange}
                className="h-4 w-4 text-violet-600 border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition flex items-center justify-center gap-2"
            >
              <FaSave />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;