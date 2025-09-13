import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import {
  Crown,
  Star,
  Shield,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  Users,
} from 'lucide-react'

import { Badge } from '../components/ui/Badge/Badge'

// =================================================================
// STORYBOOK META & STORIES - Badge (Primitive Status Component)
// =================================================================
const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'default',
        'primary',
        'secondary',
        'accent',
        'success',
        'warning',
        'error',
        'info',
        'dark',
      ],
    },
    outline: {
      control: 'boolean',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    count: {
      control: 'boolean',
    },
    pill: {
      control: 'boolean',
    },
    withDot: {
      control: 'boolean',
    },
    pulsing: {
      control: 'boolean',
    },
    interactive: {
      control: 'boolean',
    },
    children: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// =================================================================
// BASIC BADGE STORIES
// =================================================================

export const Default: Story = {
  args: {
    children: 'Default Badge',
    variant: 'default',
    size: 'medium',
  },
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Star size={14} />
        Premium
      </>
    ),
    variant: 'secondary',
    size: 'medium',
  },
}

export const Count: Story = {
  args: {
    children: '5',
    count: true,
    variant: 'error',
  },
}

export const Pill: Story = {
  args: {
    children: 'New',
    pill: true,
    variant: 'success',
  },
}

export const WithDot: Story = {
  args: {
    children: 'Live',
    withDot: true,
    pulsing: true,
    variant: 'success',
  },
}

// =================================================================
// VARIANT STORIES
// =================================================================

export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="accent">Accent</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="dark">Dark</Badge>
    </div>
  ),
  name: 'Variants',
}

export const OutlineVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Badge variant="default" outline>
        Default
      </Badge>
      <Badge variant="primary" outline>
        Primary
      </Badge>
      <Badge variant="secondary" outline>
        Secondary
      </Badge>
      <Badge variant="accent" outline>
        Accent
      </Badge>
      <Badge variant="success" outline>
        Success
      </Badge>
      <Badge variant="warning" outline>
        Warning
      </Badge>
      <Badge variant="error" outline>
        Error
      </Badge>
    </div>
  ),
  name: 'Outline Variants',
}

// =================================================================
// SIZE VARIANTS
// =================================================================

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Badge size="small" variant="primary">
        Small
      </Badge>
      <Badge size="medium" variant="primary">
        Medium
      </Badge>
      <Badge size="large" variant="primary">
        Large
      </Badge>
    </div>
  ),
  name: 'Sizes',
}

export const CountSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Badge count size="small" variant="error">
        1
      </Badge>
      <Badge count size="medium" variant="error">
        5
      </Badge>
      <Badge count size="large" variant="error">
        99+
      </Badge>
    </div>
  ),
  name: 'Count Sizes',
}

// =================================================================
// SPECIAL FEATURES
// =================================================================

export const StatusBadges: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Badge variant="success" withDot>
        <CheckCircle size={14} />
        完了
      </Badge>
      <Badge variant="warning" withDot pulsing>
        <Clock size={14} />
        処理中
      </Badge>
      <Badge variant="error" withDot>
        <XCircle size={14} />
        エラー
      </Badge>
      <Badge variant="info" withDot>
        <Info size={14} />
        待機中
      </Badge>
    </div>
  ),
  name: 'Status Badges',
}

export const NotificationBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            background: 'var(--premium-glass)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--premium-border)',
          }}
        >
          💬
        </div>
        <Badge
          count
          variant="error"
          size="small"
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
          }}
        >
          3
        </Badge>
      </div>

      <div style={{ position: 'relative' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            background: 'var(--premium-glass)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--premium-border)',
          }}
        >
          🔔
        </div>
        <Badge
          count
          variant="accent"
          size="small"
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
          }}
        >
          12
        </Badge>
      </div>

      <div style={{ position: 'relative' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            background: 'var(--premium-glass)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--premium-border)',
          }}
        >
          📧
        </div>
        <Badge
          count
          variant="secondary"
          size="small"
          pulsing
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
          }}
        >
          99+
        </Badge>
      </div>
    </div>
  ),
  name: 'Notification Badges',
}

