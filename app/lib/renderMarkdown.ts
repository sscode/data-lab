function inlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function parseTableRow(line: string): string[] {
  const parts = line.split('|')
  return parts.slice(1, parts.length - 1).map((c) => c.trim())
}

function isSeparatorRow(line: string): boolean {
  return /^\|[-| :]+\|$/.test(line.trim())
}

export function renderMarkdown(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Fenced code block
    if (line.startsWith('```')) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(escapeHtml(lines[i]))
        i++
      }
      out.push(`<pre><code>${codeLines.join('\n')}</code></pre>`)
      i++
      continue
    }

    // Heading
    const hm = line.match(/^(#{1,3}) (.+)$/)
    if (hm) {
      out.push(`<h${hm[1].length}>${inlineMarkdown(hm[2])}</h${hm[1].length}>`)
      i++
      continue
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      out.push('<hr>')
      i++
      continue
    }

    // Blockquote — collect consecutive > lines
    if (line.startsWith('> ')) {
      const qLines: string[] = []
      while (i < lines.length && lines[i].startsWith('> ')) {
        qLines.push(lines[i].slice(2))
        i++
      }
      out.push(`<blockquote><p>${inlineMarkdown(qLines.join(' '))}</p></blockquote>`)
      continue
    }

    // Unordered list — collect consecutive - or * lines
    if (/^[-*] /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(`<li>${inlineMarkdown(lines[i].slice(2))}</li>`)
        i++
      }
      out.push(`<ul>${items.join('')}</ul>`)
      continue
    }

    // Ordered list — collect consecutive "N. " lines
    if (/^\d+\. /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(`<li>${inlineMarkdown(lines[i].replace(/^\d+\. /, ''))}</li>`)
        i++
      }
      out.push(`<ol>${items.join('')}</ol>`)
      continue
    }

    // Table — line starts with | and next line is a separator row
    if (line.startsWith('|') && i + 1 < lines.length && isSeparatorRow(lines[i + 1])) {
      const headers = parseTableRow(line)
      i += 2 // skip header + separator
      const rows: string[][] = []
      while (i < lines.length && lines[i].startsWith('|')) {
        rows.push(parseTableRow(lines[i]))
        i++
      }
      const thead = `<thead><tr>${headers.map((h) => `<th>${inlineMarkdown(h)}</th>`).join('')}</tr></thead>`
      const tbody = rows.length
        ? `<tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inlineMarkdown(c)}</td>`).join('')}</tr>`).join('')}</tbody>`
        : ''
      out.push(`<table>${thead}${tbody}</table>`)
      continue
    }

    // Empty line
    if (line.trim() === '') {
      i++
      continue
    }

    // Paragraph — collect consecutive plain lines
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('```') &&
      !lines[i].startsWith('> ') &&
      !/^[-*] /.test(lines[i]) &&
      !/^\d+\. /.test(lines[i]) &&
      !lines[i].startsWith('|') &&
      !/^---+$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length > 0) {
      out.push(`<p>${inlineMarkdown(paraLines.join('<br>'))}</p>`)
    }
  }

  return out.join('\n')
}
