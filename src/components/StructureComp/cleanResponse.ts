// src/utils/cleanResponse.ts
/**
 * Takes the raw Gemini response (with <div class='code-block'>…<br>)
 * and returns the cleaned Markdown string that actually gets rendered.
 */
export function cleanResponse(raw: string): string {
  return raw
    // code‑block wrapper → ```lang
    .replace(
      /<div class=['"]code-block['"]>\s*<pre>\s*<code class=['"]language-(\w+)['"]>/g,
      '```$1\n'
    )
    // closing tags → ```
    .replace(/<\/code>\s*<\/pre>\s*<\/div>/g, '\n```')
    // <br> → newline
    .replace(/<br\s*\/?>/gi, '\n');
}
