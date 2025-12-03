import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  imagePlugin,
  linkPlugin,
  toolbarPlugin, // Required for the toolbar UI!
  BoldItalicUnderlineToggles, // Toolbar contents
  ListsToggle,
  BlockTypeSelect,
  UndoRedo,
  CodeToggle,
  InsertImage,
  codeBlockPlugin,
  sandpackPlugin,
  codeMirrorPlugin,
  directivesPlugin,
  AdmonitionDirectiveDescriptor,
  diffSourcePlugin,
  markdownShortcutPlugin,
  tablePlugin,
  InsertTable,
  InsertSandpack,
  linkDialogPlugin,
  imageDialogState$,
  jsxPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { cn } from '@/lib/utils';
import { useContent } from '@/context/GenerationContext';
import CustomImageDialog from '@/components/Layout/Dashboard/Generate/Editor/CustomImageDialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCallback, useEffect } from 'react';

export default function Editor() {
  const { setGeneratedContent, generatedContent, updateCurrentContent } = useContent();

  useEffect(() => {
    let timer = null;

    timer = setTimeout(() => {
      updateCurrentContent();
    }, 1000);

    return () => clearTimeout(timer);
  }, [generatedContent, setGeneratedContent]);

  return (
    <ScrollArea className={cn('container-full center')}>
      <MDXEditor
        markdown={generatedContent}
        onChange={setGeneratedContent}
        plugins={[
          // Toolbar with basic controls
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BlockTypeSelect />
                <BoldItalicUnderlineToggles />
                <ListsToggle options={['number', 'bullet', 'check']} />
                <CodeToggle />
                <CustomImageDialog/>
                <InsertTable />
                <InsertSandpack />
                {/* You can add more buttons here */}
              </>
            ),
            toolbarClassName: 'toolbar-className',
          }),
          imagePlugin({
            allowSetImageDimensions: true,
            disableImageResize: false,
          }),
          headingsPlugin(),
          jsxPlugin(),
          linkDialogPlugin({}),
          linkPlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: 'javaScript' }),
          // sandpackPlugin({ sandpackConfig: virtuosoSampleSandpackConfig }),
          codeMirrorPlugin({
            codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript' },
          }),
          directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
          diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
          markdownShortcutPlugin(),
          listsPlugin(),
          quotePlugin(),
          imagePlugin(),
          linkPlugin(),
          tablePlugin(),
        ]}
        contentEditableClassName={cn(
          'container-full !h-full p-2 pt-10! overflow-y-auto prose markdown markdown-content-area',
        )}
        className={cn('container-full overflow-hidden rounded-md bg-white')}
      />
    </ScrollArea>
  );
}
