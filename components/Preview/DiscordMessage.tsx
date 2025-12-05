'use client';

import React from 'react';
import { parseMarkdown } from '@/lib/markdown/parser';

interface DiscordMessageProps {
  username?: string;
  avatar?: string;
  content?: string;
  children?: React.ReactNode;
}

export const DiscordMessage: React.FC<DiscordMessageProps> = ({
  username = 'Webhook Bot',
  avatar,
  content,
  children,
}) => {
  const defaultAvatar = 'https://cdn.discordapp.com/embed/avatars/0.png';
  
  return (
    <div style={{
      display: 'flex',
      padding: '16px',
      background: '#36393f',
      fontFamily: '"gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
    }}>
      {/* Avatar */}
      <div style={{ flexShrink: 0, marginRight: '16px' }}>
        <img 
          src={avatar || defaultAvatar}
          alt="Avatar"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
          }}
          onError={(e) => {
            e.currentTarget.src = defaultAvatar;
          }}
        />
      </div>
      
      {/* Message Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Username and Badge */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{
            color: '#ffffff',
            fontSize: '1rem',
            fontWeight: 500,
            marginRight: '8px',
          }}>
            {username}
          </span>
          <span style={{
            background: '#5865f2',
            color: '#ffffff',
            fontSize: '0.625rem',
            fontWeight: 600,
            padding: '2px 4px',
            borderRadius: '3px',
            textTransform: 'uppercase',
          }}>
            BOT
          </span>
          <span style={{
            color: '#72767d',
            fontSize: '0.75rem',
            marginLeft: '8px',
          }}>
            Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        {/* Message Text */}
        {content && (
          <div style={{
            color: '#dcddde',
            fontSize: '1rem',
            lineHeight: 1.375,
            marginBottom: children ? '8px' : 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {parseMarkdown(content)}
          </div>
        )}
        
        {/* Embeds */}
        {children}
      </div>
    </div>
  );
};
