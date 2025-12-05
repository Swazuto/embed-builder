'use client';

import React from 'react';
import { Form, Input, Space } from 'antd';
import { useEmbedStore } from '@/lib/hooks/useEmbed';
import { CharCounter } from '../Common/CharCounter';
import { DISCORD_LIMITS } from '@/lib/constants/discord';

export const FooterSection: React.FC = () => {
  const { embed, setFooter } = useEmbedStore();
  const footer = embed.footer || { text: '', icon_url: '' };
  
  const handleChange = (field: string, value: string) => {
    setFooter({
      ...footer,
      [field]: value,
    });
  };
  
  return (
    <Space orientation="vertical" style={{ width: '100%' }} size="large">
      {/* Footer Text */}
      <div>
        <Form.Item label="Footer Text" style={{ marginBottom: '8px' }}>
          <Input
            placeholder="Footer text"
            value={footer.text || ''}
            onChange={(e) => handleChange('text', e.target.value)}
            maxLength={DISCORD_LIMITS.EMBED.FOOTER_TEXT}
          />
        </Form.Item>
        <CharCounter 
          current={footer.text?.length || 0} 
          max={DISCORD_LIMITS.EMBED.FOOTER_TEXT} 
        />
      </div>
      
      {/* Footer Icon */}
      <Form.Item label="Footer Icon URL">
        <Input
          placeholder="https://example.com/icon.png"
          value={footer.icon_url || ''}
          onChange={(e) => handleChange('icon_url', e.target.value)}
          type="url"
        />
        {footer.icon_url && (
          <div style={{ marginTop: '8px' }}>
            <img 
              src={footer.icon_url}
              alt="Footer Icon Preview"
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
