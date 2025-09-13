import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Calendar, Shield, QrCode, Link } from 'lucide-react'

import { Panel } from '../components/ui'

// =================================================================
// STORYBOOK META & STORIES
// =================================================================
const meta: Meta = {
  title: 'Primitives/Panel',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// =================================================================
// PANEL STORIES - design-26-production-ready統一仕様適用
// =================================================================

export const MainPanel: Story = {
  render: () => (
    <Panel size="large">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          fontFamily: 'IBM Plex Sans JP, sans-serif',
        }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div
              style={{
                fontSize: '2.2rem',
                fontWeight: '300',
                color: '#374151',
                letterSpacing: '4px',
              }}
            >
              ₿ ビット婚姻
            </div>
          </div>
          <div
            style={{
              fontSize: '1.3rem',
              fontFamily: 'IBM Plex Mono, monospace',
              color: '#f9fafb',
              padding: '1rem 2rem',
              background: 'rgba(40, 48, 61, 0.75)',
              borderRadius: '24px',
              backdropFilter: 'blur(16px)',
            }}
          >
            14:32:45
          </div>
        </header>
        <main style={{ textAlign: 'center' }}>
          <h2
            style={{
              fontSize: '2.2rem',
              fontWeight: '300',
              color: '#374151',
              marginBottom: '1.2rem',
              letterSpacing: '4px',
            }}
          >
            証人参加
          </h2>
          <p
            style={{
              fontSize: '1.2rem',
              color: '#6b7280',
              lineHeight: '1.7',
              marginBottom: '2.5rem',
            }}
          >
            QRコードをスキャンして
            <br />
            二人の永遠の証人になってください
          </p>
        </main>
      </div>
    </Panel>
  ),
  name: 'Panel - Main Container (Large)',
}

export const PersonCard: Story = {
  render: () => (
    <Panel size="small">
      <div
        style={{
          textAlign: 'center',
          fontFamily: 'IBM Plex Sans JP, sans-serif',
        }}
      >
        <div
          style={{
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e64980, #ff6b9d)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3.5rem',
            margin: '0 auto 1.5rem',
            boxShadow: `
            inset 0 2px 4px rgba(255, 255, 255, 0.25),
            inset 0 -2px 4px rgba(0, 0, 0, 0.15),
            0 8px 16px rgba(230, 73, 128, 0.25),
            0 4px 8px rgba(230, 73, 128, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.1)`,
          }}
        >
          👰
        </div>
        <div
          style={{
            fontSize: '1.6rem',
            fontWeight: '500',
            marginBottom: '1rem',
            letterSpacing: '2px',
            color: '#e64980',
          }}
        >
          新婦
        </div>
        <div
          style={{
            fontSize: '1.9rem',
            fontWeight: '600',
            letterSpacing: '1px',
            color: '#10b981',
          }}
        >
          署名済み
        </div>
      </div>
    </Panel>
  ),
  name: 'Panel - Person Card (Bride)',
}

export const QRSectionPanel: Story = {
  render: () => (
    <Panel size="medium">
      <div
        style={{
          textAlign: 'center',
          fontFamily: 'IBM Plex Sans JP, sans-serif',
        }}
      >
        <div
          style={{
            width: '280px',
            height: '280px',
            background: '#ffffff',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4rem',
            color: '#374151',
            margin: '0 auto 2rem',
            border: '1px solid rgba(116, 192, 252, 0.2)',
            boxShadow: `
            inset 0 1px 2px rgba(255, 255, 255, 0.9),
            inset 0 -1px 2px rgba(0, 0, 0, 0.05),
            0 1px 1px rgba(255, 255, 255, 0.5),
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 10px 15px -3px rgba(0, 0, 0, 0.08),
            0 20px 25px -5px rgba(116, 192, 252, 0.1)`,
          }}
        >
          <QrCode size={120} />
        </div>
        <div
          style={{
            fontSize: '1.1rem',
            color: '#f7931a',
            fontWeight: '500',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          Scan to Witness
        </div>
      </div>
    </Panel>
  ),
  name: 'Panel - QR Section',
}

export const CeremonyInfoPanel: Story = {
  render: () => (
    <Panel size="small">
      <div
        style={{
          fontFamily: 'IBM Plex Sans JP, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              fontSize: '1.1rem',
              fontWeight: '500',
              letterSpacing: '0.3px',
              textAlign: 'right',
              flex: '1',
            }}
          >
            田中 太郎
          </div>
          <div
            style={{
              width: '28px',
              height: '28px',
              fontSize: '1.6rem',
              color: '#f7931a',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(247, 147, 26, 0.1)',
              borderRadius: '50%',
              flexShrink: '0',
            }}
          >
            ₿
          </div>
          <div
            style={{
              fontSize: '1.1rem',
              fontWeight: '500',
              letterSpacing: '0.3px',
              textAlign: 'left',
              flex: '1',
            }}
          >
            山田 花子
          </div>
        </div>
        <div
          style={{
            fontSize: '0.95rem',
            fontWeight: '500',
            fontFamily: 'IBM Plex Mono, monospace',
            letterSpacing: '0.5px',
            textAlign: 'center',
            paddingTop: '0.4rem',
            borderTop: '1px solid rgba(116, 192, 252, 0.1)',
            color: '#6b7280',
          }}
        >
          2024.03.14
        </div>
      </div>
    </Panel>
  ),
  name: 'Panel - Ceremony Info',
}

export const TechCarouselPanel: Story = {
  render: () => (
    <Panel size="medium">
      <div
        style={{
          fontFamily: 'IBM Plex Sans JP, sans-serif',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>🔒</div>
        <div
          style={{
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.3rem',
          }}
        >
          世界最高の安全性
        </div>
        <div
          style={{
            fontSize: '0.8rem',
            color: '#6b7280',
            lineHeight: '1.3',
          }}
        >
          ブロックチェーンで永久保存・改ざん不可能
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '0.8rem',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#74c0fc',
            }}
          ></div>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'rgba(116, 192, 252, 0.3)',
            }}
          ></div>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'rgba(116, 192, 252, 0.3)',
            }}
          ></div>
        </div>
      </div>
    </Panel>
  ),
  name: 'Panel - Tech Carousel',
}

