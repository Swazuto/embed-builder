'use client';

import React, { useCallback, useState } from 'react';
import { Button, Space, Upload, Modal, Input, List, Typography, message, Popconfirm, Select } from 'antd';
import { UploadOutlined, DeleteOutlined, CopyOutlined, SaveOutlined, FolderOpenOutlined, DownloadOutlined, GlobalOutlined } from '@ant-design/icons';
import { useEmbedStore } from '@/lib/hooks/useEmbed';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { storageManager } from '@/lib/utils/storage';
import { WebhookPayload } from '@/lib/types/embed.types';
import { Language } from '@/lib/i18n/translations';

const { Text } = Typography;

export const ToolbarSection: React.FC = () => {
  const {
    getEmbedJSON,
    clearAll,
    webhookUsername,
    webhookAvatar,
    content,
    embed,
    loadState,
  } = useEmbedStore();
  const { t, language, setLanguage } = useLanguage();

  const [saving, setSaving] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDescription, setSaveDescription] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const [showLoadModal, setShowLoadModal] = useState(false);
  const [templates, setTemplates] = useState(storageManager.getTemplates());

  const buildPayload = useCallback(() => {
    const base = getEmbedJSON();
    return {
      ...base,
      username: webhookUsername || undefined,
      avatar_url: webhookAvatar || undefined,
    } as WebhookPayload & { webhookUrl?: string };
  }, [getEmbedJSON, webhookUsername, webhookAvatar]);

  const handleCopyJson = async () => {
    try {
      await storageManager.copyToClipboard(buildPayload());
      message.success(t.jsonCopied);
    } catch (error) {
      message.error(t.jsonCopyError);
    }
  };

  const handleSaveTemplate = async () => {
    if (!saveName.trim()) {
      message.error(t.templateNameRequired);
      return;
    }
    setSaving(true);
    try {
      storageManager.saveTemplate({
        name: saveName.trim(),
        description: saveDescription.trim() || undefined,
        embed,
        content,
        webhookUsername,
        webhookAvatar,
      });
      setTemplates(storageManager.getTemplates());
      message.success(t.templateSaved);
      setShowSaveModal(false);
      setSaveName('');
      setSaveDescription('');
    } catch (error) {
      message.error(t.templateSaveError);
    } finally {
      setSaving(false);
    }
  };

  const handleLoadTemplate = (id: string) => {
    const tpl = templates.find((t) => t.id === id);
    if (!tpl) return;
    loadState({
      embed: tpl.embed,
      webhookUrl: tpl.webhookUrl || '',
      content: tpl.content || '',
      webhookUsername: tpl.webhookUsername || '',
      webhookAvatar: tpl.webhookAvatar || '',
    });
    setShowLoadModal(false);
    message.success(t.templateLoaded);
  };

  const handleImport = async (file: File) => {
    try {
      const tpl = await storageManager.importTemplate(file);
      loadState({
        embed: tpl.embed,
        webhookUrl: tpl.webhookUrl || '',
        content: tpl.content || '',
        webhookUsername: tpl.webhookUsername || '',
        webhookAvatar: tpl.webhookAvatar || '',
      });
      setTemplates(storageManager.getTemplates());
      message.success(t.templateImported);
    } catch (error) {
      message.error(error instanceof Error ? error.message : t.templateImportError);
    }
    return false;
  };

  const handleExport = () => {
    const tempTemplate = {
      id: 'current',
      name: 'current-embed',
      description: 'Exported embed',
      embed,
      content,
      webhookUsername,
      webhookAvatar,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storageManager.exportTemplate(tempTemplate);
    message.success(t.jsonExported);
  };

  return (
    <Space wrap size="middle" style={{ justifyContent: 'center', width: '100%' }}>
      {/* Language Selector */}
      <Space>
        <GlobalOutlined style={{ fontSize: '16px', color: '#b9bbbe' }} />
        <Select
          value={language}
          onChange={(value: Language) => setLanguage(value)}
          style={{ width: 180, borderColor: '#404249' }}
          options={[
            { value: 'pt-BR', label: '🇧🇷 Português (BR)' },
            { value: 'en-US', label: '🇺🇸 English (US)' },
            { value: 'ru', label: '🇷🇺 Русский' },
            { value: 'ja', label: '🇯🇵 日本語' },
            { value: 'zh', label: '🇨🇳 中文' },
          ]}
          popupMatchSelectWidth={false}
          optionLabelProp="label"
        />
      </Space>

      {/* Copy JSON */}
      <Button icon={<CopyOutlined />} onClick={handleCopyJson}>
        {t.copyJson}
      </Button>

      <Popconfirm
        title={t.clearAllConfirm}
        okText={t.yes}
        cancelText={t.no}
        onConfirm={clearAll}
      >
        <Button danger icon={<DeleteOutlined />}>{t.clearAll}</Button>
      </Popconfirm>

      <Button icon={<SaveOutlined />} onClick={() => setShowSaveModal(true)}>
        {t.saveTemplate}
      </Button>

      <Button icon={<FolderOpenOutlined />} onClick={() => setShowLoadModal(true)}>
        {t.loadTemplate}
      </Button>

      <Upload beforeUpload={handleImport} showUploadList={false} accept="application/json">
        <Button icon={<UploadOutlined />}>{t.importJson}</Button>
      </Upload>

      <Button icon={<DownloadOutlined />} onClick={handleExport}>
        {t.exportJson}
      </Button>

      {/* Save Modal */}
      <Modal
        title={t.saveTemplate}
        open={showSaveModal}
        confirmLoading={saving}
        onOk={handleSaveTemplate}
        onCancel={() => setShowSaveModal(false)}
        okText={t.save}
        cancelText={t.cancel}
      >
        <Space orientation="vertical" style={{ width: '100%' }}>
          <Input
            placeholder={t.templateNamePlaceholder}
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
          />
          <Input.TextArea
            placeholder={t.templateDescriptionPlaceholder}
            value={saveDescription}
            onChange={(e) => setSaveDescription(e.target.value)}
            rows={3}
          />
        </Space>
      </Modal>

      {/* Load Modal */}
      <Modal
        title={t.loadTemplate}
        open={showLoadModal}
        onCancel={() => setShowLoadModal(false)}
        footer={null}
      >
        {templates.length === 0 ? (
          <Text type="secondary">{t.loadTemplate}</Text>
        ) : (
          <List
            dataSource={templates}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button type="link" key="load" onClick={() => handleLoadTemplate(item.id)}>
                    {t.load}
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.name}
                  description={
                    <>
                      {item.description && <div>{item.description}</div>}
                      <Text type="secondary" style={{ fontSize: '0.75rem' }}>
                        {new Date(item.updatedAt).toLocaleString()}
                      </Text>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Modal>
    </Space>
  );
};
