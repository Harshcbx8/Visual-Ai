// src/components/MarkdownWithCopy.tsx
import React from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import type { CodeProps } from 'react-markdown/lib/complex-types'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

// use the async/light build to satisfy TS's JSX element type
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
// register your languages here:
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import ts from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

SyntaxHighlighter.registerLanguage('javascript', js)
SyntaxHighlighter.registerLanguage('typescript', ts)
SyntaxHighlighter.registerLanguage('python', python)

// TS doesn’t believe this is a valid JSX component; cast away to `any`
const PrismSyntaxHighlighter = (SyntaxHighlighter as unknown) as React.ComponentType<any>

export type MarkdownWithCopyProps = {
  text: string
}

export default function MarkdownWithCopy({ text }: MarkdownWithCopyProps) {
  const handleCopy = (code: string) => {
    void navigator.clipboard.writeText(code)
  }

  const components: Components = {
    code({ inline, className, children, ...props }: CodeProps) {
      const codeString = String(children).replace(/\n$/, '')
      const match = /language-(\w+)/.exec(className || '')
      const lang = match?.[1] ?? 'text'

      if (!inline) {
        return (
          <div className="relative group my-4">
            <button
              onClick={() => handleCopy(codeString)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-600 hover:bg-gray-700 text-white px-2 cursor-pointer py-1 rounded"
            >
              Copy
            </button>
            <PrismSyntaxHighlighter
              language={lang}
              style={oneDark}
              PreTag="div"
              customStyle={{
                padding: '1rem',
                borderRadius: '0.5rem',
                margin: 0,
                whiteSpace: 'pre',      // preserve all indentation and line breaks
                overflowX: 'auto',      // allow horizontal scrolling for long lines
                display: 'block',       // ensure block-level rendering
              }}
              {...props}
            >
              {codeString}
            </PrismSyntaxHighlighter>
          </div>
        )
      }

      // inline code
      return (
        <code
          className="bg-gray-100 text-red-600 px-1 rounded whitespace-pre-wrap"
          {...props}
        >
          {children}
        </code>
      )
    },
    p({ children, ...props }) {
      return (
        <p className="mb-2 leading-relaxed prose prose-sm" {...props}>
          {children}
        </p>
      )
    },
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={components}
    >
      {text}
    </ReactMarkdown>
  )
}
