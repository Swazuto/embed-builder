'use client';

import React from 'react';
import { Form, Input, Space } from 'antd';
import { useEmbedStore } from '@/lib/hooks/useEmbed';
import { CharCounter } from '../Common/CharCounter';
import { DISCORD_LIMITS } from '@/lib/constants/discord';

export const AuthorSection: React.FC = () => {
  const { embed, setAuthor } = useEmbedStore();
  const author = embed.author || { name: '', url: '', icon_url: '' };
  
  const handleChange = (field: string, value: string) => {
    setAuthor({
      ...author,
      [field]: value,
    });
  };
  
  return (
    <Space orientation="vertical" style={{ width: '100%' }} size="large">
      {/* Author Name */}
      <div>
        <Form.Item label="Author Name" style={{ marginBottom: '8px' }}>
          <Input
            placeholder="Author name"
            value={author.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            maxLength={DISCORD_LIMITS.EMBED.AUTHOR_NAME}
          />
        </Form.Item>
        <CharCounter 
          current={author.name?.length || 0} 
          max={DISCORD_LIMITS.EMBED.AUTHOR_NAME} 
        />
      </div>
      
      {/* Author URL */}
      <Form.Item label="Author URL">
        <Input
          placeholder="https://example.com"
          value={author.url || ''}
          onChange={(e) => handleChange('url', e.target.value)}
          type="url"
        />
      </Form.Item>
      
      {/* Author Icon */}
      <Form.Item label="Author Icon URL">
        <Input
          placeholder="https://example.com/icon.png"
          value={author.icon_url || ''}
          onChange={(e) => handleChange('icon_url', e.target.value)}
          type="url"
        />
        {author.icon_url && (
          <div style={{ marginTop: '8px' }}>
            <img 
              src={author.icon_url}
              alt="Author Icon Preview"
              style={{ 
                maxWidth: '64px', 
                maxHeight: '64px',
                borderRadius: '50%',
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </Form.Item>
    </Space>
  );
};
