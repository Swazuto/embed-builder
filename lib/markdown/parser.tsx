import React, { ReactNode } from 'react';

/**
 * Parse Discord markdown to React elements
 * Supports: headers, bold, italic, underline, strikethrough, spoiler, code, links, etc.
 */

interface ParseRule {
  pattern: RegExp;
  replace: (match: RegExpMatchArray, parse: (text: string) => ReactNode) => ReactNode;
}

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
      const sizes = ['1.875rem', '1.5rem', '1.25rem'];
      return React.createElement(
        `h${level}`,
        { 
          key: Math.random(),
          style: { 
            fontSize: sizes[level - 1], 
            fontWeight: 'bold',
            marginTop: '0.5rem',
            marginBottom: '0.5rem',
            lineHeight: 1.3,
          } 
        },
        parse(content)
      );
    },
  },
  
  // Subtext (-# text) - must have space after -#
  {
    pattern: /^-# (.+)$/m,
    replace: (match, parse) => React.createElement('div', {
      key: Math.random(),
      style: { 
        fontSize: '0.75rem',
        color: '#b5bac1',
        marginTop: '4px',
        marginBottom: '4px',
      }
    }, parse(match[1])),
  },
  
  // Multi-line block quote (>>>)
  {
    pattern: /^>>> ([\s\S]+?)(?=\n\n|\n*$)/m,
    replace: (match, parse) => React.createElement('div', {
      key: Math.random(),
      className: 'discord-blockquote-multiline',
      style: { display: 'flex', margin: '4px 0' }
    }, [
      React.createElement('div', { 
        key: 'border', 
        style: { width: '4px', borderRadius: '4px', background: '#4e5058', marginRight: '8px' } 
      }),
      React.createElement('div', { key: 'content' }, parse(match[1]))
    ]),
  },
  
  // Single-line block quote (> text) - must have space after >
  {
    pattern: /^> (.+)$/m,
    replace: (match, parse) => React.createElement('div', {
      key: Math.random(),
      className: 'discord-blockquote',
      style: { display: 'flex', margin: '4px 0' }
    }, [
      React.createElement('div', { 
        key: 'border', 
        style: { width: '4px', borderRadius: '4px', background: '#4e5058', marginRight: '8px' } 
      }),
      React.createElement('div', { key: 'content' }, parse(match[1]))
    ]),
  },
  
  // Unordered list items (- or *) with space
  {
    pattern: /^[*-] (.+)$/m,
    replace: (match, parse) => React.createElement('div', {
      key: Math.random(),
      style: { marginLeft: '1.5rem', textIndent: '-1.5rem' }
    }, [
      React.createElement('span', { 
        key: 'bullet', 
        style: { display: 'inline-block', width: '1.5rem' } 
      }, '•'),
      parse(match[1])
    ]),
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
  
  // Code block (```lang\ncode```)
  {
    pattern: /```(?:(\w+)\n)?([\s\S]+?)```/,
    replace: (match) => React.createElement('pre', {
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
    }, React.createElement('code', null, match[2])),
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
    replace: (match, parse) => React.createElement('span', {
      key: Math.random(),
      style: { textDecoration: 'line-through' }
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
  
  const parse = (str: string): ReactNode => {
    if (!str) return null;
    
    // Try each rule
    for (const rule of rules) {
      const match = str.match(rule.pattern);
      if (match) {
        const before = str.slice(0, match.index);
        const after = str.slice((match.index || 0) + match[0].length);
        
        return React.createElement(React.Fragment, { key: Math.random() }, [
          before && parse(before),
          rule.replace(match, parse),
          after && parse(after)
        ].filter(Boolean));
      }
    }
    
    // No match, return text with newlines converted to <br>
    return str.split('\n').map((line, i, arr) => 
      React.createElement(React.Fragment, { key: i }, [
        line,
        i < arr.length - 1 && React.createElement('br', { key: `br-${i}` })
      ].filter(Boolean))
    );
  };
  
  return parse(text);
};