export const PillShapes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Badge pill variant="success">
        新着
      </Badge>
      <Badge pill variant="warning">
        人気
      </Badge>
      <Badge pill variant="error">
        限定
      </Badge>
      <Badge pill variant="secondary">
        <Crown size={12} />
        プレミアム
      </Badge>
      <Badge pill variant="accent">
        <Zap size={12} />
        高速
      </Badge>
    </div>
  ),
  name: 'Pill Shapes',
}

// =================================================================
// BLOCKCHAIN/CRYPTO USE CASES (from mockups)
// =================================================================

export const CeremonyBadges: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        minWidth: '400px',
      }}
    >
      <div>
        <h3 style={{ margin: '0 0 1rem 0', fontFamily: 'IBM Plex Sans JP' }}>
          セレモニー進行状況
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Badge variant="secondary" withDot>
            STEP 1
          </Badge>
          <Badge variant="primary" withDot pulsing>
            STEP 2
          </Badge>
          <Badge variant="default" outline>
            STEP 3
          </Badge>
          <Badge variant="success">COMPLETED</Badge>
        </div>
      </div>

      <div>
        <h3 style={{ margin: '0 0 1rem 0', fontFamily: 'IBM Plex Sans JP' }}>
          証人ステータス
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Badge variant="success">
            <Users size={14} />
            43名参加
          </Badge>
          <Badge variant="accent" withDot pulsing>
            誓いの瞬間
          </Badge>
          <Badge variant="secondary">
            <Shield size={14} />
            検証済み
          </Badge>
        </div>
      </div>
    </div>
  ),
  name: 'Ceremony Badges (from mockup)',
}

export const BlockchainBadges: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        minWidth: '400px',
      }}
    >
      <div>
        <h3 style={{ margin: '0 0 1rem 0', fontFamily: 'IBM Plex Sans JP' }}>
          ブロックチェーン情報
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Badge variant="secondary">Bitcoin Testnet</Badge>
          <Badge variant="success" withDot>
            記録完了
          </Badge>
          <Badge variant="info">Block #834,527</Badge>
        </div>
      </div>

      <div>
        <h3 style={{ margin: '0 0 1rem 0', fontFamily: 'IBM Plex Sans JP' }}>
          トランザクション状況
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Badge variant="warning" withDot pulsing>
            <Clock size={14} />
            承認待ち
          </Badge>
          <Badge variant="success">
            <CheckCircle size={14} />
            6/6 確認
          </Badge>
          <Badge count variant="primary">
            3
          </Badge>
        </div>
      </div>
    </div>
  ),
  name: 'Blockchain Badges',
}

export const WitnessBadges: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minWidth: '350px',
      }}
    >
      <div
        style={{
          padding: '1rem',
          border: '1px solid var(--premium-border)',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: '500' }}>田中 太郎</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Badge variant="primary" pill size="small">
            新郎
          </Badge>
          <Badge variant="success" size="small">
            署名済み
          </Badge>
        </div>
      </div>

      <div
        style={{
          padding: '1rem',
          border: '1px solid var(--premium-border)',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: '500' }}>山田 花子</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Badge variant="accent" pill size="small">
            新婦
          </Badge>
          <Badge variant="warning" size="small" withDot pulsing>
            署名中
          </Badge>
        </div>
      </div>

      <div
        style={{
          padding: '1rem',
          border: '1px solid var(--premium-border)',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontWeight: '500' }}>証人A</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Badge variant="secondary" pill size="small">
            <Crown size={10} />
            永遠の証人
          </Badge>
          <Badge variant="success" size="small">
            参加済み
          </Badge>
        </div>
      </div>
    </div>
  ),
  name: 'Witness Badges (from mockup)',
}

// =================================================================
// INTERACTIVE STORIES
// =================================================================

