'use client';

import React from 'react';
import { Form, Input, Space, Button, Checkbox, Card } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEmbedStore } from '@/lib/hooks/useEmbed';
import { CharCounter } from '../Common/CharCounter';
import { DISCORD_LIMITS } from '@/lib/constants/discord';

const { TextArea } = Input;

export const FieldsSection: React.FC = () => {
  const { embed, addField, updateField, removeField } = useEmbedStore();
  const fields = embed.fields || [];
  
  return (
    <Space orientation="vertical" style={{ width: '100%' }} size="large">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Fields ({fields.length}/{DISCORD_LIMITS.EMBED.FIELDS})</span>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={addField}
          disabled={fields.length >= DISCORD_LIMITS.EMBED.FIELDS}
        >
          Add Field
        </Button>
      </div>
      
      {fields.map((field, index) => (
        <Card 
          key={index}
          size="small"
          title={`Field ${index + 1}`}
          extra={
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeField(index)}
            />
          }
        >
          <Space orientation="vertical" style={{ width: '100%' }}>
            {/* Field Name */}
            <div>
              <Form.Item label="Name" style={{ marginBottom: '8px' }}>
                <Input
                  placeholder="Field name"
                  value={field.name}
                  onChange={(e) => updateField(index, { name: e.target.value })}
                  maxLength={DISCORD_LIMITS.EMBED.FIELD_NAME}
                />
              </Form.Item>
              <CharCounter 
                current={field.name.length} 
                max={DISCORD_LIMITS.EMBED.FIELD_NAME} 
              />
            </div>
            
            {/* Field Value */}
            <div>
              <Form.Item label="Value" style={{ marginBottom: '8px' }}>
                <TextArea
                  placeholder="Field value - supports markdown!"
                  value={field.value}
                  onChange={(e) => updateField(index, { value: e.target.value })}
                  rows={3}
                  maxLength={DISCORD_LIMITS.EMBED.FIELD_VALUE}
                />
              </Form.Item>
              <CharCounter 
                current={field.value.length} 
                max={DISCORD_LIMITS.EMBED.FIELD_VALUE} 
              />
            </div>
            
            {/* Inline */}
            <Form.Item style={{ marginBottom: 0 }}>
              <Checkbox
                checked={field.inline}
                onChange={(e) => updateField(index, { inline: e.target.checked })}
              >
                Inline
              </Checkbox>
            </Form.Item>
          </Space>
        </Card>
      ))}
      
      {fields.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '32px', 
          color: '#888',
          border: '2px dashed #d9d9d9',
          borderRadius: '8px',
        }}>
          No fields added yet. Click "Add Field" to create one.
        </div>
      )}
    </Space>
  );
};
