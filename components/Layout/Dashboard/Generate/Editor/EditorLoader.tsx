// components/ui/CodeEditorLoader.tsx
import React from 'react';
import { cn } from '@/lib/utils'; // Assuming 'cn' is available for utility merging

interface CodeEditorLoaderProps {
  className?: string;
}

const LINE_COUNT = 8; // Number of simulated lines
const BASE_DELAY = 100; // Base delay for animation staggering

export default function EditorLoader({ className }: CodeEditorLoaderProps) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-xl bg-stone-300 p-4 shadow-2xl md:p-6',
        'flex flex-col space-y-2',
        className, // Allows setting height/width from the dynamic import
      )}
    >
      {/* Simulated Code/Content Lines */}
      {Array.from({ length: LINE_COUNT }).map((_, index) => {
        // Line width varies to mimic code structure
        const widthClass =
          index === 0 || index === LINE_COUNT - 1
            ? 'w-2/3' // Shorter lines for start/end
            : index % 2 === 0
              ? 'w-full'
              : 'w-5/6'; // Full width or slightly shorter

        // Stagger the animation using CSS variable and inline style
        const animationDelay = `${BASE_DELAY * index}ms`;

        return (
          <div
            key={index}
            className={cn(
              'h-3 rounded-sm bg-stone-100 opacity-0', // Base style, initially hidden
              widthClass,
              'animate-fade-in-line', // Apply keyframe animation
            )}
            style={{
              animationDelay: animationDelay,
              animationFillMode: 'forwards', // Keep the final state
            }}
          />
        );
      })}

      {/* --- Inline CSS for Animations --- */}
      <style jsx>{`
        /* Keyframe for the "typing" or fade-in effect on lines */
        @keyframes fade-in-line {
          0% {
            opacity: 0;
            transform: translateY(5px);
          }
          50% {
            opacity: 0.8;
            transform: translateY(0);
          }
          100% {
            opacity: 1;
          }
        }

        .animate-fade-in-line {
          animation-duration: 0.5s;
          animation-timing-function: ease-out;
        }
      `}</style>
    </div>
  );
}
