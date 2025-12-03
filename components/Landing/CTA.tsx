'use client'

import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

function CTA() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6 md:px-8 lg:px-12">
        <motion.div className="rounded-3xl bg-black border border-neutral-700 p-10 shadow-lg shadow-neutral-700 flex flex-col md:flex-row items-center justify-between gap-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white">Start creating memorable content today.</h3>
            <p className="mt-2 text-neutral-300">Try Think-Ink for free no credit card required. Scale your writing workflows with minimal overhead.</p>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <Link href="/sign-up"><Button className="bg-white text-nowrap text-black px-5 py-3 rounded-md text-sm font-semibold hover:bg-neutral-300">Get started</Button></Link>
            <Link href="#features"><button className="px-4 py-2 text-nowrap rounded-md text-sm border text-white! border-neutral-200 hover:bg-neutral-600">See features</button></Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(CTA);