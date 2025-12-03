'use client'

import React, { memo } from 'react';

function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-100 py-10">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 text-sm text-neutral-700">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="rounded-sm px-2 py-1 border border-black/10 text-black font-semibold">TI</div>
            <div>
              <div className="text-black font-bold">Think-Ink</div>
              <div className="text-xs text-neutral-500">AI content refined for quality</div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-600">
            <a href="#features" className="hover:text-black text-black!">Features</a>
            {/* <a href="#testimonials" className="hover:text-black text-black!">Testimonials</a> */}
          </div>

          <div className="text-xs text-neutral-500">© {new Date().getFullYear()} Think-Ink — All rights reserved</div>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
