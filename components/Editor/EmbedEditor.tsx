'use client';

import React from 'react';
import { Card, Tabs } from 'antd';
import { BasicInfoSection } from './BasicInfoSection';
import { AuthorSection } from './AuthorSection';
import { FieldsSection } from './FieldsSection';
import { ImagesSection } from './ImagesSection';
import { FooterSection } from './FooterSection';
import { MessageSection } from './MessageSection';
import { WebhookSection } from './WebhookSection';
import { useLanguage } from '@/lib/hooks/useLanguage';

export const EmbedEditor: React.FC = () => {
  const { t } = useLanguage();
  
  const items = [
    {
      key: 'message',
      label: t.message,
      children: <MessageSection />,
    },
    {
      key: 'basic',
      label: t.basic,
      children: <BasicInfoSection />,
    },
    {
      key: 'author',
      label: t.author,
      children: <AuthorSection />,
    },
    {
      key: 'fields',
      label: t.fields,
      children: <FieldsSection />,
    },
    {
      key: 'images',
      label: t.images,
      children: <ImagesSection />,
    },
    {
      key: 'footer',
      label: t.footer,
      children: <FooterSection />,
    },
    {
      key: 'webhook',
      label: t.webhook,
      children: <WebhookSection />,
    },
  ];

  return (
    <Card 
      title={t.embedEditor}
      style={{ height: '100%' }}
      styles={{
        header: {
          background: '#202225',
          color: '#ffffff',
          borderBottom: '1px solid #2f3136',
        },
        body: {
          background: '#36393f',
        }
      }}
    >
      <Tabs defaultActiveKey="basic" type="card" items={items} />
    </Card>
  );
};