export const CertificatePreviewPanel: Story = {
  render: () => (
    <Panel size="medium">
      <div
        style={{
          fontFamily: 'IBM Plex Sans JP, sans-serif',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '1rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(116, 192, 252, 0.15)',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              margin: '0 auto 0.5rem',
              background: '#f7931a',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '700',
            }}
          >
            ₿
          </div>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: '500',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            ビット婚姻証明書
          </div>
        </div>
        <div
          style={{
            textAlign: 'center',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.3rem',
            }}
          >
            田中 太郎 & 山田 花子
          </div>
          <div
            style={{
              fontSize: '0.95rem',
              color: '#6b7280',
              fontFamily: 'IBM Plex Mono, monospace',
            }}
          >
            2024年3月14日
          </div>
        </div>
        <div
          style={{
            textAlign: 'center',
            padding: '0.8rem',
            background: 'rgba(247, 147, 26, 0.08)',
            borderRadius: '12px',
          }}
        >
          <div
            style={{
              fontSize: '0.85rem',
              color: '#6b7280',
              marginBottom: '0.2rem',
            }}
          >
            証人数
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#f7931a',
            }}
          >
            43名
          </div>
        </div>
      </div>
    </Panel>
  ),
  name: 'Panel - Certificate Preview',
}

export const BlockchainInfoPanel: Story = {
  render: () => (
    <Panel size="medium">
      <div
        style={{
          fontFamily: 'IBM Plex Sans JP, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.6rem 0',
            borderBottom: '1px solid rgba(116, 192, 252, 0.1)',
          }}
        >
          <span
            style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Link size={16} color="#f7931a" />
            トランザクションID
          </span>
          <span
            style={{
              fontSize: '0.9rem',
              fontFamily: 'IBM Plex Mono, monospace',
              color: '#374151',
              fontWeight: '500',
            }}
          >
            0x7f83b1657ff1fc...
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.6rem 0',
            borderBottom: '1px solid rgba(116, 192, 252, 0.1)',
          }}
        >
          <span
            style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Calendar size={16} color="#f7931a" />
            記録日時
          </span>
          <span
            style={{
              fontSize: '0.9rem',
              fontFamily: 'IBM Plex Mono, monospace',
              color: '#374151',
              fontWeight: '500',
            }}
          >
            2024/03/14 15:30:42
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.6rem 0',
          }}
        >
          <span
            style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Shield size={16} color="#f7931a" />
            ネットワーク
          </span>
          <span
            style={{
              fontSize: '0.9rem',
              fontFamily: 'IBM Plex Mono, monospace',
              color: '#374151',
              fontWeight: '500',
            }}
          >
            Bitcoin Testnet
          </span>
        </div>
      </div>
    </Panel>
  ),
  name: 'Panel - Blockchain Info',
}

export const MemoryShowcasePanel: Story = {
  render: () => (
    <Panel size="medium">
      <div
        style={{
          textAlign: 'center',
          fontFamily: 'IBM Plex Sans JP, sans-serif',
        }}
      >
        <div
          style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #e64980, #74c0fc)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '3rem',
            color: 'white',
            boxShadow: `
            inset 0 2px 3px rgba(255, 255, 255, 0.3),
            inset 0 -2px 3px rgba(0, 0, 0, 0.15),
            0 3px 6px rgba(0, 0, 0, 0.12),
            0 8px 16px rgba(0, 0, 0, 0.08)`,
          }}
        >
          💒
        </div>
        <div
          style={{
            fontSize: '1.1rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem',
          }}
        >
          2024年3月14日
        </div>
        <div
          style={{
            fontSize: '0.9rem',
            color: '#6b7280',
            lineHeight: '1.5',
          }}
        >
          田中 太郎 & 山田 花子
          <br />
          永遠の愛がブロックチェーンに刻まれた瞬間
        </div>
      </div>
    </Panel>
  ),
  name: 'Panel - Memory Showcase',
}

