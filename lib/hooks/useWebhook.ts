import { useState } from 'react';
import { message } from 'antd';
import { WebhookPayload } from '../types/embed.types';
import { isValidWebhookUrl } from '../utils/validation';

export const useWebhook = () => {
  const [loading, setLoading] = useState(false);
  
  const sendWebhook = async (webhookUrl: string, payload: WebhookPayload) => {
    setLoading(true);
    
    try {
      // Validate webhook URL
      if (!isValidWebhookUrl(webhookUrl)) {
        throw new Error('Invalid webhook URL');
      }
      
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl, ...payload }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send webhook');
      }
      
      message.success('Embed sent successfully!');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send webhook';
      message.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return { sendWebhook, loading };
};
