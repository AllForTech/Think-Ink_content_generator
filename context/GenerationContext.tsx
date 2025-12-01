'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import { ReadonlyURLSearchParams, useParams, useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { getGeneratedContents, getScheduledJobs } from '@/lib/db/content';
import { SystemPromptOption } from '@/components/Layout/Dashboard/Generate/AISystemConfig';
import { predefinedPrompts } from '@/lib/AI/ai.system.prompt';
import { refinePrompt } from '@/lib/AI/ai.actions';

export type ChatHistoryType = {
  id: string;
  role: 'user' | 'agent';
  content: string | null;
  images?: any[] | null;
  scrapedData?: any[] | null;
  searchResults?: any[] | null;
  attachedFile?: any | null;
};

export type PanelTabsStateType = 'prompt' | 'history' | 'source' | 'management' | 'images';

export type ContentSources = { snippet: string; url: string };

export type ScrapedDataType = { url: string; content: string };

export type UnsplashImagesType = { url: string; alt_description: string; photographer: string };

export const panelTabsState = {
  prompt: 'prompt',
  images: 'images',
  system: 'system',
};

export const contentRendererTabsState = {
  content: 'content',
  editor: 'editor',
  sources: 'sources',
  markdown: 'markdown',
  templates: 'templates'
};

// --- 1. Define the Context Interface (What components can access) ---
interface GenerationContextType {
  // The final structured output from the AI
  generatedContent: string | null;
  setGeneratedContent: (content: string) => void;

  // State variables
  isLoading: boolean;
  error: string | null;

  // Actions
  generateContent: (
    prompt: string,
    tags: string[],
    tone: string,
    url: string[],
    attachedFile: any,
  ) => Promise<void>;
  clearContent: () => void;

  chatHistory: ChatHistoryType[];

  replaceCurrentContent: (history: ChatHistoryType) => void;

  handleSelection: (type: string) => void;
  handleDocxExport: (markdownContent: string) => void;

  panelTabs: PanelTabsStateType;
  setPanelTabs: (panelTabs: PanelTabsStateType) => void;

  contentSources: ContentSources[];
  setContentSources: (contentSources: ContentSources[]) => void;
  unsplashImages: any[];
  setUnsplashImages: (unsplashImages: any[]) => void;
  scrapedData: ScrapedDataType[];
  setScrapedData: (scrapedData: ScrapedDataType[]) => void;
  localImages: any[];
  setLocalImages: (image: any[]) => void;
  setChatHistory: (history: ChatHistoryType[]) => void;

  updateCurrentContent: () => void;
  isUpdating: boolean;
  setIsUpdating: (prev: boolean) => void;

  currentSessionId: string;
  setCurrentSessionId: (id: string) => void;

  allContents: any[];
  setAllContents: (contents: any[]) => void;

  scheduledJobs: any[];
  setScheduledJobs: any;

  isDashboardLoading: boolean;
  setIsDashboardLoading: (value: boolean) => void;
  isSchedulesLoading: boolean;
  setIsSchedulesLoading: (value: boolean) => void;

  selectedPrompt: SystemPromptOption;
  setSelectedPrompt: (value: SystemPromptOption) => void;

  isRefining: boolean;
  setIsRefining: (prev: boolean) => void;
  isViewingGoal: boolean;
  setIsViewingGoal: (prev: boolean) => void;
  prompt: string;
  setPrompt: (value?: string) => void;
  isRefineLoading: boolean;
  setIsRefineLoading: (prev?: boolean) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (prev?: boolean) => void;

  onRefinePrompt: () => Promise<string>;

  triggerWebhookDispatch: () => Promise<void>;
}

// --- 2. Create the Context with Default Values ---
const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