export const ThankYouMessagePanel: Story = {
  render: () => (
    <Panel size="medium">
      <div
        style={{
          textAlign: 'center',
          fontFamily: 'IBM Plex Sans JP, sans-serif',
        }}
      >
        <span
          style={{
            fontSize: '2.5rem',
            marginBottom: '1rem',
            display: 'block',
          }}
        >
          🙏
        </span>
        <h2
          style={{
            fontSize: '1.3rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.8rem',
            letterSpacing: '1px',
          }}
        >
          ありがとうございました
        </h2>
        <p
          style={{
            fontSize: '1rem',
            color: '#6b7280',
            lineHeight: '1.6',
            marginBottom: '1rem',
          }}
        >
          あなたの温かい証人により、
          <br />
          この愛の物語は永遠に記録されました
        </p>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, #f7931a, #ff9500)',
            color: 'white',
            padding: '0.6rem 1.2rem',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '500',
            boxShadow: `
            inset 0 1px 1px rgba(255, 255, 255, 0.3),
            inset 0 -1px 2px rgba(0, 0, 0, 0.15),
            0 2px 4px rgba(0, 0, 0, 0.12)`,
          }}
        >
          <span>🏆</span>
          <span>永遠の証人</span>
        </div>
      </div>
    </Panel>
  ),
  name: 'Panel - Thank You Message',
}

export const ReactionPanel: Story = {
  render: () => (
    <Panel size="medium">
      <div
        style={{
          fontFamily: 'IBM Plex Sans JP, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: '0.9rem',
            fontWeight: '500',
            color: '#374151',
            textAlign: 'center',
            marginBottom: '1rem',
          }}
        >
          この瞬間にリアクションを送りましょう
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.8rem',
            marginBottom: '1rem',
            flexWrap: 'wrap',
          }}
        >
          {['👏', '🎉', '❤️', '💕', '🌟', '💐'].map((emoji, index) => (
            <div
              key={index}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                border: '1px solid rgba(116, 192, 252, 0.25)',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.5rem',
                boxShadow: `
                inset 0 1px 2px rgba(255, 255, 255, 0.9),
                inset 0 -1px 2px rgba(0, 0, 0, 0.05),
                0 1px 1px rgba(255, 255, 255, 0.5)`,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="祝福メッセージを入力してください..."
          style={{
            width: '100%',
            padding: '0.8rem 1rem',
            background: '#ffffff',
            border: '1px solid rgba(116, 192, 252, 0.25)',
            borderRadius: '16px',
            fontSize: '0.9rem',
            fontFamily: 'inherit',
            color: '#374151',
            boxShadow: `
              inset 0 1px 2px rgba(255, 255, 255, 0.9),
              inset 0 -1px 2px rgba(0, 0, 0, 0.05),
              0 1px 1px rgba(255, 255, 255, 0.5)`,
          }}
        />
      </div>
    </Panel>
  ),
  name: 'Panel - Reaction Section',
}

// =================================================================
// SHOWCASE STORIES
// =================================================================

export const AllPanelsShowcase: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        padding: '2rem',
        maxWidth: '1200px',
        fontFamily: 'IBM Plex Sans JP, sans-serif',
      }}
    >
      <div>
        <h3 style={{ marginBottom: '1rem', color: '#374151' }}>Person Card</h3>
        <Panel size="small">
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #74c0fc, #4dabf7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                margin: '0 auto 1rem',
                boxShadow: `0 8px 16px rgba(116, 192, 252, 0.25)`,
              }}
            >
              🤵
            </div>
            <div
              style={{
                fontSize: '1.2rem',
                fontWeight: '500',
                color: '#74c0fc',
                marginBottom: '0.5rem',
              }}
            >
              新郎
            </div>
            <div
              style={{ fontSize: '1rem', fontWeight: '600', color: '#74c0fc' }}
            >
              署名中
            </div>
          </div>
        </Panel>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem', color: '#374151' }}>
          Ceremony Info
        </h3>
        <Panel size="small">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div style={{ fontSize: '1rem', textAlign: 'right', flex: '1' }}>
              田中 太郎
            </div>
            <div
              style={{
                width: '24px',
                height: '24px',
                fontSize: '1.2rem',
                color: '#f7931a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(247, 147, 26, 0.1)',
                borderRadius: '50%',
              }}
            >
              ₿
            </div>
            <div style={{ fontSize: '1rem', textAlign: 'left', flex: '1' }}>
              山田 花子
            </div>
          </div>
        </Panel>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem', color: '#374151' }}>
          Tech Carousel
        </h3>
        <Panel size="small">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌍</div>
            <div
              style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.3rem',
              }}
            >
              世界中から検証可能
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              いつでもどこからでも記録の真正性を確認
            </div>
          </div>
        </Panel>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem', color: '#374151' }}>
          Memory Showcase
        </h3>
        <Panel size="small">
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #e64980, #74c0fc)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '2rem',
                color: 'white',
              }}
            >
              💒
            </div>
            <div
              style={{
                fontSize: '0.9rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
              }}
            >
              2024年3月14日
            </div>
          </div>
        </Panel>
      </div>
    </div>
  ),
  name: 'All Panels (Showcase)',
}
