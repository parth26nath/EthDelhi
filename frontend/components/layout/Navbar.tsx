"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        setIsOpen(false);
    };

    const menuVariants = {
        hidden: { opacity: 0, y: -20, transition: { duration: 0.2 } },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.2, staggerChildren: 0.1 },
        },
    };

    const menuItemVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
    };

    const navClassName = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? "border-b border-gray-200/50 bg-white/80 backdrop-blur-xl shadow-lg"
            : "border-b border-gray-200"
        }`;

    const linkColor = "text-gray-800";

    return (
        <nav className={navClassName} style={{ transformStyle: "preserve-3d", transform: "translateZ(0)" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0">
                            <h2 className="text-2xl font-bold">HRV</h2>            
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-2">
                                {["Features", "Pricing", "About"].map((item) => (
                                    <a
                                        key={item}
                                        href={`#${item.toLowerCase()}`}
                                        onClick={() => scrollTo(item.toLowerCase())}
                                        className={`${linkColor} hover:bg-gray-500/20 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors`}
                                    >
                                        {item}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                                >
                                  <a href="#" className="hero-button group relative inline-block z-10 font-medium text-base text-white bg-[#101210] py-3 px-10 rounded transition-all duration-500 overflow-hidden">
                                    <span className="absolute top-0 left-0 right-0 bottom-0 bg-pink-400 rounded -z-10 transform scale-0 transition-all duration-500 group-hover:scale-100"></span>
                                    <span className="relative z-10 transition-colors duration-500 group-hover:text-black">Get Started</span>
                                  </a>
                                </motion.div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-white hover:bg-gray-700 focus:outline-none"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            <AnimatePresence initial={false} mode="wait">
                                <motion.div
                                    key={isOpen ? "open" : "closed"}
                                    initial={{ rotate: isOpen ? -90 : 0, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: isOpen ? 0 : 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                                </motion.div>
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="md:hidden bg-white/90 backdrop-blur-lg shadow-xl"
                        id="mobile-menu"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={menuVariants}
                    >
                        <motion.div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {["Features", "Pricing", "About"].map((item) => (
                                <motion.a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    onClick={() => scrollTo(item.toLowerCase())}
                                    className="text-gray-800 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                                    variants={menuItemVariants}
                                >
                                    {item}
                                </motion.a>
                            ))}
                            <motion.div variants={menuItemVariants}>
                                <Link href="/dashboard">
                                    <Button variant="secondary" className="w-full mt-2">
                                        Dashboard
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;