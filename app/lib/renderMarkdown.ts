export function renderMarkdown(md: string): string {
  return md
    .replace(/^(#{1,3}) (.+)$/gm, (_, h, t) => {
      const tag = `h${h.length}`
      return `<${tag}>${t}</${tag}>`
    })
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^```[\w]*\n?([\s\S]*?)```$/gm, '<pre><code>$1</code></pre>')
    .replace(/^---$/gm, '<hr>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]+?<\/li>)/g, (m) => `<ul>${m}</ul>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[houpl])(.+)$/gm, (line) =>
      line.trim() ? `<p>${line}</p>` : ''
    )
}
