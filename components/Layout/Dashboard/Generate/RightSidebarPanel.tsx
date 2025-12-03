'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ContentSources,
  panelTabsState,
  PanelTabsStateType,
  useContent,
} from '@/context/GenerationContext';
import { cn, extractMarkdownImageUrls } from '@/lib/utils';
import { PromptProps } from '@/components/Layout/Dashboard/Generate/Prompt';
import Prompt from '@/components/Layout/Dashboard/Generate/Prompt';
import { ChatHistoryRenderer } from '@/components/Layout/Dashboard/Generate/ChatHistoryRenderer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Button } from '@mdxeditor/editor';
import { TrashIcon, Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';
import MobileSheetWrapper from '@/components/Layout/Dashboard/Generate/MobileSheetWrapper';
import { SystemPromptSelector } from '@/components/Layout/Dashboard/Generate/AISystemConfig';
import { MessageSquare, ImageIcon, Settings2 } from 'lucide-react';

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);
  return matches;
};

export const RightSidebarPanel = ({ contentId, onGenerate }: PromptProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const isMobile = useMediaQuery('(max-width: 768px)');

  // The actual Tabs content block, which remains unchanged
  const SidebarContent = (
    <Tabs
      defaultValue={panelTabsState.prompt}
      className={'container-full center flex-col gap-2 p-1.5'}
    >
      <PanelTabs />
      <div className={cn('center h-full flex-1')}>
        <TabsContent className={'h-full flex-1'} value={panelTabsState.prompt}>
          <Prompt contentType={''} onGenerate={onGenerate} contentId={contentId} />
        </TabsContent>
        <TabsContent className={'container-full'} value={panelTabsState.system}>
          <SystemPromptSelector onPromptChange={setSystemPrompt} />
        </TabsContent>
        <TabsContent className={'container-full'} value={panelTabsState.images}>
          <Images />
        </TabsContent>
        {/*<TabsContent className={'container-full'} value={panelTabsState.management}>*/}
        {/* <Management/>*/}
        {/*</TabsContent>*/}
      </div>
    </Tabs>
  );

  return (
    <MobileSheetWrapper isMobile={isMobile} isOpen={isSheetOpen} setIsOpen={setIsSheetOpen}>
      {SidebarContent}
    </MobileSheetWrapper>
  );
};

