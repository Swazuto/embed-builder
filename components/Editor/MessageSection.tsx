'use client';

import React from 'react';
import { Form, Input } from 'antd';
import { useEmbedStore } from '@/lib/hooks/useEmbed';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { CharCounter } from '../Common/CharCounter';
import { DISCORD_LIMITS } from '@/lib/constants/discord';

const { TextArea } = Input;

export const MessageSection: React.FC = () => {
  const { content, setContent } = useEmbedStore();
  const { t } = useLanguage();
  
  return (
    <div>
      <Form.Item label={`${t.messageContent} (${t.optional})`} style={{ marginBottom: '8px' }}>
        <TextArea
          placeholder={t.messageContentPlaceholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          maxLength={DISCORD_LIMITS.MESSAGE.CONTENT}
        />
      </Form.Item>
      <CharCounter 
        current={content.length} 
        max={DISCORD_LIMITS.MESSAGE.CONTENT} 
      />
    </div>
  );
};
