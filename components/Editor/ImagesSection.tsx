'use client';

import React from 'react';
import { Form, Input, Space } from 'antd';
import { useEmbedStore } from '@/lib/hooks/useEmbed';

export const ImagesSection: React.FC = () => {
  const { embed, setImage, setThumbnail } = useEmbedStore();
  
  return (
    <Space orientation="vertical" style={{ width: '100%' }} size="large">
      {/* Thumbnail */}
      <Form.Item label="Thumbnail URL">
        <Input
          placeholder="https://example.com/thumbnail.png"
          value={embed.thumbnail?.url || ''}
          onChange={(e) => setThumbnail(e.target.value)}
          type="url"
        />
        {embed.thumbnail?.url && (
          <div style={{ marginTop: '8px' }}>
            <img 
              src={embed.thumbnail.url}
              alt="Thumbnail Preview"
              style={{ 
                maxWidth: '128px', 
                maxHeight: '128px',
                borderRadius: '4px',
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </Form.Item>
      
      {/* Image */}
      <Form.Item label="Image URL">
        <Input
          placeholder="https://example.com/image.png"
          value={embed.image?.url || ''}
          onChange={(e) => setImage(e.target.value)}
          type="url"
        />
        {embed.image?.url && (
          <div style={{ marginTop: '8px' }}>
            <img 
              src={embed.image.url}
              alt="Image Preview"
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
      </Form.Item>
    </Space>
  );
};
