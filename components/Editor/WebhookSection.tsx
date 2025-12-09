'use client';

import React from 'react';
import { Form, Input, Space, Button, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useEmbedStore } from '@/lib/hooks/useEmbed';
import { useWebhook } from '@/lib/hooks/useWebhook';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { CharCounter } from '../Common/CharCounter';
import { DISCORD_LIMITS } from '@/lib/constants/discord';
import { WebhookPayload } from '@/lib/types/embed.types';

export const WebhookSection: React.FC = () => {
  const {
    webhookUrl,
    webhookUsername,
    webhookAvatar,
    setWebhookUrl,
    setWebhookUsername,
    setWebhookAvatar,
    getEmbedJSON,
  } = useEmbedStore();
  
  const { sendWebhook, loading } = useWebhook();
  const { t } = useLanguage();
  
  const handleSend = async () => {
    if (!webhookUrl) {
      message.error(t.webhookUrlRequired);
      return;
    }
    const base = getEmbedJSON();
    const payload = {
      ...base,
      username: webhookUsername || undefined,
      avatar_url: webhookAvatar || undefined,
    } as WebhookPayload;
    await sendWebhook(webhookUrl, payload);
  };
  
  return (
    <Space orientation="vertical" style={{ width: '100%' }} size="large">
      {/* Webhook URL */}
      <Form.Item label={`${t.webhookUrl} (${t.required})`} required>
        <Input
          placeholder={t.webhookUrlPlaceholder}
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          type="url"
        />
      </Form.Item>
      
      {/* Bot Username */}
      <div>
        <Form.Item label={`${t.botUsername} (${t.optional})`} style={{ marginBottom: '8px' }}>
          <Input
            placeholder={t.botUsernamePlaceholder}
            value={webhookUsername}
            onChange={(e) => setWebhookUsername(e.target.value)}
            maxLength={DISCORD_LIMITS.WEBHOOK.USERNAME}
          />
        </Form.Item>
        <CharCounter 
          current={webhookUsername.length} 
          max={DISCORD_LIMITS.WEBHOOK.USERNAME} 
        />
      </div>
      
      {/* Bot Avatar */}
      <Form.Item label={`${t.botAvatar} (${t.optional})`}>
        <Input
          placeholder={t.botAvatarPlaceholder}
          value={webhookAvatar}
          onChange={(e) => setWebhookAvatar(e.target.value)}
          type="url"
        />
        {webhookAvatar && (
          <div style={{ marginTop: '8px' }}>
            <img 
              src={webhookAvatar}
              alt="Avatar Preview"
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
      
      {/* Send Button */}
      <div style={{ marginTop: '16px', textAlign: 'right' }}>
        <Button 
          type="primary" 
          icon={<SendOutlined style={{ color: '#ffffff' }} />}
          onClick={handleSend}
          loading={loading}
          disabled={!webhookUrl}
          size="large"
          style={{
            backgroundColor: 'transparent',
            borderColor: '#5865f2',
            color: '#5865f2',
            borderWidth: '2px',
          }}
          styles={{
            icon: { color: '#ffffff' }
          }}
        >
          {t.sendToWebhook}
        </Button>
      </div>
    </Space>
  );
};
