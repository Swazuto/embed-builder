'use client';

import React from 'react';
import { Form, Input, Switch, Space } from 'antd';
import { useEmbedStore } from '@/lib/hooks/useEmbed';
import { CharCounter } from '../Common/CharCounter';
import { DiscordColorPicker } from '../Common/ColorPicker';
import { DISCORD_LIMITS } from '@/lib/constants/discord';

const { TextArea } = Input;

export const BasicInfoSection: React.FC = () => {
  const {
    embed,
    setTitle,
    setDescription,
    setUrl,
    setColor,
    setTimestamp,
  } = useEmbedStore();
  
  const handleTimestampToggle = (checked: boolean) => {
    setTimestamp(checked ? new Date().toISOString() : undefined);
  };
  
  return (
    <Space orientation="vertical" style={{ width: '100%' }} size="large">
      {/* Title */}
      <div>
        <Form.Item label="Title" style={{ marginBottom: '8px' }}>
          <Input
            placeholder="Embed title"
            value={embed.title || ''}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={DISCORD_LIMITS.EMBED.TITLE}
          />
        </Form.Item>
        <CharCounter 
          current={embed.title?.length || 0} 
          max={DISCORD_LIMITS.EMBED.TITLE} 
        />
      </div>
      
      {/* Description */}
      <div>
        <Form.Item label="Description" style={{ marginBottom: '8px' }}>
          <TextArea
            placeholder="Embed description - supports markdown!"
            value={embed.description || ''}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            maxLength={DISCORD_LIMITS.EMBED.DESCRIPTION}
          />
        </Form.Item>
        <CharCounter 
          current={embed.description?.length || 0} 
          max={DISCORD_LIMITS.EMBED.DESCRIPTION} 
        />
      </div>
      
      {/* URL */}
      <Form.Item label="URL (makes title clickable)">
        <Input
          placeholder="https://example.com"
          value={embed.url || ''}
          onChange={(e) => setUrl(e.target.value)}
          type="url"
        />
      </Form.Item>
      
      {/* Color */}
      <Form.Item label="Color">
        <DiscordColorPicker
          value={embed.color}
          onChange={setColor}
        />
      </Form.Item>
      
      {/* Timestamp */}
      <Form.Item label="Add Timestamp">
        <Switch
          checked={!!embed.timestamp}
          onChange={handleTimestampToggle}
        />
      </Form.Item>
    </Space>
  );
};
