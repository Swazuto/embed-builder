import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, theme } from 'antd';
import "./globals.css";

export const metadata: Metadata = {
  title: "Discord Embed Creator",
  description: "Create beautiful Discord embeds with full markdown support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              algorithm: theme.darkAlgorithm,
              token: {
                colorBgBase: '#2f3136',
                colorBgContainer: '#36393f',
                colorBgElevated: '#202225',
                colorBorder: '#202225',
                colorText: '#dcddde',
                colorTextSecondary: '#b9bbbe',
                colorPrimary: '#5865f2',
                colorInfo: '#5865f2',
                colorSuccess: '#3ba55d',
                colorWarning: '#faa61a',
                colorError: '#ed4245',
                borderRadius: 4,
              },
              components: {
                Card: {
                  headerBg: '#202225',
                  colorBgContainer: '#36393f',
                },
                Tabs: {
                  cardBg: '#2f3136',
                },
                Input: {
                  colorBgContainer: '#202225',
                  colorText: '#dcddde',
                  colorTextPlaceholder: '#72767d',
                  activeBorderColor: '#5865f2',
                  hoverBorderColor: '#4752c4',
                },
                Select: {
                  colorBgContainer: '#202225',
                  colorText: '#dcddde',
                  colorTextPlaceholder: '#72767d',
                },
                Switch: {
                  colorPrimary: '#5865f2',
                  colorPrimaryHover: '#4752c4',
                },
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
