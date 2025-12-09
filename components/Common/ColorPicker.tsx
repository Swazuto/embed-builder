'use client';

import React from 'react';
import { ColorPicker, Space, Button, Tooltip } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { useLanguage } from '@/lib/hooks/useLanguage';
import { DISCORD_COLOR_PRESETS } from '@/lib/constants/discord';
import { hexToDecimal, decimalToHex } from '@/lib/utils/validation';

interface DiscordColorPickerProps {
  value?: number;
  onChange?: (color: number) => void;
}

export const DiscordColorPicker: React.FC<DiscordColorPickerProps> = ({ 
  value, 
  onChange 
}) => {
  const { t } = useLanguage();
  const hexValue = value !== undefined ? decimalToHex(value) : '#5865F2';
  
  const handleColorChange = (color: Color) => {
    const hex = color.toHex();
    onChange?.(hexToDecimal(hex));
  };
  
  return (
    <Space orientation="vertical" style={{ width: '100%' }}>
      <ColorPicker
        value={hexValue}
        onChange={handleColorChange}
        showText
        format="hex"
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {DISCORD_COLOR_PRESETS.map((preset) => (
          <Tooltip key={preset.name} title={preset.name}>
            <Button
              size="small"
              style={{
                background: decimalToHex(preset.value),
                width: 32,
                height: 32,
                padding: 0,
                border: value === preset.value ? '2px solid #fff' : 'none',
              }}
              onClick={() => onChange?.(preset.value)}
            />
          </Tooltip>
        ))}
      </div>
    </Space>
  );
};
