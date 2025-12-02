'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MonoCTA() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6 md:px-8 lg:px-12">
        <motion.div className="rounded-3xl bg-white border border-neutral-100 p-10 shadow-lg shadow-neutral-300 flex flex-col md:flex-row items-center justify-between gap-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-extrabold text-black">Start creating memorable content today.</h3>
            <p className="mt-2 text-neutral-600">Try ThinkInk for free no credit card required. Scale your writing workflows with minimal overhead.</p>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <Link href="/sign-up"><Button className="bg-black text-nowrap text-white px-5 py-3 rounded-md text-sm font-semibold hover:bg-neutral-900">Get started</Button></Link>
            <Link href="#features"><button className="px-4 py-2 text-nowrap rounded-md text-sm border text-black! border-neutral-200 hover:bg-neutral-100">See features</button></Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
