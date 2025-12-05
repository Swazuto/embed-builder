'use client';

import React from 'react';
import { Progress, Typography } from 'antd';

const { Text } = Typography;

interface CharCounterProps {
  current: number;
  max: number;
}

export const CharCounter: React.FC<CharCounterProps> = ({ current, max }) => {
  const percentage = (current / max) * 100;
  const status = percentage > 100 ? 'exception' : percentage > 80 ? 'normal' : 'success';
  const type = percentage > 100 ? 'danger' : percentage > 80 ? 'warning' : undefined;
  
  return (
    <div style={{ marginTop: '4px' }}>
      <Progress
        percent={Math.min(percentage, 100)}
        status={status}
        showInfo={false}
        size={[null, 4]}
        strokeColor={percentage > 100 ? '#ff4d4f' : percentage > 80 ? '#faad14' : '#52c41a'}
      />
      <Text type={type} style={{ fontSize: '0.75rem' }}>
        {current} / {max}
      </Text>
    </div>
  );
};
