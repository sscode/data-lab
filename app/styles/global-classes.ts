export const CSS = `
  :root {
    --bg:            #FFFFFF;
    --bg-sidebar:    #FAFAF8;
    --surface:       #F0EFEC;
    --surface-hover: #E8E7E4;
    --border:        rgba(55,53,47,0.10);
    --border-bright: rgba(55,53,47,0.18);
    --accent:        #2264D1;
    --accent-dim:    rgba(34,100,209,0.07);
    --accent-glow:   rgba(34,100,209,0.14);
    --text:          #1A1917;
    --text-secondary:#6F6E69;
    --text-muted:    #AEAAA2;
    --green:         #0F7B5B;
    --red:           #C9201C;
  }

  @keyframes msgIn {
    from { opacity: 0; transform: translateY(5px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .msg-in { animation: msgIn 0.16s ease-out; }
  .fade-in { animation: fadeIn 0.22s ease-out; }

  .spinner {
    display: inline-block;
    width: 12px; height: 12px;
    border: 1.5px solid var(--border-bright);
    border-top-color: var(--text);
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
    flex-shrink: 0;
  }

  /* Data table */
  .dt {
    width: 100%;
    border-collapse: collapse;
  }
  .dt th {
    background: var(--surface);
    color: var(--text-secondary);
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 500;
    font-size: 10px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 7px 12px;
    text-align: left;
    border-bottom: 1px solid var(--border-bright);
    white-space: nowrap;
  }
  .dt td {
    padding: 6px 12px;
    border-bottom: 1px solid var(--border);
    color: var(--text-secondary);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .dt tr:last-child td { border-bottom: none; }
  .dt tr:hover td { background: var(--surface); color: var(--text); }

  /* Tabs — underline style */
  .tab-btn {
    padding: 6px 14px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    border-radius: 0;
    font-family: 'Manrope', sans-serif;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    color: var(--text-muted);
    transition: color 0.14s, border-color 0.14s;
    margin-bottom: -1px;
  }
  .tab-btn:hover { color: var(--text-secondary); }
  .tab-btn.active {
    color: var(--text);
    border-bottom-color: var(--text);
    font-weight: 600;
  }

  /* Upload zone */
  .upload-zone {
    border: 1.5px dashed var(--border-bright);
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: background 0.14s, border-color 0.14s;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
  }
  .upload-zone:hover { background: var(--surface); border-color: rgba(55,53,47,0.3); }
  .upload-zone.drag-on { background: var(--accent-dim); border-color: var(--accent); border-style: solid; }

  /* Chat input */
  .chat-input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: var(--text);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    caret-color: var(--text);
  }

  /* Chat input wrapper */
  .chat-input-wrap {
    border-radius: 8px;
    background: var(--bg);
    border: 1px solid var(--border-bright);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 12px;
    transition: border-color 0.14s, box-shadow 0.14s;
  }
  .chat-input-wrap:focus-within {
    border-color: rgba(55,53,47,0.4);
    box-shadow: 0 0 0 3px rgba(55,53,47,0.06);
  }

  /* Send button — solid black */
  .send-btn {
    background: var(--text);
    color: #FFFFFF;
    border: none;
    border-radius: 7px;
    padding: 7px 16px;
    font-family: 'Manrope', sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.14s;
    flex-shrink: 0;
    letter-spacing: 0.01em;
  }
  .send-btn:disabled { opacity: 0.28; cursor: default; }
  .send-btn:hover:not(:disabled) { opacity: 0.82; }

  /* Run analysis button — solid black */
  .run-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    background: var(--text);
    border: none;
    border-radius: 7px;
    color: #FFFFFF;
    font-family: 'Manrope', sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.14s;
    white-space: nowrap;
    letter-spacing: 0.01em;
  }
  .run-btn:hover:not(:disabled) { opacity: 0.8; }
  .run-btn:disabled { opacity: 0.32; cursor: default; }

  /* Stat chip */
  .stat-chip {
    display: flex;
    flex-direction: column;
    gap: 2px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 6px 10px;
  }

  /* Analysis report prose */
  .prose h1 {
    color: var(--text);
    font-family: 'Manrope', sans-serif;
    font-size: 16px;
    font-weight: 700;
    border-bottom: 1px solid var(--border-bright);
    padding-bottom: 8px;
    margin: 24px 0 12px;
    letter-spacing: -0.02em;
  }
  .prose h1:first-child { margin-top: 0; }
  .prose h2 {
    color: var(--text);
    font-family: 'Manrope', sans-serif;
    font-size: 13px;
    font-weight: 700;
    margin: 20px 0 8px;
    letter-spacing: -0.01em;
  }
  .prose h3 {
    color: var(--text-secondary);
    font-family: 'Manrope', sans-serif;
    font-size: 12px;
    font-weight: 600;
    margin: 14px 0 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 10.5px;
  }
  .prose p { color: var(--text-secondary); margin: 6px 0; line-height: 1.78; font-size: 13px; }
  .prose ul, .prose ol { margin: 6px 0 6px 20px; color: var(--text-secondary); }
  .prose li { margin: 4px 0; line-height: 1.7; font-size: 13px; }
  .prose strong { color: var(--text); font-weight: 700; }
  .prose em { color: var(--accent); font-style: normal; }
  .prose code {
    background: var(--surface);
    padding: 1px 5px;
    border-radius: 4px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: var(--text-secondary);
    border: 1px solid var(--border);
  }
  .prose pre {
    background: var(--surface);
    border: 1px solid var(--border-bright);
    padding: 12px 14px;
    margin: 10px 0;
    overflow-x: auto;
    border-radius: 7px;
  }
  .prose pre code { background: none; padding: 0; border: none; color: var(--text-secondary); }
  .prose hr { border: none; border-top: 1px solid var(--border); margin: 20px 0; }
  .prose blockquote {
    border-left: 2px solid var(--border-bright);
    padding-left: 14px;
    color: var(--text-secondary);
    margin: 10px 0;
  }
`
