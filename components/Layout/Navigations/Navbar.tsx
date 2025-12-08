'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { UserAvatar } from './UserAvatar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Eye, Code } from 'lucide-react';
import { useGlobalState } from '@/context/GlobalStateContext';
import { useContent } from '@/context/GenerationContext';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export const Navbar = () => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const { setIsEditingRaw, isEditingRaw } = useGlobalState();
  const { selectedPrompt, isDialogOpen, setIsDialogOpen } = useContent();

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="w-full shadow-lg shadow-black/5"
    >
      <nav className="h-[35px] w-full border-b border-gray-100 bg-white/95 backdrop-blur-xl">
        <div className="container mx-auto flex h-full items-center justify-between px-4">
          {/* Center/Main Links (Empty as per original) */}
          <div className="hidden items-center space-x-8 px-3 md:flex">
            {selectedPrompt && pathname.startsWith('/dashboard/generate') && (
              <p className={cn('text-xs font-semibold text-black')}>
                {selectedPrompt?.label ?? ' '}
              </p>
            )}
          </div>

          {/* Right: Actions and Avatar */}
          <div className={'center gap-5'}>

            {/* Desktop Avatar */}
            <div className="hidden items-center space-x-4 md:flex">
              <UserAvatar />
            </div>

            {/* Mobile Menu Button + Mobile Avatar */}
            <div className="flex items-center space-x-4 md:hidden">
              <UserAvatar />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded p-1 text-black transition-colors hover:bg-gray-100"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown (Animated) */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100 bg-white md:hidden"
          >
            <div className="container mx-auto flex flex-col space-y-4 px-4 py-4">
              {/* Mobile Links would go here */}
              <Link href="/settings" className="font-medium text-black hover:text-black">
                Settings
              </Link>
              <Link href="/help" className="font-medium text-black hover:text-black">
                Help
              </Link>
            </div>
          </motion.div>
        )}
      </nav>
    </motion.div>
  );
};
