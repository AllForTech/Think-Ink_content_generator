'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import SCREENSHOT_URL from '@/assets/hero_image.png'; 
import Image from 'next/image';
import { Navbar } from './Navbar';


export default function MonoHero() {
  return (
    <header className="relative isolate overflow-hidden bg-white py-10 lg:py-20">
      {/* 1. Subtle Background Texture (Grain/Vignette) */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        {/* Soft grain / vignette for tactile depth */}
        <div className="absolute inset-0 bg-white/80" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(0,0,0,0.03),transparent_20%),radial-gradient(circle_at_90%_80%,rgba(0,0,0,0.02),transparent_20%)]" />
      </div>

     
     <Navbar/>

      {/* Hero Content Grid */}
      <div className="container mx-auto px-6 md:px-8 lg:px-12 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Left side: Text Content and CTAs */}
          <div className="md:col-span-7 max-w-3xl mx-auto md:mx-0 text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[48px] md:text-[72px] lg:text-[88px] leading-none font-extrabold text-black"
            >
              Build better content faster.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-6 text-lg text-neutral-700 max-w-2xl"
            >
              A sleek, minimal content generator tuned for clarity and quality. One pipeline
              endless possibilities. Grounded by research, refined by AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-8 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3 justify-center md:justify-start"
            >
              {/* FIX: Replaced next/link with standard <a> tag */}
              <a href="/sign-up">
                <Button className="bg-black text-white px-6 py-3 rounded-lg text-base font-semibold shadow-xl shadow-black/20 hover:bg-neutral-900 transform transition hover:-translate-y-0.5">Try it free</Button>
              </a>

              {/* FIX: Replaced next/link with standard <a> tag */}
              <a href="#features">
                <button className="text-base text-neutral-800 px-5 py-2.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 transition shadow-sm">Explore features</button>
              </a>
            </motion.div>

            <div className="mt-12 flex items-center gap-6 justify-center md:justify-start text-sm text-neutral-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-neutral-200 bg-neutral-200 flex items-center justify-center text-xs font-semibold text-black">1</div>
                <div>
                  <div className="text-black font-semibold">Trusted by creators</div>
                  <div className="text-xs text-neutral-500">Used daily by modern teams</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-neutral-200 bg-neutral-200 flex items-center justify-center text-xs font-semibold text-black">99%</div>
                <div>
                  <div className="text-black font-semibold">Uptime & performance</div>
                  <div className="text-xs text-neutral-500">Reliably available</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side visual — Platform Screensho */}
          <div 
          className="md:col-span-5 flex items-center justify-center md:justify-end mt-12 md:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 300 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              // Adjusted max-width slightly for better desktop proportion
              className="relative w-full max-w-xl lg:max-w-[550px] lg:mr-[-30px] h-96 md:mr-20 md:h-auto" 
            >
            
              {/* Image 1: Primary Screenshot (Foreground) */}
              <div 
                className="relative z-10 w-full h-auto overflow-hidden rounded-lg  border-2 border-black/10 drop-shadow-2xl shadow-black/30 transform hover:-translate-y-1 transition duration-300"
              >
                <Image
                  src={SCREENSHOT_URL}
                  alt="Primary Screenshot of the content generator interface"
                  // Using inline sizing for this environment's <img>
                  width={1300}
                  height={650}
                  className="w-full h-auto object-cover" 
                />
              </div>

              {/* Image 2: Secondary Screenshot (Background/Layered) */}
              <div 
                // Absolute position, slightly offset to the bottom right
                className="absolute top-4 left-4 md:top-20 md:left-10 z-0 w-full h-auto overflow-hidden rounded-lg border border-black/5"
              >
                <Image
                  src={SCREENSHOT_URL}
                  alt="Secondary layered detail"
                  width={1300}
                  height={650}
                  // Using lower opacity to simulate depth and avoid visual clutter
                  className="w-full h-auto object-cover opacity-70" 
                />
              </div>
              
              {/* Abstract Background Element (Moved further back) */}
              <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-black/5 blur-3xl -z-20" />
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}