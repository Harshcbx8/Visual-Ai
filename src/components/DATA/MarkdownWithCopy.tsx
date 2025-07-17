// src/components/MarkdownWithCopy.tsx
import React, { useContext, useEffect, useRef, useState } from 'react'
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
import { Context } from '../../context/Context'

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
    overflowX: 'scroll',
    whiteSpace: 'pre',
    // let Prism’s default dark bg show
  },
  light: {
    padding: '1rem',
    borderRadius: '0.5rem',
    margin: 0,
    overflowX: 'scroll',
    whiteSpace: 'pre',
    // Prism’s default light bg is okay
  },
  glass: {
    padding: '1rem',
    borderRadius: '0.5rem',
    margin: 0,
    overflowX: 'scroll',
    whiteSpace: 'pre',
    background: 'rgba(255, 255, 255, 0.03)',
    boxShadow: '0 2px 4px rgb(0,0,0,0.2)',
    backdropFilter: 'blur(10px)',
  },
}

export default function MarkdownWithCopy({ text }: MarkdownWithCopyProps) {
    const {
      setIsTyping,
      setParticleSpeed,
      setGlobeSpeed,
      VISUAL_STATES
    } = useContext(Context);

    const [displayedText, setDisplayedText] = useState("");
    const animationRef = useRef<number | null>(null);
    const speedTransitionRef = useRef<number>(VISUAL_STATES.IDLE.globe);

    useEffect(() => {
      const cleaned = cleanResponse(text);

      // If text is very long or short, skip animation for performance
      if (!cleaned || cleaned.length < 10 || cleaned.length > 1200) {
        setDisplayedText(cleaned);
        setIsTyping(false);
        setParticleSpeed(VISUAL_STATES.IDLE.particle);
        setGlobeSpeed(VISUAL_STATES.IDLE.globe);
        return;
      }

      let i = 0;
      setDisplayedText("");
      setIsTyping(true);

      // Set initial typing speed
      setGlobeSpeed(VISUAL_STATES.TYPING.globe);
      setParticleSpeed(VISUAL_STATES.TYPING.particle);

      function animate() {
        // Adaptive increment based on text length
        i += Math.max(2, Math.floor(cleaned.length / 200));
        setDisplayedText(cleaned.slice(0, i));

        if (i < cleaned.length) {
          // Maintain typing speed
          setGlobeSpeed(VISUAL_STATES.TYPING.globe);
          setParticleSpeed(VISUAL_STATES.TYPING.particle);
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayedText(cleaned);
          setIsTyping(false);

          // Gradually slow down to idle speed
          const slowDown = () => {
            speedTransitionRef.current *= 0.95;
            if (speedTransitionRef.current > VISUAL_STATES.IDLE.globe) {
              setGlobeSpeed(speedTransitionRef.current);
              setParticleSpeed(speedTransitionRef.current * 0.75);
              requestAnimationFrame(slowDown);
            } else {
              setGlobeSpeed(VISUAL_STATES.IDLE.globe);
              setParticleSpeed(VISUAL_STATES.IDLE.particle);
            }
          };

          speedTransitionRef.current = VISUAL_STATES.TYPING.globe;
          slowDown();
        }
      }

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [text, setIsTyping, setParticleSpeed, setGlobeSpeed, VISUAL_STATES]);

    // 2️⃣ Read your theme exactly as you already do:
    const theme = typeof document !== 'undefined'
      ? document.documentElement.getAttribute('data-theme') as keyof typeof prismThemeMap
      : 'dark'

    
    // 3️⃣ Lookup the Prism style + container style:
    const prismStyle   = prismThemeMap[theme]  
    const prismBgStyle = backgroundMap[theme]
    
    const cleaned = displayedText;


    const components: Components = {
      code: (props: any) => {
        const { inline, className, children, ...rest } = props;
        const codeString = String(children).trimEnd();
        const match = /language-(\w+)/.exec(className || '');
        const lang = match?.[1] || 'text';

        // Only render block code (triple backticks) as SyntaxHighlighter
        if (!inline && codeString.split('\n').length > 1) {
          return (
            <div className="group my-4 z-0 relative">
              <div className='relative flex justify-end top-8'>
                <button
                  onClick={() => void navigator.clipboard.writeText(codeString)}
                  className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-xs theme-button2 p-2 rounded z-10 cursor-pointer"
                >
                  <FaRegCopy />
                </button>
              </div>
              <SyntaxHighlighter
                language={lang}
                style={prismStyle}
                className="custom-scrollbar-horizontal overflow-x-scroll"
                PreTag="div"
                customStyle={prismBgStyle}
                {...rest}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          );
        }

        // Inline code (single backtick or short code) is rendered inline
        return (
          <code
            className="bg-gray-100 text-green-500 px-1 rounded whitespace-pre-wrap"
            {...rest}
          >
            {children}
          </code>
        );
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
      <div className="py-0.5 rounded-lg w-full">
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
