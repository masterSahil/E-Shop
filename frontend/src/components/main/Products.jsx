import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react'; // Import useMemo for performance
import { FaShoppingCart, FaCheckCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { RiFilterFill, RiSearchLine } from 'react-icons/ri';

const Products = () => {
    const [data, setData] = useState([]); // Stores all products fetched from API
    const [cartItems, setCartItems] = useState([]); // Stores items currently in the user's cart
    const [loading, setLoading] = useState(true); // Manages loading state for product data
    const [filterCategory, setFilterCategory] = useState('All'); // Current selected category for filtering
    const [searchTerm, setSearchTerm] = useState(''); // Current search term entered by user

    // Fetches all products from the backend API
    const getData = async () => {
        try {
            setLoading(true); // Indicate loading has started
            const res = await axios.get(import.meta.env.VITE_PRODUCT_URL, {
                withCredentials: true, // Send cookies with the request
            });
            setData(res.data.product); // Update state with fetched products
        } catch (error) {
            console.error("Product Fetch Error:", error); // Log detailed error
            toast.error('Failed to load products. Please try again.'); // Show user-friendly error
        } finally {
            setLoading(false); // Indicate loading has finished
        }
    };

    // Fetches the current user's cart items from the backend API
    const fetchCartItems = async () => {
        try {
            const res = await axios.get(import.meta.env.VITE_CART_URL, {
                withCredentials: true,
            });

            // Fetch current user's ID for filtering cart items
            const tokenRes = await axios.get(
                import.meta.env.VITE_CURRENT_USER_TOKEN_URL,
                {
                    withCredentials: true,
                }
            );

            // Safely get userId using optional chaining
            const userId = tokenRes?.data?.user?._id;

            if (!userId) {
                console.warn("User ID not found in token response:", tokenRes.data);
                // Optionally, show a toast or redirect if user is not authenticated
                return;
            }

            // Filter cart items to show only those belonging to the current user
            const userCart = res.data.cart.filter(
                (item) => item.userId === userId
            );
            setCartItems(userCart); // Update state with user's cart items
        } catch (error) {
            console.error("Cart Fetch Error:", error); // Log detailed error
            toast.error('Failed to load cart items.'); // Show user-friendly error
        }
    };

    // Adds a selected product to the user's cart via API call
    const addToCart = async (productId) => {
        try {
            // First, fetch the product list again to get details of the product being added
            const res = await axios.get(import.meta.env.VITE_PRODUCT_URL, {
                withCredentials: true,
            });

            const productList = res.data.product;
            const selectedProduct = productList.find(
                (p) => p.productId === productId
            );

            if (!selectedProduct) {
                toast.error('Product not found. Cannot add to cart.');
                return;
            }

            // Construct the cart item object
            const cartItem = {
                image: selectedProduct.image,
                name: selectedProduct.name,
                desc: selectedProduct.desc,
                price: selectedProduct.price,
                productId: selectedProduct.productId,
                inStock: selectedProduct.inStock,
                quantity: 1, // Default quantity to 1 when adding to cart
            };

            // Post the new cart item to the cart API
            await axios.post(import.meta.env.VITE_CART_URL, cartItem, {
                withCredentials: true,
            });

            toast.success('Product added to cart successfully!'); // Success notification
            fetchCartItems(); // Refresh the cart items to update UI
        } catch (error) {
            console.error("Add to Cart Error:", error); // Log detailed error
            toast.error('Failed to add to cart. Please try again.'); // Show user-friendly error
        }
    };

    // Checks if a product with the given productId is already in the user's cart
    const isInCart = (productId) => {
        return cartItems.some((item) => item.productId === productId);
    };

    // useEffect hook to fetch initial data when component mounts
    useEffect(() => {
        getData();
        fetchCartItems();
    }, []); // Empty dependency array means this runs once on mount

    // useMemo to dynamically generate unique categories from the fetched product data
    // This re-calculates only when 'data' changes, optimizing performance.
    const categories = useMemo(() => {
        const uniqueCategories = new Set();
        // Add 'All' as the default option
        uniqueCategories.add('All');
        // Iterate through products and add their categories to the set
        data.forEach(p => {
            if (p.category) { // Ensure category property exists
                uniqueCategories.add(p.category);
            }
        });
        return Array.from(uniqueCategories); // Convert Set back to an array
    }, [data]); // Dependency: re-run when 'data' changes

    // useMemo to filter and search products based on current state
    // This re-calculates only when 'data', 'filterCategory', or 'searchTerm' changes.
    const filteredProducts = useMemo(() => {
        return data.filter(product => {
            // Category filter logic
            const matchesCategory = filterCategory === 'All' || product.category === filterCategory;

            // Search term filter logic (checks name and description)
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  (product.desc && product.desc.toLowerCase().includes(searchTerm.toLowerCase()));

            return matchesCategory && matchesSearch; // Product must match both criteria
        });
    }, [data, filterCategory, searchTerm]); // Dependencies for re-calculation

    // Display a loading spinner while data is being fetched
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-violet-50 to-purple-100 font-inter">
                <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-violet-500"></div>
                <p className="ml-4 text-violet-700 text-lg">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 p-4 sm:p-6 lg:p-8 font-inter">
            <Toaster position="top-right" reverseOrder={false} />

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-extrabold text-center text-violet-800 mb-8 drop-shadow-md"
            >
                Our Products
            </motion.h1>

            <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Search Bar Input */}
                <div className="relative w-full sm:w-1/2">
                    <input
                        type="text"
                        placeholder="Search products by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition duration-200 shadow-sm"
                    />
                    <RiSearchLine className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                </div>

                {/* Category Filter Dropdown */}
                <div className="relative w-full sm:w-1/3">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition duration-200 shadow-sm bg-white"
                    >
                        {/* Dynamically generated category options */}
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <RiFilterFill className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
                    {/* Custom dropdown arrow using SVG */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <AnimatePresence>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((val) => (
                            <motion.div
                                key={val.productId} // Unique key for each product
                                layout // Enables smooth layout transitions with framer-motion
                                initial={{ opacity: 0, y: 50, scale: 0.8 }} // Initial animation state
                                animate={{ opacity: 1, y: 0, scale: 1 }} // Animation state when entering/updating
                                exit={{ opacity: 0, y: -50, scale: 0.8 }} // Animation state when exiting
                                transition={{ duration: 0.4 }} // Animation duration
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col"
                            >
                                <div className="relative h-48 sm:h-56 overflow-hidden">
                                    <img
                                        src={`${import.meta.env.VITE_PRODUCT_IMAGE_URL}/${val.image}`}
                                        alt={val.name}
                                        className="w-full h-full object-contain rounded-t-lg mb-4 p-2"
                                        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/F0F4FF/6B46C1?text=Image+Error`; }}
                                    />
                                    {val.category && (
                                        <span className="absolute top-3 left-3 bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                            {val.category}
                                        </span>
                                    )}
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{val.name}</h2>
                                    <p className="text-gray-600 text-sm mb-4 flex-grow">{val.desc}</p>
                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                                        <span className="text-2xl font-bold text-violet-700">
                                            ₹ {val.price}
                                        </span>
                                        {isInCart(val.productId) ? (
                                            <button
                                                disabled
                                                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl font-medium text-sm cursor-not-allowed shadow-md"
                                            >
                                                <FaCheckCircle />
                                                Cart Added
                                            </button>
                                        ) : (
                                            <motion.button
                                                whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)" }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => addToCart(val.productId)}
                                                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition shadow-md"
                                            >
                                                <FaShoppingCart />
                                                Add to Cart
                                            </motion.button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full text-center py-10 text-gray-600 text-lg"
                        >
                            No products found matching your criteria.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Products;
