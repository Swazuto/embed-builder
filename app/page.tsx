'use client';

import { Layout, Row, Col, Typography } from 'antd';
import { EmbedEditor } from '@/components/Editor/EmbedEditor';
import { DiscordPreview } from '@/components/Preview/DiscordPreview';
import { ToolbarSection } from '@/components/Editor/ToolbarSection';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export default function Home() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#2f3136' }}>
      <Header style={{ 
        background: '#5865F2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Title level={2} style={{ color: 'white', margin: 0 }}>
          Discord Embed Creator
        </Title>
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
      
      <Footer style={{ 
        textAlign: 'center',
        background: '#202225',
        borderTop: '1px solid #000',
        color: '#b9bbbe',
        padding: '24px 50px',
      }}>
        <ToolbarSection />
      </Footer>
    </Layout>
  );
}