const PanelTabs = () => {
  // Define the map of string keys to Icon Components
  const iconMap = {
    [panelTabsState.prompt]: MessageSquare,
    [panelTabsState.images]: ImageIcon,
    [panelTabsState.system]: Settings2,
  };

  return (
    <div className={'center h-fit w-full flex-col gap-2.5'}>
      <TabsList className={cn('center w-full gap-2 bg-stone-200')}>
        {Object.values(panelTabsState).map((tab: PanelTabsStateType) => {
          // 1. Assign the component to a capitalized variable
          const Icon = iconMap[tab];

          return (
            <TabsTrigger
              key={tab}
              value={tab}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-all duration-300',
                'data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm',
              )}
            >
              <Icon className={cn('hidden h-3.5 w-3.5', 'lg:block')} />

              <span className="text-xs capitalize">{tab}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </div>
  );
};

export const Source = () => {
  const { contentSources } = useContent();

  return (
    <ScrollArea
      className={cn('center container-full absolute inset-0 flex-col gap-2.5 bg-white p-4')}
    >
      <h3 className="mb-3 w-full border-b border-black/10 pb-2 text-lg font-bold text-black">
        Content Sources & Snippets
      </h3>
      {/* Refactored source snippet style for black/white theme */}
      {contentSources &&
        contentSources?.map((source: ContentSources, index) => (
          <div
            key={index}
            className={cn(
              'mb-2.5 h-fit w-full gap-3 overflow-hidden rounded-md border border-black/20 bg-white p-4 text-xs text-black shadow-sm',
            )}
          >
            <p className="mb-1 text-sm font-semibold">{source?.url?.substring(0, 70)}...</p>
            {/*<p className="text-black/90 text-xs text-wrap font-medium italic">{source?.snippet}</p>*/}
          </div>
        ))}
      {contentSources?.length === 0 && (
        <div className="p-6 text-center text-black/70">No sources found.</div>
      )}
    </ScrollArea>
  );
};

export const Images = ({ width = 400}) => {
  const { generatedContent, setGeneratedContent, localImages, setLocalImages } = useContent();

  // MAINTAINED LOGIC: Extract images from Markdown
  const extractedUrls = useMemo(() => {
    return extractMarkdownImageUrls(generatedContent);
  }, [generatedContent]);

  const handleInsertImage = (url: string) => {
    const markdownImage = `\n![Image](${url})\n`;
    setGeneratedContent(generatedContent + markdownImage);
    toast.success('Image inserted into content!');
  };

  // COMBINED LIST: Merge local and extracted images
  const allImageUrls = useMemo(() => {
    if (!localImages) {
      return Array.from(extractedUrls);
    }
    // Use a Set to ensure uniqueness, prioritizing local over extracted if URLs overlap
    return Array.from(new Set([...localImages, ...extractedUrls]));
  }, [localImages, extractedUrls]);

  // MAINTAINED LOGIC: Handle file upload
  const handleFileUpload = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          toast.error('Only image files are allowed.');
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Url = reader.result;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          setLocalImages((prev) => [base64Url, ...prev]);
          toast.success('Image uploaded locally.');
          event.target.value = null; // Reset file input
        };
        reader.readAsDataURL(file);
      }
    },
    [setLocalImages],
  );

  // MAINTAINED LOGIC: Handler to remove a local image
  const handleRemoveLocalImage = useCallback(
    (urlToRemove: string) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setLocalImages((image: string[]) => image.filter((url) => url !== urlToRemove));
    },
    [setLocalImages],
  );

  // MAINTAINED LOGIC: Check if the URL came from local upload
  const isLocalImage = (url) => url.startsWith('data:image/');

  const hasImages = allImageUrls.length > 0;

  return (
    <ScrollArea
      className={cn(
        `center container-full h-full max-h-[82dvh] w-[${width}px]! flex-col gap-2.5 bg-white p-4`,
      )}
    >
      <h3 className="mb-3 w-full border-b border-black/10 pb-2 text-lg font-bold text-black">
        Images
      </h3>

      {hasImages ? (
        <div className="grid w-full grid-cols-2 gap-3">
          {allImageUrls &&
            allImageUrls.map((url: string, index: number) => (
              <motion.div
                key={url?.substring(0, 50) + index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="group relative aspect-square overflow-hidden rounded-md border border-black/10 shadow-sm"
              >
                {/* Image Preview Container */}
                <div
                  className="flex h-full w-full items-center justify-center bg-black/10 bg-cover bg-center text-xs text-black/50 transition-all duration-300 group-hover:scale-[1.05]"
                  style={{ backgroundImage: `url(${url})` }}
                >
                  {/* Label for Local/Extracted */}
                  <span
                    className={cn(
                      'absolute top-2 right-2 rounded p-1 text-[10px] font-semibold',
                      isLocalImage(url)
                        ? 'bg-black text-white'
                        : 'border border-black/20 bg-white text-black',
                    )}
                  >
                    {isLocalImage(url) ? 'LOCAL' : 'EXTRACTED'}
                  </span>
                </div>

                {/* Action Buttons Overlay */}
                <div className="absolute h-fit w-full bottom-0 flex flex-row gap-1 items-center justify-end bg-black/30 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {/* Insert Button (Primary Action) */}
                  <div
                    onClick={() => handleInsertImage(url)}
                    className="mb-1 w-full bg-indigo-600 cursor-pointer text-xs rounded-md p-2.5 transition-300 font-semibold text-white hover:bg-indigo-700"
                  >
                    Insert into Editor
                  </div>

                  {/* Remove Button (Only for locally uploaded images) */}
                  {isLocalImage(url) && (
                    <div
                      onClick={() => handleRemoveLocalImage(url)}
                      className="container-fit bg-white border border-black/20 rounded-md p-2.5 transition-300 text-xs font-semibold text-black"
                    >
                      <TrashIcon className="h-3 font-semibold! text-red-500 w-3" size={16} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
        </div>
      ) : (
        <div className="w-full rounded-lg border border-black/10 p-6 text-center text-black/70">
          No images found. Upload one or generate content to see suggestions.
        </div>
      )}

      {/* Upload Block (Creative Redesign of the original h2/p div) */}
      <div className={cn('between mt-3.5 mb-4 w-full')}>
        <label htmlFor="local-image-upload" className="w-full cursor-pointer">
          <div className="flex h-[60px] w-full items-center justify-between rounded-lg border border-black/10 bg-white p-3 shadow-sm transition-colors hover:bg-stone-200">
            <h2 className={cn('flex items-center text-sm font-semibold text-black')}>
              <Upload className="mr-2 h-4 w-4 text-black/80" />
              Upload Local Image
            </h2>
            <div
              className={
                'center h-8 rounded-md bg-black px-3 text-white transition-colors hover:bg-stone-600'
              }
            >
              <div className="flex items-center">
                <span className="text-xl leading-none">+</span>
              </div>
            </div>
            {/* Hidden file input, linked via 'htmlFor' */}
            <input
              id="local-image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </label>
      </div>
    </ScrollArea>
  );
};

const Management = () => {
  // State for the API Key input
  const [apiKey, setApiKey] = useState('');
  // State for temporary save status message
  const [saveStatus, setSaveStatus] = useState('');

  // Handler for saving the API key (simulated)
  const handleSave = useCallback(() => {
    if (apiKey.trim() === '') {
      setSaveStatus('API Key cannot be empty.');
      return;
    }

    // In a real application, you would save this to a database or configuration file.

    setSaveStatus('Settings saved successfully!');

    // Clear status after a short period
    setTimeout(() => setSaveStatus(''), 3000);
  }, [apiKey]);

  return (
    <ScrollArea className="z-40 h-full max-h-[82dvh] w-full max-w-[400px] bg-white p-6 text-black shadow-2xl transition-transform duration-300 ease-in-out sm:p-8 md:translate-x-0">
      {/* Sidebar Header */}
      <h1 className="mb-8 pb-4 text-xl font-extrabold">Management Settings</h1>

      {/* API Key Management Section */}
      <section className="mb-8 rounded-lg border border-black/30 p-4">
        <h2 className="text-md mb-4 font-bold">External API Key</h2>

        <p className="mb-4 text-xs text-black/70">
          Enter your custom AI provider API key to lift usage restrictions.
        </p>

        {/* Input Group */}
        <div className="flex flex-col space-y-3">
          <label htmlFor="apiKey" className="text-xs font-medium">
            API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            className="w-full rounded-md border border-black/50 p-3 text-xs text-black placeholder-black/50 transition duration-150 outline-none focus:border-black focus:ring-1 focus:ring-black/80"
            aria-label="API Key input field"
          />

          {/* Status and Save Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleSave}
              className="rounded-lg bg-black px-6 py-2 text-xs font-semibold text-white shadow-sm transition duration-150 hover:bg-gray-800 focus:ring-4 focus:ring-black/50 focus:outline-none active:bg-gray-900"
            >
              Save Key
            </button>

            {saveStatus && (
              <p
                className={`text-xs font-medium transition-opacity ${saveStatus.includes('saved') ? 'text-black' : 'text-gray-600'} opacity-100`}
              >
                {saveStatus}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Additional Settings (Placeholder) */}
      <section className="mb-8 rounded-lg border border-black/30 p-4 opacity-70">
        <h2 className="text-md mb-4 font-bold">Future Settings</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between border-b border-black/10 py-1 text-xs">
            <span>Toggle Feature X</span>
            <div className="h-6 w-10 rounded-full bg-gray-200"></div> {/* Placeholder switch */}
          </div>
          <div className="flex items-center justify-between py-1 text-xs">
            <span>Max Tokens Limit</span>
            <input
              type="number"
              defaultValue="2048"
              className="w-20 rounded-md border border-black/50 p-1 text-center text-xs"
            />
          </div>
        </div>
        <p className="mt-3 text-xs text-black/50 italic">
          These settings are currently read-only placeholders.
        </p>
      </section>

      {/* Footer */}
      <footer className="mt-10 border-t border-black/10 pt-4 text-center text-xs text-black/50">
        <p>&copy; 2025 Application Management</p>
      </footer>
    </ScrollArea>
  );
};
