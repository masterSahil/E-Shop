import React, { useEffect, useRef } from 'react';
import Navbar from '../main/Navbar';
import { useState } from 'react';
import axios from 'axios';
import { FaEdit, FaPlus, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminDash = () => {

  const [data, setData] = useState({image: '', name: '', desc: '', price: ''});
  const [productsData, setProductsData] = useState([]);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    setData(prev => ({ ...prev, [name]: type === "file" ? files[0] : value }));
  }

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const submit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append("image", data.image);
    formData.append("name", data.name);
    formData.append("desc", data.desc);
    formData.append("price", data.price);

    // 1. First save product and get back response
    const productRes = await axios.post(import.meta.env.VITE_PRODUCT_URL, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    // const product = productRes.data.product; // you must return this in backend
    // const { image, name, desc, price, _id: productId } = product;

    // // 2. Use the same image name in a second call to cart (NO image file again)
    // await axios.post(import.meta.env.VITE_CART_URL, {
    //   productId,
    //   image,
    //   name,
    //   desc,
    //   price,
    //   quantity: 1,
    //   inStock: true
    // });

    alert("Successfully Added");
    getData();

    setData({ image: '', name: '', desc: '', price: '' });
    if (fileInputRef.current) fileInputRef.current.value = null;

  } catch (error) {
    console.error("Error adding product:", error.message);
  }
};

  const deleteProduct = async (id) => {
    try {
        const products = await axios.get(`${import.meta.env.VITE_PRODUCT_URL}`);
        const findProduct = products.data.product.find(p => p._id === id)
        const productId = findProduct.productId;

        const allCarts = await axios.get(`${import.meta.env.VITE_CART_URL}`);
        const findCart = allCarts.data.cart.find(c => c.productId === productId);
        if (findCart) {
          await axios.delete(`${import.meta.env.VITE_CART_URL}/${findCart._id}`)
        }

        await axios.delete(`${import.meta.env.VITE_PRODUCT_URL}/${id}`);

        alert("Product Successfully Deleted");
        getData();
    } catch (error) {
      console.log(error);
    }
  }

  const getData = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_PRODUCT_URL);
      const productsArray = res.data.product;

      setProductsData(productsArray);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();    
  }, []);

  return (
    <>
      <Navbar />

      <section className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">

          {/* Admin Welcome Section */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, Admin 👋</h1>
          <p className="text-gray-600 mb-10">Manage your product listings with ease.</p>

          {/* Already Selling Products */}
          <div className="mb-10">
            <div className="pb-12 px-4 bg-gray-50">
              <h1 className="text-center font-bold text-4xl text-violet-700 mb-10">Our Products</h1>
        
              <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {productsData.map((val, key) => (
                  <div
                    key={key}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col justify-between"
                  >
                    <img
                      src={`${import.meta.env.VITE_PRODUCT_IMAGE_URL}/${val.image}`}
                      alt={val.name}
                      className="h-[150px] sm:h-[200px] object-contain rounded-lg mb-4"
                    />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{val.name} </h2>
                    <p className="text-sm text-gray-600 mb-4">{val.desc} </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-lg font-bold text-violet-700">₹ {val.price} </span>
                      {/* <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-md text-sm transition">
                        <FaShoppingCart />
                        Add to Cart
                      </button> */}
                    </div>
                    <div className="flex flex-row pt-3 gap-1 ">
                      <button onClick={()=>navigate(`/edit-product/${val._id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 text-sm w-full justify-center "
                      >
                        <FaEdit /> Edit
                      </button>
                      <button onClick={()=>deleteProduct(val._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200 text-sm w-full justify-center"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))} 
              </div>
            </div>
          </div>

          {/* Form Title Section */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-violet-700 mb-2">🧾 Product Management Panel</h2>
            <p className="text-gray-600 text-sm">
              Upload new products with accurate details to keep your store fresh and updated.
            </p>
          </div>

          {/* Add Product Form */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

            {/* Left Side Illustration Image */}
            <div className="hidden md:block">
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/admin-control-panel-4439073-3726748.png"
                alt="Product Upload Illustration"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Right Side Form */}
            <div className="p-8 ">
              <h2 className="text-xl sm:text-2xl font-semibold text-violet-600 mb-6 flex items-center">
                <FaPlus className='mr-2' />Add New Product</h2>

              <form className="space-y-6">
                {/* Product Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <input
                    type="file"
                    name='image'
                    ref={fileInputRef}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-sm"
                  />

                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    onChange={handleChange}
                    name='name'
                    value={data.name}
                    placeholder="Enter product name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-sm"
                  />
                </div>

                {/* Product Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows="3"
                    onChange={handleChange}
                    name='desc'
                    value={data.desc}
                    placeholder="Write a short description..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-sm resize-none"
                  ></textarea>
                </div>

                {/* Product Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    onChange={handleChange}
                    name='price'
                    value={data.price}
                    placeholder="Enter price"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-sm"
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    onClick={submit}
                    type="submit"
                    className="w-full px-6 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminDash;