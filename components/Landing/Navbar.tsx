'use client';

import { motion } from 'framer-motion';
// Assuming '@/components/ui/button' is available and using Link as a standard anchor replacement
import { Button } from '@/components/ui/button';
// Replaced import from 'next/link' with a standard variable declaration for Link
import Link from 'next/link';
import { Menu, X, BookOpen } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {


  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.1 }}
      className="w-full h-fit"
    >
           <nav className="container mx-auto flex items-center justify-between px-6 md:px-8 lg:px-12 absolute top-0 left-0 right-0 z-10 pt-8">
             {/* FIX: Replaced next/link with standard <a> tag */}
             <a href="/" className="flex items-center gap-2 text-black! text-lg font-extrabold tracking-tight">
               <span className="inline-block rounded-sm px-2 py-1 border border-black/10 text-base font-medium">TI</span>
               Think-Ink
             </a>
     
             <div className="hidden md:flex items-center gap-8">
               <Link href="#features" className="text-sm font-medium text-neutral-800! hover:text-black transition">Features</Link>
               {/* <a href="#testimonials" className="text-sm font-medium text-neutral-800! hover:text-black transition">Testimonials</a> */}
          
               <Link href="/sign-up">
                 <Button className="bg-black text-white px-4 py-2 text-sm font-semibold rounded-lg shadow-xl shadow-black/20 hover:bg-neutral-900 transition-transform transform hover:-translate-y-0.5">Get started</Button>
               </Link>
             </div>
     
             <div className="md:hidden">
               <button className="p-2 rounded-full border border-neutral-200 text-black">Menu</button>
             </div>
           </nav>
    </motion.div>
  );
};
