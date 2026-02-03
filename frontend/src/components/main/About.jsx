import React from 'react';
import { motion } from 'framer-motion';
import { Gem, Handshake, Users, Leaf, ArrowRight } from 'lucide-react';
import journey from '../../assets/images/about/journey.png';
import mission from '../../assets/images/about/mission.png';
import Navbar from './Navbar';

const About = () => {
    // Shared animation variants for consistency
    const fadeInUp = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { type: "spring", stiffness: 100, damping: 20 } 
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    return (
        <div className="min-h-screen bg-[#fdfdfd] font-sans selection:bg-yellow-200">
            <Navbar />

            {/* --- Hero Section --- */}
            <header className="relative py-24 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-50/50 via-transparent to-transparent -z-10"></div>
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 mb-6 bg-emerald-50 border border-emerald-100 rounded-full"
                    >
                        <span className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em]">Our Heritage</span>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-7xl font-black text-emerald-950 leading-tight tracking-tighter"
                    >
                        Defining the future of <br />
                        <span className="text-emerald-500 italic">Modern Retail.</span>
                    </motion.h1>
                    <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: "80px" }} 
                        className="h-2 bg-yellow-400 mx-auto mt-8 rounded-full"
                    />
                </div>
            </header>

            <main className="container mx-auto px-6 pb-24">
                
                {/* --- Our Story Section --- */}
                <motion.section 
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mb-32 grid md:grid-cols-2 gap-16 items-center"
                >
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-emerald-100/50 rounded-[3rem] blur-2xl group-hover:bg-yellow-100/50 transition-colors duration-700"></div>
                        <img
                            src={journey}
                            alt="Our Journey"
                            className="relative w-full aspect-square object-cover rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border-8 border-white"
                            onError={(e) => { e.target.src="https://placehold.co/800x800/f3f5f0/065f46?text=Our+Journey"; }}
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-4xl font-black text-emerald-950 tracking-tight">
                            It started with a <span className="text-emerald-600 underline decoration-yellow-400 decoration-4 underline-offset-8">Single Vision.</span>
                        </h2>
                        <div className="space-y-4 text-emerald-900/70 text-lg leading-relaxed font-medium">
                            <p>
                                Founded in 2023, E-Shop was born from a desire to bridge the gap between 
                                luxury aesthetics and everyday accessibility. We believed that shopping 
                                should be an experience, not a chore.
                            </p>
                            <p>
                                Every piece in our collection is curated with an obsessive attention to 
                                detail. We don't just sell products; we sell stories that enhance your lifestyle.
                            </p>
                            <button className="flex items-center gap-2 text-emerald-600 font-bold hover:gap-4 transition-all group">
                                Learn about our curation process <ArrowRight size={20} className="text-yellow-500" />
                            </button>
                        </div>
                    </div>
                </motion.section>

                {/* --- Our Mission Section --- */}
                <motion.section 
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mb-32 grid md:grid-cols-2 gap-16 items-center space-x-2"
                >
                    <div className="md:order-2 relative group">
                        <div className="absolute -inset-4 bg-yellow-100/40 rounded-[3rem] blur-2xl"></div>
                        <img
                            src={mission}
                            alt="Our Mission"
                            className="relative w-full aspect-video object-cover rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border-8 border-white"
                            onError={(e) => { e.target.src="https://placehold.co/800x600/fefce8/854d0e?text=Our+Mission"; }}
                        />
                    </div>
                    <div className="md:order-1 space-y-6">
                        <h2 className="text-4xl font-black text-emerald-950 tracking-tight">
                            Beyond Just <span className="text-emerald-600">Commerce.</span>
                        </h2>
                        <p className="text-emerald-900/70 text-lg leading-relaxed font-medium">
                            Our mission is to empower a global community through thoughtful design 
                             and ethical sourcing. We are committed to a carbon-neutral future, 
                             ensuring that your style never comes at the cost of our planet.
                        </p>
                        <div className="flex gap-8 py-4">
                            <div className="text-center">
                                <h4 className="text-3xl font-black text-emerald-950">10k+</h4>
                                <p className="text-[10px] font-bold text-emerald-400 uppercase">Happy Clients</p>
                            </div>
                            <div className="text-center">
                                <h4 className="text-3xl font-black text-emerald-950">100%</h4>
                                <p className="text-[10px] font-bold text-emerald-400 uppercase">Sourced Ethically</p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* --- Our Values Section --- */}
                <section>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-emerald-950 tracking-tight">The Values We Live By</h2>
                        <p className="text-emerald-700/50 font-bold uppercase text-[10px] tracking-widest mt-2">No Compromises</p>
                    </div>
                    <motion.div 
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            { icon: <Gem className="text-emerald-600" size={32} />, title: "Quality", desc: "We provide products that are built to last, using materials that feel as good as they look.", color: "bg-emerald-50" },
                            { icon: <Handshake className="text-yellow-600" size={32} />, title: "Integrity", desc: "Honesty in our pricing, transparency in our shipping, and loyalty to our customers.", color: "bg-yellow-50" },
                            { icon: <Leaf className="text-emerald-600" size={32} />, title: "Sustainability", desc: "Our packaging is 100% recyclable. We believe in beauty without the waste.", color: "bg-emerald-50" }
                        ].map((value, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeInUp}
                                whileHover={{ y: -10 }}
                                className={`p-10 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 ${value.color}`}
                            >
                                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6">
                                    {value.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-emerald-950 mb-4">{value.title}</h3>
                                <p className="text-emerald-900/60 leading-relaxed font-medium text-sm">
                                    {value.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            </main>

            {/* --- Footer --- */}
            <footer className="py-12 bg-emerald-950 text-white rounded-t-[3rem]">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-2xl font-black mb-4">E-SHOP</h2>
                    <p className="text-emerald-400 text-sm font-medium opacity-60">
                        &copy; {new Date().getFullYear()} Boutique Excellence. All rights reserved.
                    </p>
                    <div className="flex justify-center gap-6 mt-6">
                        <span className="text-xs font-bold hover:text-yellow-400 cursor-pointer transition-colors">Privacy</span>
                        <span className="text-xs font-bold hover:text-yellow-400 cursor-pointer transition-colors">Terms</span>
                        <span className="text-xs font-bold hover:text-yellow-400 cursor-pointer transition-colors">Support</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default About;