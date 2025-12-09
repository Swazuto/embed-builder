'use client';

import React from 'react';
import { Embed } from '@/lib/types/embed.types';
import { parseMarkdown } from '@/lib/markdown/parser';
import { decimalToHex } from '@/lib/utils/validation';

interface DiscordEmbedProps {
  embed: Embed;
}

export const DiscordEmbed: React.FC<DiscordEmbedProps> = ({ embed }) => {
  const borderColor = embed.color ? decimalToHex(embed.color) : '#5865F2';
  const handleAuthorMouseEnter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.textDecoration = 'underline';
  };

  const handleAuthorMouseLeave = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.textDecoration = 'none';
  };
  
  return (
    <div 
      className="discord-embed"
      style={{
        display: 'grid',
        maxWidth: '520px',
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: '4px',
        background: '#2f3136',
                  objectFit: 'cover',
        padding: '12px 16px 16px 12px',
        marginTop: '4px',
      }}
    >
      <div style={{ gridColumn: '1 / 2' }}>
        {/* Author */}
        {embed.author && (embed.author.name || embed.author.icon_url) && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            {embed.author.icon_url && (
              <img 
                src={embed.author.icon_url}
                alt="Author"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  marginRight: '8px',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            {embed.author.name && (
              embed.author.url ? (
                <a 
                  href={embed.author.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {embed.author.name}
                </a>
              ) : (
                <span style={{
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}>
                  {embed.author.name}
                </span>
              )
            )}
          </div>
        )}
        
        {/* Title */}
        {embed.title && (
          <div style={{ marginBottom: '8px' }}>
            {embed.url ? (
              <a 
                href={embed.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#00a8fc',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  lineHeight: 1.3,
                }}
                     onMouseEnter={handleAuthorMouseEnter}
                     onMouseLeave={handleAuthorMouseLeave}
              >
                {embed.title}
              </a>
            ) : (
              <div style={{
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 600,
                lineHeight: 1.3,
              }}>
                {embed.title}
              </div>
            )}
          </div>
        )}
        
        {/* Description */}
        {embed.description && (
          <div style={{
            color: '#dcddde',
            fontSize: '1rem',
            lineHeight: '1.375rem',
            marginBottom: '8px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {parseMarkdown(embed.description)}
          </div>
        )}
        
        {/* Fields */}
        {embed.fields && embed.fields.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '8px',
            marginTop: '8px',
          }}>
            {embed.fields.map((field, index) => (
              <div 
                key={index}
                style={{
                  gridColumn: field.inline ? 'span 4' : 'span 12',
                  minWidth: 0,
                }}
              >
                <div style={{
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '4px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {parseMarkdown(field.name)}
                </div>
                <div style={{
                  color: '#dcddde',
                  fontSize: '0.875rem',
                  lineHeight: 1.3,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {parseMarkdown(field.value)}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Image */}
        {embed.image?.url && (
          <div style={{ marginTop: '16px' }}>
            <img 
              src={embed.image.url}
              alt="Embed"
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '4px',
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        
        {/* Footer */}
        {(embed.footer?.text || embed.timestamp) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '8px',
          }}>
            {embed.footer?.icon_url && (
              <img 
                src={embed.footer.icon_url}
                alt="Footer"
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  marginRight: '8px',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <span style={{
              color: '#b9bbbe',
              fontSize: '0.75rem',
            }}>
              {embed.footer?.text}
              {embed.footer?.text && embed.timestamp && ' • '}
              {embed.timestamp && new Date(embed.timestamp).toLocaleString()}
            </span>
          </div>
        )}
      </div>
      
      {/* Thumbnail */}
      {embed.thumbnail?.url && (
        <div style={{
          gridColumn: '2 / 2',
          gridRow: '1 / 8',
          justifySelf: 'end',
          alignSelf: 'start',
          marginLeft: '16px',
        }}>
          <img 
            src={embed.thumbnail.url}
            alt="Thumbnail"
            style={{
              maxWidth: '80px',
              maxHeight: '80px',
              borderRadius: '4px',
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};
