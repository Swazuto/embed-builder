'use client';

import React from 'react';
import { Card, Tabs } from 'antd';
import { BasicInfoSection } from './BasicInfoSection';
import { AuthorSection } from './AuthorSection';
import { FieldsSection } from './FieldsSection';
import { ImagesSection } from './ImagesSection';
import { FooterSection } from './FooterSection';
import { WebhookSection } from './WebhookSection';

export const EmbedEditor: React.FC = () => {
  const items = [
    {
      key: 'basic',
      label: 'Basic',
      children: <BasicInfoSection />,
    },
    {
      key: 'author',
      label: 'Author',
      children: <AuthorSection />,
    },
    {
      key: 'fields',
      label: 'Fields',
      children: <FieldsSection />,
    },
    {
      key: 'images',
      label: 'Images',
      children: <ImagesSection />,
    },
    {
      key: 'footer',
      label: 'Footer',
      children: <FooterSection />,
    },
    {
      key: 'webhook',
      label: 'Webhook',
      children: <WebhookSection />,
    },
  ];

  return (
    <Card 
      title="Embed Editor"
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
