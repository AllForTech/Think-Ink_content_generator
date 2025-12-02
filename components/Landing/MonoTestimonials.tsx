'use client'

import React from 'react';
import { motion } from 'framer-motion';

const quotes = [
  {
    id: 'q1',
    quote: 'ThinkInk transformed our content workflow — outputs are cleaner and more consistent than ever.',
    author: 'Jamal T., Editorial Lead',
  },
  {
    id: 'q2',
    quote: 'The two-step prompt refinement saved us hours per week and improved our SEO metrics.',
    author: 'Sara L., Growth Marketer',
  },
  {
    id: 'q3',
    quote: 'Reliable, fast, and the minimal UI keeps our writers focused. A modern tool for modern teams.',
    author: 'Alex P., Product Manager',
  }
];

export default function MonoTestimonials() {
  return (
    <section id="testimonials" className="bg-white py-20">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 text-center">
        <motion.h3 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-lg font-semibold text-neutral-700 uppercase tracking-wide">Trusted & loved</motion.h3>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className="mt-3 max-w-2xl mx-auto text-black text-2xl font-extrabold">Hear what early teams say</motion.p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {quotes.map((q, idx) => (
            <motion.blockquote key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: idx * 0.06 }} className="rounded-xl border border-neutral-100 p-6 text-left shadow-sm bg-white">
              <p className="text-neutral-700 text-sm">“{q.quote}”</p>
              <cite className="mt-3 block font-semibold text-black text-xs">{q.author}</cite>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
