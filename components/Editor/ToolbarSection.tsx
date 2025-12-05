'use client';

import React, { useMemo, useState } from 'react';
import { Button, Space, Upload, Modal, Input, List, Typography, message, Popconfirm } from 'antd';
import { UploadOutlined, DeleteOutlined, CopyOutlined, SaveOutlined, FolderOpenOutlined, DownloadOutlined } from '@ant-design/icons';
import { useEmbedStore } from '@/lib/hooks/useEmbed';
import { storageManager } from '@/lib/utils/storage';
import { WebhookPayload } from '@/lib/types/embed.types';

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

  const [saving, setSaving] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDescription, setSaveDescription] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const [showLoadModal, setShowLoadModal] = useState(false);
  const [templates, setTemplates] = useState(storageManager.getTemplates());

  const payload = useMemo(() => {
    const base = getEmbedJSON();
    return {
      ...base,
      username: webhookUsername || undefined,
      avatar_url: webhookAvatar || undefined,
    } as WebhookPayload & { webhookUrl?: string };
  }, [getEmbedJSON, webhookUsername, webhookAvatar]);

  const handleCopyJson = async () => {
    try {
      await storageManager.copyToClipboard(payload);
      message.success('JSON copiado para a área de transferência.');
    } catch (error) {
      message.error('Falha ao copiar JSON.');
    }
  };

  const handleSaveTemplate = async () => {
    if (!saveName.trim()) {
      message.error('Defina um nome para o template.');
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
      message.success('Template salvo.');
      setShowSaveModal(false);
      setSaveName('');
      setSaveDescription('');
    } catch (error) {
      message.error('Falha ao salvar template.');
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
    message.success(`Template "${tpl.name}" carregado.`);
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
      message.success('Template importado.');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Falha ao importar template');
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
    message.success('JSON exportado.');
  };

  return (
    <Space wrap size="middle">
      <Button icon={<CopyOutlined />} onClick={handleCopyJson}>
        Copy JSON
      </Button>

      <Popconfirm
        title="Limpar tudo?"
        okText="Sim"
        cancelText="Não"
        onConfirm={clearAll}
      >
        <Button danger icon={<DeleteOutlined />}>Clear All</Button>
      </Popconfirm>

      <Button icon={<SaveOutlined />} onClick={() => setShowSaveModal(true)}>
        Save Template
      </Button>

      <Button icon={<FolderOpenOutlined />} onClick={() => setShowLoadModal(true)}>
        Load Template
      </Button>

      <Upload beforeUpload={handleImport} showUploadList={false} accept="application/json">
        <Button icon={<UploadOutlined />}>Import JSON</Button>
      </Upload>

      <Button icon={<DownloadOutlined />} onClick={handleExport}>
        Export JSON
      </Button>

      {/* Save Modal */}
      <Modal
        title="Salvar template"
        open={showSaveModal}
        confirmLoading={saving}
        onOk={handleSaveTemplate}
        onCancel={() => setShowSaveModal(false)}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <Space orientation="vertical" style={{ width: '100%' }}>
          <Input
            placeholder="Nome do template"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
          />
          <Input.TextArea
            placeholder="Descrição (opcional)"
            value={saveDescription}
            onChange={(e) => setSaveDescription(e.target.value)}
            rows={3}
          />
        </Space>
      </Modal>

      {/* Load Modal */}
      <Modal
        title="Templates"
        open={showLoadModal}
        onCancel={() => setShowLoadModal(false)}
        footer={null}
      >
        {templates.length === 0 ? (
          <Text type="secondary">Nenhum template salvo.</Text>
        ) : (
          <List
            dataSource={templates}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button type="link" key="load" onClick={() => handleLoadTemplate(item.id)}>
                    Load
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
