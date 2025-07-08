// src/components/MarkdownWithCopy.tsx
import React from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import { PrismAsyncLight as PrismLight } from 'react-syntax-highlighter'
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import tsLang from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { FaRegCopy } from 'react-icons/fa'
import { cleanResponse } from '../StructureComp/cleanResponse'

PrismLight.registerLanguage('javascript', js)
PrismLight.registerLanguage('typescript', tsLang)
PrismLight.registerLanguage('python', python)
PrismLight.registerLanguage('bash', bash)

/** For TS typing ease **/
const SyntaxHighlighter: any = PrismLight

export type MarkdownWithCopyProps = {
  /** raw `message.text` from Gemini, possibly containing
      <div class='code-block'>…<br> HTML you want to clean */
  text: string
}

  
  // 1️⃣ Define your mapping once, at the top
    const prismThemeMap = {
      dark:  oneDark,
      light: oneLight,
      glass: oneLight,      // use the light Prism colors for “glass”
    } as const
    
const backgroundMap: Record<keyof typeof prismThemeMap, React.CSSProperties> = {
  dark:  {
    padding: '1rem',
    borderRadius: '0.5rem',
    margin: 0,
    overflowX: 'auto',
    whiteSpace: 'pre',
    // let Prism’s default dark bg show
  },
  light: {
    padding: '1rem',
    borderRadius: '0.5rem',
    margin: 0,
    overflowX: 'auto',
    whiteSpace: 'pre',
    // Prism’s default light bg is okay
  },
  glass: {
    padding: '1rem',
    borderRadius: '0.5rem',
    margin: 0,
    overflowX: 'auto',
    whiteSpace: 'pre',
    background: 'rgba(255 255 255/0.03)',
    boxShadow: '0 2px 4px rgb(0,0,0,0.2)',
    backdropFilter: 'blur(10px)',
  },
}

export default function MarkdownWithCopy({ text }: MarkdownWithCopyProps) {

  // 2️⃣ Read your theme exactly as you already do:
  const theme = typeof document !== 'undefined'
    ? document.documentElement.getAttribute('data-theme') as keyof typeof prismThemeMap
    : 'dark'

  // 3️⃣ Lookup the Prism style + container style:
  const prismStyle   = prismThemeMap[theme]  
  const prismBgStyle = backgroundMap[theme]
  
  // 1) Convert your <div class='code-block'><pre>… HTML into real markdown fences
  // 2) Turn <br> into line breaks
  const cleaned = cleanResponse(text);
  
  
    //   text
    // // code‑block wrapper → ```lang
    // .replace(
    //   /<div class=['"]code-block['"]>\s*<pre>\s*<code class=['"]language-(\w+)['"]>/g,
    //   '```$1\n'
    // )
    // // closing tags → ```
    // .replace(/<\/code>\s*<\/pre>\s*<\/div>/g, '\n```')
    // // any <br> → newline
    // .replace(/<br\s*\/?>/gi, '\n')

  const components: Components = {
    code: (props: any) => {
      const { inline, className, children, ...rest } = props
      const codeString = String(children).trimEnd()
      const match = /language-(\w+)/.exec(className || '')
      const lang = match?.[1] || 'text'

      if (!inline) {
        return (
          <div className="relative group my-4">
            <button
              onClick={() => void navigator.clipboard.writeText(codeString)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs theme-button2 p-2 rounded z-50 cursor-pointer"
            >
              <FaRegCopy/>
            </button>
            <SyntaxHighlighter
              language={lang}
              style={prismStyle}          
              className="custom-scrollbar-horizontal"
              PreTag="div"
              customStyle={prismBgStyle}
              // customStyle={{
              //   padding: '1rem',
              //   borderRadius: '0.5rem',
              //   margin: 0,
              //   overflowX: 'auto',
              //   whiteSpace: 'pre',
              // } as any}
              {...rest}
            >
              {codeString}
            </SyntaxHighlighter>
          </div>
        )
      }

      return (
        <code
          className="bg-gray-100 text-red-600 px-1 rounded whitespace-pre-wrap"
          {...rest}
        >
          {children}
        </code>
      )
    },
    p: ({ children, ...p }) => (
      <p className="mb-2 leading-relaxed prose prose-sm" {...p}>
        {children}
      </p>
    ),
    h1: ({ children, ...h }) => (
      <h1 className="text-2xl font-bold my-4" {...h}>
        {children}
      </h1>
    ),
    h2: ({ children, ...h }) => (
      <h2 className="text-xl font-semibold my-3" {...h}>
        {children}
      </h2>
    ),
    h3: ({ children, ...h }) => (
      <h3 className="text-lg font-medium my-2" {...h}>
        {children}
      </h3>
    ),
    ul: ({ children, ...u }) => (
      <ul className="list-disc list-inside mb-2" {...u}>
        {children}
      </ul>
    ),
    ol: ({ children, ...o }) => (
      <ol className="list-decimal list-inside mb-2" {...o}>
        {children}
      </ol>
    ),
    li: ({ children, ...l }) => (
      <li className="ml-4 mb-1" {...l}>
        {children}
      </li>
    ),
    blockquote: ({ children, ...bq }) => (
      <blockquote
        className="border-l-4 pl-4 italic text-gray-600 mb-2"
        {...bq}
      >
        {children}
      </blockquote>
    ),
  }

  return (
    <div className="py-0.5 rounded-lg">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {cleaned}
      </ReactMarkdown>
    </div>
  )
}
