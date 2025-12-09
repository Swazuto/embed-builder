import React, { ReactNode } from 'react';

/**
 * Parse Discord markdown to React elements
 * Supports: headers, bold, italic, underline, strikethrough, spoiler, code, links, etc.
 */

interface ParseRule {
  pattern: RegExp;
  replace: (match: RegExpMatchArray, parse: (text: string) => ReactNode) => ReactNode;
}

interface ListItemNode {
  content: ReactNode;
  children: ListItemNode[];
}

// Syntax highlighting for code blocks
const highlightCode = (code: string, lang?: string): ReactNode => {
  const langLower = lang?.toLowerCase();
  
  if (!langLower || !['js', 'javascript', 'python', 'py', 'rs', 'rust'].includes(langLower)) {
    return code;
  }
  
  const lines = code.split('\n');
  const keywords: Record<string, string[]> = {
    js: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'async', 'await', 'new', 'this'],
    javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'async', 'await', 'new', 'this'],
    python: ['def', 'class', 'import', 'from', 'return', 'if', 'else', 'elif', 'for', 'while', 'with', 'as', 'try', 'except', 'finally'],
    py: ['def', 'class', 'import', 'from', 'return', 'if', 'else', 'elif', 'for', 'while', 'with', 'as', 'try', 'except', 'finally'],
    rs: ['fn', 'let', 'mut', 'const', 'struct', 'enum', 'impl', 'use', 'pub', 'mod', 'if', 'else', 'match', 'for', 'while'],
    rust: ['fn', 'let', 'mut', 'const', 'struct', 'enum', 'impl', 'use', 'pub', 'mod', 'if', 'else', 'match', 'for', 'while'],
  };
  
  const langKeywords = keywords[langLower] || [];
  
  return React.createElement('div', null, lines.map((line, i) => {
    const parts: ReactNode[] = [];
    let currentIndex = 0;
    let textBuffer = '';
    
    const pushBuffer = () => {
      if (textBuffer) {
        parts.push(textBuffer);
        textBuffer = '';
      }
    };
    
    // Simple tokenization
    const tokens: Array<{type: string, value: string, start: number}> = [];
    
    // Match strings
    const stringRegex = /(['"`])(?:(?=(\\?))\2.)*?\1/g;
    let match;
    while ((match = stringRegex.exec(line)) !== null) {
      tokens.push({type: 'string', value: match[0], start: match.index});
    }
    
    // Match numbers
    const numberRegex = /\b\d+\.?\d*\b/g;
    while ((match = numberRegex.exec(line)) !== null) {
      if (!tokens.some(t => match!.index >= t.start && match!.index < t.start + t.value.length)) {
        tokens.push({type: 'number', value: match[0], start: match.index});
      }
    }
    
    // Match keywords
    langKeywords.forEach(keyword => {
      const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'g');
      while ((match = keywordRegex.exec(line)) !== null) {
        if (!tokens.some(t => match!.index >= t.start && match!.index < t.start + t.value.length)) {
          tokens.push({type: 'keyword', value: match[0], start: match.index});
        }
      }
    });
    
    // Match comments
    if (langLower === 'js' || langLower === 'javascript' || langLower === 'rs' || langLower === 'rust') {
      const commentMatch = line.match(/\/\/.*/);
      if (commentMatch) {
        tokens.push({type: 'comment', value: commentMatch[0], start: commentMatch.index!});
      }
    } else if (langLower === 'python' || langLower === 'py') {
      const commentMatch = line.match(/#.*/);
      if (commentMatch) {
        tokens.push({type: 'comment', value: commentMatch[0], start: commentMatch.index!});
      }
    }
    
    // Sort tokens by position
    tokens.sort((a, b) => a.start - b.start);
    
    // Build the highlighted line
    tokens.forEach((token, idx) => {
      // Add text before token
      if (token.start > currentIndex) {
        textBuffer += line.substring(currentIndex, token.start);
      }
      
      pushBuffer();
      
      // Add colored token
      const colors: Record<string, string> = {
        keyword: '#c678dd',
        string: '#98c379',
        number: '#d19a66',
        comment: '#5c6370',
      };
      
      parts.push(
        React.createElement('span', {
          key: `${i}-${idx}`,
          style: { color: colors[token.type] }
        }, token.value)
      );
      
      currentIndex = token.start + token.value.length;
    });
    
    // Add remaining text
    if (currentIndex < line.length) {
      textBuffer += line.substring(currentIndex);
    }
    pushBuffer();
    
    return React.createElement('div', { key: i }, parts.length > 0 ? parts : line);
  }));
};

// Markdown parsing rules in order of precedence
const rules: ParseRule[] = [
  // Escape sequences
  {
    pattern: /\\([\\*_~|`\[\]])/,
    replace: (match) => match[1],
  },
  
  // Headers (# ## ###) - must have space after #
  {
    pattern: /^(#{1,3}) (.+)$/m,
    replace: (match, parse) => {
      const level = match[1].length;
      const content = match[2];
      return React.createElement(`h${level}`, {
        key: Math.random(),
      }, parse(content));
    },
  },
  
  // Subtext (-# text) - must have space after -#
  {
    pattern: /^-# (.+)$/m,
    replace: (match, parse) => React.createElement('small', {
      key: Math.random(),
    }, parse(match[1])),
  },
  
  // Multi-line block quote (>>>)
  {
    pattern: /^>>> ([\s\S]+?)(?=\n\n|\n*$)/m,
    replace: (match, parse) => React.createElement('blockquote', {
      key: Math.random(),
    }, parse(match[1])),
  },
  
  // Single-line block quote (> text) - must have space after >
  {
    pattern: /^> (.+)$/m,
    replace: (match, parse) => React.createElement('blockquote', {
      key: Math.random(),
    }, parse(match[1])),
  },
  
  // Nested list items (  - or  *)
  {
    pattern: /^  [*-] (.+)$/m,
    replace: (match, parse) => React.createElement('li', {
      key: Math.random(),
    }, parse(match[1])),
  },
  
  // Unordered list items (- or *) with space
  {
    pattern: /^[*-] (.+)$/m,
    replace: (match, parse) => React.createElement('li', {
      key: Math.random(),
    }, parse(match[1])),
  },
  
  // Spoiler (||text||)
  {
    pattern: /\|\|(.+?)\|\|/,
    replace: (match, parse) => React.createElement('span', {
      key: Math.random(),
      className: 'discord-spoiler',
      style: {
        background: '#202225',
        borderRadius: '3px',
        padding: '0 2px',
        cursor: 'pointer',
      },
      onClick: (e: React.MouseEvent<HTMLSpanElement>) => {
        const target = e.currentTarget;
        target.style.background = 'rgba(0, 0, 0, 0.1)';
        target.style.color = 'inherit';
      }
    }, parse(match[1])),
  },
  
  // Inline code (`code`)
  {
    pattern: /`([^`]+)`/,
    replace: (match) => React.createElement('code', {
      key: Math.random(),
      style: {
        background: '#2b2d31',
        padding: '2px 4px',
        borderRadius: '3px',
        fontSize: '0.875rem',
        fontFamily: '"Consolas", "Monaco", monospace',
      }
    }, match[1]),
  },
  
  // Underlined bold italic (__***text***__)
  {
    pattern: /__\*\*\*(.+?)\*\*\*__/,
    replace: (match, parse) => React.createElement('span', {
      key: Math.random(),
      style: { textDecoration: 'underline' }
    }, React.createElement('strong', null, React.createElement('em', null, parse(match[1])))),
  },
  
  // Underlined bold (__**text**__)
  {
    pattern: /__\*\*(.+?)\*\*__/,
    replace: (match, parse) => React.createElement('span', {
      key: Math.random(),
      style: { textDecoration: 'underline' }
    }, React.createElement('strong', null, parse(match[1]))),
  },
  
  // Underlined italic (__*text*__)
  {
    pattern: /__\*(.+?)\*__/,
    replace: (match, parse) => React.createElement('span', {
      key: Math.random(),
      style: { textDecoration: 'underline' }
    }, React.createElement('em', null, parse(match[1]))),
  },
  
  // Underline with underscore (__text__)
  {
    pattern: /__(.+?)__/,
    replace: (match, parse) => React.createElement('span', {
      key: Math.random(),
      style: { textDecoration: 'underline' }
    }, parse(match[1])),
  },
  
  // Bold + Italic (***text***)
  {
    pattern: /\*\*\*(.+?)\*\*\*/,
    replace: (match, parse) => React.createElement('strong', {
      key: Math.random()
    }, React.createElement('em', null, parse(match[1]))),
  },
  
  // Bold (**text**)
  {
    pattern: /\*\*(.+?)\*\*/,
    replace: (match, parse) => React.createElement('strong', {
      key: Math.random()
    }, parse(match[1])),
  },
  
  // Italic with asterisk (*text*) or underscore (_text_)
  {
    pattern: /(?:\*|_)(.+?)(?:\*|_)/,
    replace: (match, parse) => React.createElement('em', {
      key: Math.random()
    }, parse(match[1])),
  },
  
  // Strikethrough (~~text~~)
  {
    pattern: /~~(.+?)~~/,
    replace: (match, parse) => React.createElement('s', {
      key: Math.random(),
    }, parse(match[1])),
  },
  
  // Links [text](url)
  {
    pattern: /\[([^\]]+)\]\(([^)]+)\)/,
    replace: (match) => React.createElement('a', {
      key: Math.random(),
      href: match[2],
      target: '_blank',
      rel: 'noopener noreferrer',
      style: { color: '#00a8fc', textDecoration: 'none' }
    }, match[1]),
  },
  
  // Auto URLs
  {
    pattern: /(https?:\/\/[^\s]+)/,
    replace: (match) => React.createElement('a', {
      key: Math.random(),
      href: match[1],
      target: '_blank',
      rel: 'noopener noreferrer',
      style: { color: '#00a8fc', textDecoration: 'none' }
    }, match[1]),
  },
  
  // User mention <@USER_ID>
  {
    pattern: /<@!?(\d+)>/,
    replace: (match) => React.createElement('span', {
      key: Math.random(),
      style: {
        background: 'rgba(88, 101, 242, 0.3)',
        color: '#dee0fc',
        padding: '0 2px',
        borderRadius: '3px',
      }
    }, '@User'),
  },
  
  // Channel mention <#CHANNEL_ID>
  {
    pattern: /<#(\d+)>/,
    replace: (match) => React.createElement('span', {
      key: Math.random(),
      style: {
        background: 'rgba(88, 101, 242, 0.3)',
        color: '#dee0fc',
        padding: '0 2px',
        borderRadius: '3px',
      }
    }, '#channel'),
  },
  
  // Role mention <@&ROLE_ID>
  {
    pattern: /<@&(\d+)>/,
    replace: (match) => React.createElement('span', {
      key: Math.random(),
      style: {
        background: 'rgba(88, 101, 242, 0.3)',
        color: '#dee0fc',
        padding: '0 2px',
        borderRadius: '3px',
      }
    }, '@Role'),
  },
  
  // Custom emoji <:name:id> or <a:name:id>
  {
    pattern: /<(a)?:(\w+):(\d+)>/,
    replace: (match) => React.createElement('span', {
      key: Math.random(),
      style: { fontWeight: 'bold' }
    }, `:${match[2]}:`),
  },
  
  // Unicode emoji :emoji:
  {
    pattern: /:(\w+):/,
    replace: (match) => match[0], // Keep as is
  },
  
  // Timestamp <t:unix:format>
  {
    pattern: /<t:(\d+)(?::([tTdDfFR]))?>/,
    replace: (match) => {
      const timestamp = parseInt(match[1]) * 1000;
      const date = new Date(timestamp);
      const format = match[2] || 'f';
      
      const formats: Record<string, string> = {
        't': date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        'T': date.toLocaleTimeString(),
        'd': date.toLocaleDateString(),
        'D': date.toLocaleDateString([], { dateStyle: 'long' }),
        'f': date.toLocaleString(),
        'F': date.toLocaleString([], { dateStyle: 'full', timeStyle: 'short' }),
        'R': 'in a moment',
      };
      
      return React.createElement('span', {
        key: Math.random(),
        style: {
          background: 'rgba(88, 101, 242, 0.3)',
          padding: '0 2px',
          borderRadius: '3px',
        }
      }, formats[format] || date.toLocaleString());
    },
  },
];

export const parseMarkdown = (text: string): ReactNode => {
  if (!text) return null;
  
  const renderList = (items: ListItemNode[]): ReactNode => React.createElement('ul', {
    key: Math.random(),
    style: {
      margin: 0,
      paddingInlineStart: '1.2rem',
      lineHeight: 1.4,
    },
  }, items.map((item) => React.createElement('li', {
    key: Math.random(),
    style: {
      marginBottom: '2px',
    }
  }, [
    item.content,
    item.children.length > 0 && renderList(item.children)
  ])));
  
  const lines = text.split('\n');
  const result: ReactNode[] = [];
  let listBuffer: ListItemNode[] = [];
  let lastNodeByDepth: Record<number, ListItemNode> = {};
  
  const flushList = () => {
    if (listBuffer.length > 0) {
      result.push(renderList(listBuffer));
      listBuffer = [];
      lastNodeByDepth = {};
    }
  };
  
  const addListItem = (depth: number, content: ReactNode) => {
    const node: ListItemNode = {
      content,
      children: [],
    };
    if (depth === 0) {
      listBuffer.push(node);
    } else {
      const parent = lastNodeByDepth[depth - 1];
      if (parent) {
        parent.children.push(node);
      } else {
        listBuffer.push(node);
      }
    }
    lastNodeByDepth[depth] = node;
    Object.keys(lastNodeByDepth).forEach((key) => {
      const numeric = Number(key);
      if (numeric > depth) {
        delete lastNodeByDepth[numeric];
      }
    });
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    
    // Multi-line code block
    if (line.startsWith('```')) {
      flushList();
      const lang = line.slice(3).trim();
      let codeContent = '';
      i++;

      while (i < lines.length && !lines[i].startsWith('```')) {
        codeContent += (codeContent ? '\n' : '') + lines[i];
        i++;
      }

      result.push(React.createElement('pre', {
        key: Math.random(),
        style: {
          background: '#2b2d31',
          border: '1px solid #1e1f22',
          borderRadius: '4px',
          padding: '8px',
          margin: '4px 0',
          overflow: 'auto',
          fontSize: '0.875rem',
          fontFamily: '"Consolas", "Monaco", monospace',
        }
      }, React.createElement('code', null, highlightCode(codeContent, lang || undefined))));

      i++;
      continue;
    }

    // Multi-line blockquote
    if (line.startsWith('>>> ')) {
      flushList();
      let quoteContent = line.slice(4);
      i++;

      while (i < lines.length && lines[i].trim() !== '') {
        quoteContent += '\n' + lines[i];
        i++;
      }

      result.push(React.createElement('blockquote', {
        key: Math.random(),
      }, parseLine(quoteContent)));

      continue;
    }

    if (line.trim() === '') {
      flushList();
      result.push(React.createElement('div', {
        key: `gap-${i}`,
        style: {
          minHeight: '0.35rem',
        }
      }));
      i++;
      continue;
    }

    const listMatch = line.match(/^(\s*)[*-] (.+)$/);
    if (listMatch) {
      const indentLength = listMatch[1] ? listMatch[1].length : 0;
      const depth = Math.max(0, Math.floor(indentLength / 2));
      addListItem(depth, parseLine(listMatch[2]));
      i++;
      continue;
    }

    flushList();

    const hasHardBreak = / {2}$/.test(line);
    const trimmedLine = line.replace(/ {2}$/, '');
    const parsedLine = parseLine(trimmedLine);
    if (parsedLine) {
      const lineNodes: ReactNode[] = [parsedLine];
      if (hasHardBreak) {
        lineNodes.push(React.createElement('br', { key: `br-${i}` }));
      }
      result.push(React.createElement('div', {
        key: `line-${i}`,
        style: {
          margin: 0,
          lineHeight: 1.3,
        },
      }, lineNodes));
    }

    i++;
  }

  flushList();

  return React.createElement(React.Fragment, null, result);
};

const parseLine = (text: string): ReactNode => {
  if (!text) return null;
  
  const parse = (str: string): ReactNode => {
    if (!str) return null;
    
    // Try each rule in order
    for (const rule of rules) {
      const match = str.match(rule.pattern);
      if (match && match.index !== undefined) {
        const before = str.slice(0, match.index);
        const after = str.slice(match.index + match[0].length);
        
        return React.createElement(React.Fragment, { key: Math.random() }, [
          before && parse(before),
          rule.replace(match, parse),
          after && parse(after)
        ].filter(Boolean));
      }
    }
    
    return str;
  };
  
  return parse(text);
};