// --- 3. Create the Provider Component ---
export function ContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { content_id } = useParams();

  const { user } = useAuth();

  const [allContents, setAllContents] = useState([]);
  const [scheduledJobs, setScheduledJobs] = useState([]);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [panelTabs, setPanelTabs] = useState<PanelTabsStateType>('prompt');
  const [contentSources, setContentSources] = useState<ContentSources[]>([]);
  const [unsplashImages, setUnsplashImages] = useState<UnsplashImagesType[]>([]);
  const [scrapedData, setScrapedData] = useState<ScrapedDataType[]>([]);
  const [localImages, setLocalImages] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [isSchedulesLoading, setIsSchedulesLoading] = useState(false);
  const [isRefineLoading, setIsRefineLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isViewingGoal, setIsViewingGoal] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<SystemPromptOption>(predefinedPrompts[0]);

  useEffect(() => {
    fetchContents();
    fetchScheduledJobs();
  }, []);

  const fetchContents = useCallback(async () => {
    setIsDashboardLoading(true);
    try {
      const contents = await getGeneratedContents();
      if (contents) {
        setAllContents(contents);
      } else {
        setAllContents([]);
      }
    } catch (e) {
      toast.error(e.message || 'Error fetching contents');
    } finally {
      setIsDashboardLoading(false);
    }
  }, [setAllContents]);

  const fetchScheduledJobs = useCallback(async () => {
    setIsSchedulesLoading(true);
    try {
      const schedules = await getScheduledJobs();
      if (schedules) {
        setScheduledJobs(schedules);
      } else {
        setScheduledJobs([]);
      }
    } catch (e) {
      toast.error(e.message || 'Error fetching scheduled jobs');
    } finally {
      setIsSchedulesLoading(false);
    }
  }, [setScheduledJobs]);

  // The function to call the Next.js API Route
  const generateContent = async (
    prompt: string,
    tags: string[],
    tone: string,
    url: string[],
    attachedFile: any,
  ) => {
    if (!prompt || !content_id) {
      return;
    }
    const id = nanoid();
    const sessionId = nanoid();

    const payload = {
      prompt: prompt,
      tags: tags,
      tone: tone,
      url: url,
      file: attachedFile,
      system: selectedPrompt,
    };

    setIsLoading(true);
    setGeneratedContent('');
    setPrompt('');
    setChatHistory((prev) => [...prev, { id, role: 'user', content: prompt }]);

    try {
      const formData = new FormData();

      // Append standard fields
      for (const key in payload) {
        if (key !== 'file') {
          formData.append(key, JSON.stringify(payload[key]));
        }
      }

      // Append the file using Blob conversion
      if (payload.file) {
        const file = payload.file;
        // Convert Base64 string back to a Blob object
        const blob = await fetch(file.data).then((res) => res.blob());

        formData.append('document', blob, file.name); // 'document' is the expected field name on your server
      }

      const response = await fetch(`/api/generate/${content_id}/${sessionId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to generate content due to server error.');
      }

      const resultData = await response.json();

      setGeneratedContent(resultData.mainContent);
      setContentSources(resultData.searchResults);
      setUnsplashImages(resultData.unsplashImages);
      setScrapedData(resultData.scrapedDtate);

      setChatHistory((prev) => [
        ...prev,
        {
          id: sessionId,
          role: 'agent',
          content: resultData.mainContent,
          scrapedData: resultData.scrapedData,
          images: resultData.unsplashImages,
          searchResults: resultData.searchResults,
          attachedFile: null,
        },
      ]);
      setCurrentSessionId(sessionId);
      const contentExist = allContents.filter((c) => c.id === content_id);
      if (contentExist) return;

      setAllContents((prev) => [
        {
          contentId: content_id,
          content: generatedContent,
          prompt,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (error) {
      setError(error.message);
      toast.error(
        <p className={'text-xs font-medium text-red-400'}>
          {error?.message ?? 'Error connecting to Ai model'}
        </p>,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const replaceCurrentContent = (history: ChatHistoryType) => {
    if (!history || !chatHistory) return;
    if (history.role !== 'agent') return;

    const selectedMessage = chatHistory.find(
      (hstry: ChatHistoryType) => hstry.id.trim() === history?.id?.trim(),
    );

    if (!selectedMessage) return;

    setCurrentSessionId(selectedMessage?.id);
    setGeneratedContent(selectedMessage?.content);
    setUnsplashImages(selectedMessage.images);
    setContentSources(selectedMessage.searchResults);
    setScrapedData(selectedMessage.scrapedData);
  };

  const clearContent = useCallback(() => {
    setGeneratedContent(null);
    setError(null);
  }, []);

  const handleGenerate = async () => {
    const newId = nanoid();
    if (!user) return;

    const supabase = await createClient();

    const { error, data } = await supabase
      .from('contents')
      .insert({
        author_id: user.id,
        contentId: newId,
      })
      .select('*');

    if (error) toast.error(error.message || 'Error creating content');

    setGeneratedContent(data[0]?.content);

    router.push(`/dashboard/generate/${data[0]?.contentId}`);
  };

  // Example Client-Side Function (e.g., in a React Component)

  async function handleDocxExport(markdownContent: string) {
    const response = await fetch('/api/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        markdown: markdownContent,
        filename: 'Web_Content_Architect_Report', // Customize the name
      }),
    });

    if (!response.ok) {
      toast.error('Export failed');
      return;
    }

    // 1. Get the binary data (Blob) from the response
    const blob = await response.blob();

    // 2. Extract the filename from the Content-Disposition header (optional but good practice)
    const contentDisposition = response.headers.get('Content-Disposition');

    let filename = 'document.docx';

    if (contentDisposition) {
      // Basic regex to extract filename="X.docx"
      const matches = contentDisposition.match(/filename="(.+)"/);
      if (matches && matches[1]) {
        filename = matches[1];
      }
    }

    // 3. Create a temporary link element to trigger the download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url); // Clean up the object URL
  }

  const updateCurrentContent = async () => {
    if (!currentSessionId || !user) return;

    setIsUpdating(true);

    const supabase = await createClient();

    try {
      const { error } = await supabase
        .from('user_contents')
        .update({
          content: generatedContent,
        })
        .eq('session_id', currentSessionId)
        .eq('author_id', user.id)
        .eq('content_id', content_id);

      if (error) {
        toast.error(error?.message ?? 'Error updating session');
      }
    } catch (e) {
      toast.error(e.message || 'Error updating session');
    } finally {
      setIsUpdating(false);
    }
  };

  const onRefinePrompt = useCallback(async () => {
    setIsRefineLoading(true);
    const refinedPrompt = await refinePrompt(prompt);
    setPrompt(refinedPrompt);
    setIsRefineLoading(false);
  }, [prompt, setPrompt]);

  // --- Webhook Trigger Function ---
  async function triggerWebhookDispatch(hookConfig, contentPayload) {
    const decryptedSecret = ""
    const apiCallBody = {
      destinationUrl: hookConfig.url,
      secretKey: decryptedSecret, // The key we use for target validation
      payload: contentPayload,     // The content we are sending
    };

    try {
      const response = await fetch('/api/execute-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiCallBody),
      });

      const result = await response.json();

      if (!result.success) {
        console.error(`Webhook execution failed on server: ${result.error}`);
        toast.error('Webhook execution failed on server');
        return;
      }

      console.log(`Webhook successfully dispatched to ${hookConfig.url}`);
      toast.error('Webhook successfully dispatched');
      // Show success message!

    } catch (error) {
      console.error("Local network error calling webhook API:", error);
      toast.error('Local network error calling webhook API');
    }
  }

  const value = {
    generatedContent,
    isLoading,
    error,
    generateContent,
    clearContent,
    chatHistory,
    replaceCurrentContent,
    handleSelection: handleGenerate,
    handleDocxExport,
    setGeneratedContent,
    panelTabs,
    setPanelTabs,
    contentSources,
    setContentSources,
    unsplashImages,
    setUnsplashImages,
    scrapedData,
    setScrapedData,
    localImages,
    setLocalImages,
    setChatHistory,
    updateCurrentContent,
    isUpdating,
    setIsUpdating,
    currentSessionId,
    setCurrentSessionId,
    allContents,
    setAllContents,
    scheduledJobs,
    setScheduledJobs,
    isDashboardLoading,
    setIsDashboardLoading,
    isSchedulesLoading,
    setIsSchedulesLoading,
    selectedPrompt,
    setSelectedPrompt,
    isRefining,
    setIsRefining,
    isViewingGoal,
    setIsViewingGoal,
    prompt,
    setPrompt,
    isRefineLoading,
    onRefinePrompt,
    isDialogOpen,
    setIsDialogOpen,
    triggerWebhookDispatch
  };

  return <GenerationContext.Provider value={value}>{children}</GenerationContext.Provider>;
}

// --- 4. Custom Hook for Consumption ---
export function useContent() {
  const context = useContext(GenerationContext);
  if (context === undefined) {
    throw new Error('useGeneration must be used within a GenerationProvider');
  }
  return context;
}
