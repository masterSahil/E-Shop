import React from 'react';
import journey from '../../assets/images/about/journey.png'
import mission from '../../assets/images/about/mission.png'
import Navbar from './Navbar';

const About = () => {

  return (
    <>
        <Navbar />
        {/* // Main container with responsive padding and background */}
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 antialiased">
        {/* Header Section */}
        <header className="py-12 bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg rounded-b-3xl">
            <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
                About Our Store
            </h1>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto opacity-90">
                Discover the passion and purpose behind our curated collection.
            </p>
            </div>
        </header>

        {/* Main Content Sections */}
        <main className="container mx-auto px-6 py-16">

            {/* Our Story Section */}
            <section className="mb-16 bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-[1.01]">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-700 mb-8">
                Our Story
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="md:w-1/2">
                <img
                    src={journey}
                    alt="Our Journey"
                    className="w-full h-auto rounded-xl shadow-lg object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/E0F2F7/2C3E50?text=Image+Unavailable"; }}
                />
                </div>
                <div className="md:w-1/2 text-lg leading-relaxed text-gray-700">
                <p className="mb-4">
                    Founded in 2023, our store began with a simple idea: to bring
                    high-quality, unique products directly to your doorstep. We noticed a gap
                    in the market for carefully selected items that blend aesthetics with
                    functionality, and we set out to fill it.
                </p>
                <p className="mb-4">
                    What started as a small passion project quickly grew into a thriving
                    online community. We believe in the power of well-made products to
                    enhance daily life and bring joy. Every item in our collection is
                    hand-picked, tested, and loved by our team before it makes it to our
                    virtual shelves.
                </p>
                <p>
                    We're committed to sustainable practices and supporting ethical
                    producers, ensuring that every purchase you make not only brings you
                    satisfaction but also contributes positively to the world.
                </p>
                </div>
            </div>
            </section>

            {/* Our Mission Section */}
            <section className="mb-16 bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-[1.01]">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-purple-700 mb-8">
                Our Mission
            </h2>
            <div className="flex flex-col md:flex-row-reverse items-center gap-10">
                <div className="md:w-1/2">
                <img
                    src={mission}
                    alt="Our Mission"
                    className="w-full h-auto rounded-xl shadow-lg object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/F3E8FF/4A0E6F?text=Image+Unavailable"; }}
                />
                </div>
                <div className="md:w-1/2 text-lg leading-relaxed text-gray-700">
                <p className="mb-4">
                    Our mission is to empower our customers by providing access to
                    exceptional products that inspire, delight, and simplify their lives.
                    We strive to be more than just an e-commerce store; we aim to be a
                    trusted source for quality, innovation, and thoughtful design.
                </p>
                <p className="mb-4">
                    We are dedicated to fostering a seamless and enjoyable shopping
                    experience, from browsing our catalog to receiving your order. Your
                    satisfaction is at the heart of everything we do, and we continuously
                    seek ways to improve and exceed your expectations.
                </p>
                <p>
                    Through our carefully curated selection, we hope to help you discover
                    items that resonate with your lifestyle and values, making every
                    purchase a meaningful one.
                </p>
                </div>
            </div>
            </section>

            {/* Our Values Section */}
            <section className="bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-[1.01]">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-700 mb-8">
                Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {/* Value 1: Quality */}
                <div className="p-6 bg-blue-50 rounded-xl shadow-md border border-blue-200">
                <div className="text-5xl mb-4 text-blue-600">
                    <i className="fas fa-gem"></i> {/* Example icon, replace with lucide-react or SVG */}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-blue-800">Quality</h3>
                <p className="text-gray-700">
                    We commit to offering only the highest quality products that stand
                    the test of time and exceed expectations.
                </p>
                </div>

                {/* Value 2: Integrity */}
                <div className="p-6 bg-purple-50 rounded-xl shadow-md border border-purple-200">
                <div className="text-5xl mb-4 text-purple-600">
                    <i className="fas fa-handshake"></i> {/* Example icon */}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-purple-800">Integrity</h3>
                <p className="text-gray-700">
                    Operating with transparency and honesty, we build trust with our
                    customers and partners.
                </p>
                </div>

                {/* Value 3: Customer Focus */}
                <div className="p-6 bg-green-50 rounded-xl shadow-md border border-green-200">
                <div className="text-5xl mb-4 text-green-600">
                    <i className="fas fa-heart"></i> {/* Example icon */}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-green-800">Customer Focus</h3>
                <p className="text-gray-700">
                    Your satisfaction is our priority. We listen, adapt, and strive to
                    provide exceptional service.
                </p>
                </div>
            </div>
            </section>
        </main>

        {/* Footer Section */}
        <footer className="py-8 bg-gray-800 text-white text-center rounded-t-3xl mt-16">
            <div className="container mx-auto px-6">
            <p className="text-sm opacity-80">
                &copy; {new Date().getFullYear()} Your E-commerce Store. All rights reserved.
            </p>
            </div>
        </footer>
        </div>
    </>
  );
};

export default About;
