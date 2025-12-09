'use client';

import { Layout, Row, Col } from 'antd';
import { EmbedEditor } from '@/components/Editor/EmbedEditor';
import { DiscordPreview } from '@/components/Preview/DiscordPreview';
import { ToolbarSection } from '@/components/Editor/ToolbarSection';

const { Header, Content } = Layout;

export default function Home() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#2f3136' }}>
      <Header style={{
        background: '#202225',
        borderBottom: '1px solid #000',
        padding: '12px 24px',
        height: 'auto',
        lineHeight: 'normal',
      }}>
        <ToolbarSection />
      </Header>
      <Content style={{ padding: '24px', background: '#2f3136' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <EmbedEditor />
          </Col>
          
          <Col xs={24} lg={12}>
            <DiscordPreview />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
