'use client';

import React from 'react';
import { Card } from 'antd';
import { useEmbedStore } from '@/lib/hooks/useEmbed';
import { DiscordMessage } from './DiscordMessage';
import { DiscordEmbed } from './DiscordEmbed';

export const DiscordPreview: React.FC = () => {
  const embed = useEmbedStore((state) => state.embed);
  const content = useEmbedStore((state) => state.content);
  const webhookUsername = useEmbedStore((state) => state.webhookUsername);
  const webhookAvatar = useEmbedStore((state) => state.webhookAvatar);
  
  return (
    <Card 
      title="Preview" 
      style={{ 
        height: '100%',
        background: '#36393f',
      }}
      styles={{
        body: { 
          padding: 0,
          background: '#36393f',
        },
        header: {
          background: '#202225',
          color: '#ffffff',
          borderBottom: '1px solid #2f3136',
        }
      }}
    >
      <DiscordMessage
        username={webhookUsername || 'Webhook Bot'}
        avatar={webhookAvatar}
        content={content}
      >
        <DiscordEmbed embed={embed} />
      </DiscordMessage>
    </Card>
  );
};