export const InteractiveBadges: Story = {
  render: () => {
    const [selectedBadges, setSelectedBadges] = React.useState<string[]>([])

    const badges = [
      {
        id: 'reactions',
        label: 'リアクション送信',
        variant: 'primary' as const,
      },
      { id: 'messages', label: 'メッセージ投稿', variant: 'accent' as const },
      { id: 'sharing', label: '記録共有', variant: 'secondary' as const },
      { id: 'celebration', label: '一斉祝福', variant: 'success' as const },
    ]

    const toggleBadge = (badgeId: string) => {
      setSelectedBadges((prev) =>
        prev.includes(badgeId)
          ? prev.filter((id) => id !== badgeId)
          : [...prev, badgeId],
      )
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          alignItems: 'center',
        }}
      >
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Click badges to toggle selection
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {badges.map((badge) => (
            <Badge
              key={badge.id}
              variant={
                selectedBadges.includes(badge.id) ? badge.variant : 'default'
              }
              outline={!selectedBadges.includes(badge.id)}
              interactive
              onClick={() => toggleBadge(badge.id)}
              style={{
                transform: selectedBadges.includes(badge.id)
                  ? 'scale(1.05)'
                  : 'scale(1)',
                transition: 'transform 0.2s ease',
              }}
            >
              {selectedBadges.includes(badge.id) && <CheckCircle size={14} />}
              {badge.label}
            </Badge>
          ))}
        </div>

        <div
          style={{
            padding: '1rem',
            background: '#f8f9fa',
            borderRadius: '8px',
            fontSize: '0.9rem',
          }}
        >
          <strong>選択中の権限:</strong>{' '}
          {selectedBadges.length > 0 ? selectedBadges.length : 'なし'}
        </div>
      </div>
    )
  },
  name: 'Interactive Demo',
}

// =================================================================
// SHOWCASE STORY
// =================================================================

export const AllBadgesShowcase: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        minWidth: '500px',
      }}
    >
      <div>
        <h3
          style={{
            fontFamily: 'IBM Plex Sans JP',
            color: 'var(--text-primary)',
            margin: '0 0 1rem 0',
          }}
        >
          Badge Variants
        </h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="dark">Dark</Badge>
        </div>
      </div>

      <div>
        <h3
          style={{
            fontFamily: 'IBM Plex Sans JP',
            color: 'var(--text-primary)',
            margin: '0 0 1rem 0',
          }}
        >
          Badge Sizes
        </h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Badge size="small" variant="primary">
            Small
          </Badge>
          <Badge size="medium" variant="primary">
            Medium
          </Badge>
          <Badge size="large" variant="primary">
            Large
          </Badge>
        </div>
      </div>

      <div>
        <h3
          style={{
            fontFamily: 'IBM Plex Sans JP',
            color: 'var(--text-primary)',
            margin: '0 0 1rem 0',
          }}
        >
          Special Features
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Badge count variant="error">
            5
          </Badge>
          <Badge pill variant="success">
            New
          </Badge>
          <Badge withDot pulsing variant="warning">
            Live
          </Badge>
          <Badge variant="secondary">
            <Star size={14} />
            Premium
          </Badge>
        </div>
      </div>

      <div>
        <h3
          style={{
            fontFamily: 'IBM Plex Sans JP',
            color: 'var(--text-primary)',
            margin: '0 0 1rem 0',
          }}
        >
          Ceremony Use Cases
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Badge variant="secondary" withDot>
            STEP 2
          </Badge>
          <Badge variant="success">
            <Users size={14} />
            43名参加
          </Badge>
          <Badge variant="accent" withDot pulsing>
            誓いの瞬間
          </Badge>
          <Badge variant="primary" pill size="small">
            新郎
          </Badge>
          <Badge variant="accent" pill size="small">
            新婦
          </Badge>
          <Badge variant="secondary">Bitcoin Testnet</Badge>
        </div>
      </div>

      <div>
        <h3
          style={{
            fontFamily: 'IBM Plex Sans JP',
            color: 'var(--text-primary)',
            margin: '0 0 1rem 0',
          }}
        >
          Outline Variants
        </h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Badge variant="primary" outline>
            Primary
          </Badge>
          <Badge variant="secondary" outline>
            Secondary
          </Badge>
          <Badge variant="accent" outline>
            Accent
          </Badge>
          <Badge variant="success" outline>
            Success
          </Badge>
          <Badge variant="error" outline>
            Error
          </Badge>
        </div>
      </div>
    </div>
  ),
  name: 'All Badges (Showcase)',
}
