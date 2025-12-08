'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Menu, X, BookOpen } from 'lucide-react';
import { memo, useState } from 'react';

const Navbar = () => {
 const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navItems = [
        { href: "#features", label: "Features" },
        { href: "#automation", label: "Automation" },
        { href: "/docs", label: "Docs" },
    ];

    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.1 }}
            className="w-full h-fit absolute top-0 left-0 right-0 z-50 pt-8" // Increased Z-index for menu
        >
            <nav className="container mx-auto flex items-center justify-between px-6 md:px-8 lg:px-12">
                {/* Logo / Brand Name */}
                <Link href="/" className="flex items-center no-underline! gap-2 text-black! text-lg font-extrabold tracking-tight z-50">
                    <span className="inline-block rounded-sm px-2 py-1 border border-black/10 text-base font-medium">TI</span>
                    Think-Ink
                </Link>
        
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navItems.map(item => (
                        <Link key={item.href} href={item.href} className="text-sm no-underline! text-black! font-medium hover:text-black transition">
                            {item.label}
                        </Link>
                    ))}
                    <Link href="/sign-up">
                        <Button className="bg-black text-white! px-4 py-2 text-sm font-semibold rounded-lg shadow-xl shadow-black/20 hover:bg-neutral-900 transition-transform transform hover:-translate-y-0.5">
                            Get started
                        </Button>
                    </Link>
                </div>
        
                {/* Mobile Menu Button */}
                <div className="md:hidden z-50">
                    <button 
                        onClick={toggleMenu} 
                        className="p-2 rounded-full border border-neutral-200 text-black hover:bg-neutral-100 transition"
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Content (Animated Overlay) */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        id="mobile-menu"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        // Fixed position to cover the screen below the nav/header area
                        className="fixed inset-x-0 top-[88px] bottom-0 bg-white/95 backdrop-blur-sm shadow-xl p-6 md:hidden z-40 origin-top overflow-y-auto"
                    >
                        <div className="flex flex-col space-y-4">
                            {navItems.map(item => (
                                <Link 
                                    key={item.href} 
                                    href={item.href} 
                                    onClick={toggleMenu} // Close menu on click
                                    className="text-xl font-semibold text-black py-2 border-b border-neutral-100 hover:bg-neutral-50 rounded-lg px-2 transition"
                                >
                                    {item.label}
                                </Link>
                            ))}

                            <div className="pt-4">
                                <Link href="/sign-up">
                                    <Button 
                                        onClick={toggleMenu} // Close menu on click
                                        className="w-full bg-black text-white px-4 py-3 text-lg font-semibold rounded-lg shadow-xl shadow-black/20 hover:bg-neutral-900"
                                    >
                                        Get started
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default memo(Navbar);
