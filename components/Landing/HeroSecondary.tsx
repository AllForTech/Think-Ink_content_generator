'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto flex flex-col items-center md:flex-row">
        {/* Left Column: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-12 text-center md:mb-0 md:w-1/2 md:pr-12 md:text-left"
        >
          <h1 className="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-6xl">
            Unleash Your AI Writer. Create Fact-Based Content, Instantly.
          </h1>
          <p className="mb-8 text-lg text-gray-700">
            Generate high-quality blogs, social media posts, and more with our advanced AI. Grounded
            in truth, crafted for impact.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full bg-teal-500 px-8 py-3 font-bold text-white shadow-md transition duration-300 hover:bg-teal-600"
          >
            Start Generating for Free
          </motion.button>
        </motion.div>

        {/* Right Column: Image and Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="relative md:w-1/2"
        >
          <div className="relative z-10">
            <Image
              width={100}
              height={100}
              src="/assets/hero_image.png" // Replace with the actual path to your image
              alt="AI Content Generator Interface"
              className="h-auto! w-full!"
            />
          </div>

          {/* Background Decoration */}
          <div className="absolute top-0 left-0 -z-10 h-full w-full">
            <motion.svg
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full text-teal-100"
            >
              <path
                d="M0 50C0 22.3858 22.3858 0 50 0C77.6142 0 100 22.3858 100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50Z"
                fill="currentColor"
                className="opacity-20"
              />
              <path
                d="M10 50C10 27.9086 27.9086 10 50 10C72.0914 10 90 27.9086 90 50C90 72.0914 72.0914 90 50 90C27.9086 90 10 72.0914 10 50Z"
                stroke="currentColor"
                strokeWidth="2"
                className="opacity-40"
              />
              <path
                d="M20 50C20 33.4315 33.4315 20 50 20C66.5685 20 80 33.4315 80 50C80 66.5685 66.5685 80 50 80C33.4315 80 20 66.5685 20 50Z"
                stroke="currentColor"
                strokeWidth="2"
                className="opacity-60"
              />
            </motion.svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
