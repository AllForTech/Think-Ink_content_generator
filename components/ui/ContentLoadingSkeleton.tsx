'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader } from 'lucide-react';

export const ContentLoadingSkeleton = ({isGenerating = true}) => {
  return (
    <div className={cn('container-full flex flex-col gap-5 p-4 md:p-6')}>
      {/* 1. Header and Loader */}
      {isGenerating ? (
         <div
        className={cn('flex h-fit w-full items-center gap-3 border-b border-neutral-200/50 pb-3')}
      >
        <Loader className={cn('animate-spin text-black')} size={18} />
        <p className={cn('text-foreground/80 text-sm font-medium tracking-wide')}>
          Generating Content. Please wait...
        </p>
      </div>
      ) : (
         <div
        className={cn('flex h-fit w-full items-center gap-3 border-b border-neutral-200/50 pb-3')}
      >
        <Loader className={cn('animate-spin text-black')} size={18} />
        <p className={cn('text-foreground/80 text-sm font-medium tracking-wide')}>
          Loading editor...
        </p>
      </div>
      )}

      {/* 2. Main Title/Heading Skeleton */}
      <div className="w-full">
        <Skeleton className={'h-8 w-3/4 rounded-md bg-neutral-300/50 dark:bg-neutral-700/80'} />
      </div>

      {/* 3. Sub-Heading/Metadata Skeleton */}
      <div className="flex w-full space-x-4">
        <Skeleton className={'h-4 w-2/5 rounded-full bg-neutral-300/40 dark:bg-neutral-700/60'} />
        <Skeleton className={'h-4 w-1/5 rounded-full bg-neutral-300/40 dark:bg-neutral-700/60'} />
      </div>

      {/* 4. Main Content Block Skeleton (Mimics paragraphs/code) */}
      <div className={'w-full space-y-3'}>
        {/* Paragraph 1 */}
        <Skeleton className={'h-4 w-full rounded-sm bg-neutral-300/50 dark:bg-neutral-700/80'} />
        <Skeleton className={'h-4 w-[95%] rounded-sm bg-neutral-300/50 dark:bg-neutral-700/80'} />
        <Skeleton className={'h-4 w-[70%] rounded-sm bg-neutral-300/50 dark:bg-neutral-700/80'} />

        {/* Spacer */}
        <div className="h-4"></div>

        {/* Paragraph 2 */}
        <Skeleton className={'h-4 w-full rounded-sm bg-neutral-300/50 dark:bg-neutral-700/80'} />
        <Skeleton className={'h-4 w-[80%] rounded-sm bg-neutral-300/50 dark:bg-neutral-700/80'} />
        <Skeleton className={'h-4 w-[90%] rounded-sm bg-neutral-300/50 dark:bg-neutral-700/80'} />

        {/* Large Block/Footer (Mimics CTA or Summary) */}
        <div className="pt-6">
          <Skeleton className={'h-10 w-1/2 rounded-lg bg-neutral-500/30 dark:bg-neutral-800/50'} />
        </div>
        {!isGenerating && (
          <div className="pt-6">
          <Skeleton className={'h-10 w-1/2 rounded-lg bg-neutral-500/30 dark:bg-neutral-800/50'} />
        </div>
        )}
      </div>
    </div>
  );
};
