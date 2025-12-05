'use client';

import React, { useMemo } from 'react';
import { Form, Input, Space, Button, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useEmbedStore } from '@/lib/hooks/useEmbed';
import { useWebhook } from '@/lib/hooks/useWebhook';
import { CharCounter } from '../Common/CharCounter';
import { DISCORD_LIMITS } from '@/lib/constants/discord';
import { WebhookPayload } from '@/lib/types/embed.types';

const { TextArea } = Input;

export const WebhookSection: React.FC = () => {
  const {
    webhookUrl,
    webhookUsername,
    webhookAvatar,
    content,
    setWebhookUrl,
    setWebhookUsername,
    setWebhookAvatar,
    setContent,
    getEmbedJSON,
  } = useEmbedStore();
  
  const { sendWebhook, loading } = useWebhook();
  
  const payload = useMemo(() => {
    const base = getEmbedJSON();
    return {
      ...base,
      username: webhookUsername || undefined,
      avatar_url: webhookAvatar || undefined,
    } as WebhookPayload;
  }, [getEmbedJSON, webhookUsername, webhookAvatar]);
  
  const handleSend = async () => {
    if (!webhookUrl) {
      message.error('Informe a Webhook URL.');
      return;
    }
    await sendWebhook(webhookUrl, payload);
  };
  
  return (
    <Space orientation="vertical" style={{ width: '100%' }} size="large">
      {/* Webhook URL */}
      <Form.Item label="Webhook URL" required>
        <Input
          placeholder="https://discord.com/api/webhooks/..."
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          type="url"
        />
      </Form.Item>
      
      {/* Bot Username */}
      <div>
        <Form.Item label="Bot Username (optional)" style={{ marginBottom: '8px' }}>
          <Input
            placeholder="Webhook Bot"
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
      <Form.Item label="Bot Avatar URL (optional)">
        <Input
          placeholder="https://example.com/avatar.png"
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
      
      {/* Message Content */}
      <div>
        <Form.Item label="Message Content (optional)" style={{ marginBottom: '8px' }}>
          <TextArea
            placeholder="Message content (text outside the embed)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            maxLength={DISCORD_LIMITS.MESSAGE.CONTENT}
          />
        </Form.Item>
        <CharCounter 
          current={content.length} 
          max={DISCORD_LIMITS.MESSAGE.CONTENT} 
        />
      </div>
      
      {/* Send Button */}
      <div style={{ marginTop: '16px', textAlign: 'right' }}>
        <Button 
          type="primary" 
          icon={<SendOutlined />}
          onClick={handleSend}
          loading={loading}
          disabled={!webhookUrl}
          size="large"
        >
          Send to Webhook
        </Button>
      </div>
    </Space>
  );
};
