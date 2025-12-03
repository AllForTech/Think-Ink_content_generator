'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { contentRendererTabsState, useContent } from '@/context/GenerationContext';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Content } from '@/components/Layout/Dashboard/Generate/ContentRenderer';
import { MarkdownViewer } from '@/components/Layout/Dashboard/Generate/content/MarkdownViewer';
import { Source } from '../RightSidebarPanel';
import EditorLoader from '@/components/Layout/Dashboard/Generate/Editor/EditorLoader';
import { FileText, PenLine, Link as LinkIcon, Code } from 'lucide-react';
import { PromptSelector } from '@/components/Layout/Dashboard/Generate/PromptSelector';
import { ContentLoadingSkeleton } from '@/components/ui/ContentLoadingSkeleton';

const Editor = dynamic(() => import('../Editor/Editor'), {
  // Make sure we turn SSR off
  ssr: false,
  loading: () => <ContentLoadingSkeleton isGenerating={false} />,
});

export default function Renderer() {
  const { isLoading } = useContent();

  return (
    <div
      className={cn(
        'center h-full flex-1 flex-col gap-2.5 overflow-hidden rounded-lg shadow-md shadow-stone-400',
      )}
    >
      <Tabs
        defaultValue={contentRendererTabsState.content}
        className={'container-full center flex-col !justify-start gap-2 overflow-hidden p-1.5'}
      >
        <RendererTabs />
        <div className="container-full center overflow-hidden">
          <TabsContent className={'container-full'} value={contentRendererTabsState.content}>
            <Content isLoading={isLoading} />
          </TabsContent>
          <TabsContent
            className={'container-full relative'}
            value={contentRendererTabsState.editor}
          >
            <Editor />
          </TabsContent>
          <TabsContent
            className={'container-full relative'}
            value={contentRendererTabsState.sources}
          >
            <Source />
          </TabsContent>
          <TabsContent
            className={'container-full overflow-hidden'}
            value={contentRendererTabsState.markdown}
          >
            <MarkdownViewer />
          </TabsContent>
          <TabsContent
            className={'container-full overflow-hidden'}
            value={contentRendererTabsState.templates}
          >
            <PromptSelector/>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

const RendererTabs = () => {
  const { generatedContent } = useContent();

  const iconMap = {
    [contentRendererTabsState.content]: FileText,
    [contentRendererTabsState.editor]: PenLine,
    [contentRendererTabsState.sources]: LinkIcon,
    [contentRendererTabsState.markdown]: Code,
    [contentRendererTabsState.templates]: Code,
  };

  return (
    generatedContent && (
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={'center h-fit w-full flex-col gap-2.5'}
      >
        <TabsList className={cn('center w-full gap-2 bg-stone-200')}>
          {Object.values(contentRendererTabsState).map((tab) => {
            const Icon = iconMap[tab];

            return (
              <TabsTrigger
                key={tab}
                value={tab}
                className={cn(
                  'transition-300 text-xs font-semibold capitalize data-[state=active]:bg-neutral-900 data-[state=active]:text-white',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="capitalize">{tab}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </motion.div>
    )
  );
};
