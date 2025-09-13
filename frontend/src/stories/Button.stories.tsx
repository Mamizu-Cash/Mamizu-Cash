import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import {
  UserPlus,
  Send,
  Save,
  Search,
  Twitter,
  Facebook,
  MessageSquare,
  Camera,
} from 'lucide-react'

import { Button, IconButton, CopyButton } from '../components/ui'

// =================================================================
// STORYBOOK META & STORIES
// =================================================================
const meta: Meta = {
  title: 'Primitives/Button',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// =================================================================
// BUTTON STORIES (Large buttons)
// =================================================================

export const ParticipateButtonDefault: Story = {
  render: () => (
    <Button variant="groom" size="large" icon={<UserPlus size={20} />}>
      参加
    </Button>
  ),
  name: 'Button - Participate (Default)',
}

export const ParticipateButtonDisabled: Story = {
  render: () => (
    <Button variant="groom" size="large" disabled icon={<UserPlus size={20} />}>
      参加
    </Button>
  ),
  name: 'Button - Participate (Disabled)',
}

export const ParticipateButtonLoading: Story = {
  render: () => (
    <Button variant="groom" size="large" loading icon={<UserPlus size={20} />}>
      処理中...
    </Button>
  ),
  name: 'Button - Participate (Loading)',
}

export const CelebrationButtonDefault: Story = {
  render: () => (
    <Button variant="bride" size="large">
      🎊 みんなでお祝いする
    </Button>
  ),
  name: 'Button - Celebration (Default)',
}

export const CelebrationButtonCountdown: Story = {
  render: () => (
    <Button variant="bride" size="large" countdown>
      🎊 みんなでお祝いする
    </Button>
  ),
  name: 'Button - Celebration (Countdown)',
}

export const CelebrationButtonDisabled: Story = {
  render: () => (
    <Button variant="bride" size="large" disabled>
      🎊 みんなでお祝いする
    </Button>
  ),
  name: 'Button - Celebration (Disabled)',
}

export const ActionButtonPrimaryDefault: Story = {
  render: () => (
    <Button variant="primary" icon={<Send size={20} />}>
      この記録を共有
    </Button>
  ),
  name: 'Button - Action Primary (Default)',
}

export const ActionButtonPrimaryVariant: Story = {
  render: () => (
    <Button variant="primary" icon={<Save size={20} />}>
      この記念を保存
    </Button>
  ),
  name: 'Button - Action Primary (Save Memory)',
}

export const ActionButtonSecondaryDefault: Story = {
  render: () => (
    <Button variant="secondary" icon={<Search size={20} />}>
      エクスプローラーで確認
    </Button>
  ),
  name: 'Button - Action Secondary (Default)',
}

export const ActionButtonSecondaryVariant: Story = {
  render: () => (
    <Button variant="secondary" icon={<Search size={20} />}>
      他のセレモニーも探す
    </Button>
  ),
  name: 'Button - Action Secondary (Explore More)',
}

export const TimeDisplayButton: Story = {
  render: () => <Button variant="timeDisplay">2024.03.14 15:30</Button>,
  name: 'Button - Time Display',
}

// =================================================================
// ICON BUTTON STORIES (Small buttons)
// =================================================================

export const ReactionButtonDefault: Story = {
  render: () => <IconButton>👏</IconButton>,
  name: 'IconButton - Reaction (Default)',
}

export const ReactionButtonSent: Story = {
  render: () => <IconButton sent>🎉</IconButton>,
  name: 'IconButton - Reaction (Sent)',
}

export const ReactionButtonVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
      <IconButton>👏</IconButton>
      <IconButton>🎉</IconButton>
      <IconButton>❤️</IconButton>
      <IconButton>💕</IconButton>
      <IconButton>🌟</IconButton>
      <IconButton>💐</IconButton>
    </div>
  ),
  name: 'IconButton - Reaction (All Variants)',
}

export const ShareButtonTwitter: Story = {
  render: () => (
    <IconButton>
      <Twitter size={20} color="#1da1f2" />
    </IconButton>
  ),
  name: 'IconButton - Share (Twitter)',
}

export const ShareButtonFacebook: Story = {
  render: () => (
    <IconButton>
      <Facebook size={20} color="#4267b2" />
    </IconButton>
  ),
  name: 'IconButton - Share (Facebook)',
}

export const ShareButtonLine: Story = {
  render: () => (
    <IconButton>
      <MessageSquare size={20} color="#00c300" />
    </IconButton>
  ),
  name: 'IconButton - Share (Line)',
}

export const ShareButtonInstagram: Story = {
  render: () => (
    <IconButton>
      <Camera size={20} color="#e4405f" />
    </IconButton>
  ),
  name: 'IconButton - Share (Instagram)',
}

export const ShareButtonsAll: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <IconButton>
        <Twitter size={20} color="#1da1f2" />
      </IconButton>
      <IconButton>
        <Facebook size={20} color="#4267b2" />
      </IconButton>
      <IconButton>
        <MessageSquare size={20} color="#00c300" />
      </IconButton>
      <IconButton>
        <Camera size={20} color="#e4405f" />
      </IconButton>
    </div>
  ),
  name: 'IconButton - Share (All Variants)',
}

// =================================================================
// COPY BUTTON STORIES
// =================================================================

export const CopyButtonDefault: Story = {
  render: () => (
    <CopyButton textToCopy="0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069" />
  ),
  name: 'CopyButton - Default',
}

export const CopyButtonWithCustomText: Story = {
  render: () => (
    <CopyButton textToCopy="カスタムテキスト" successMessage="✓ 完了">
      カスタムコピー
    </CopyButton>
  ),
  name: 'CopyButton - Custom Text',
}

// =================================================================
// SHOWCASE STORIES
// =================================================================

export const AllButtonsShowcase: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        minWidth: '300px',
      }}
    >
      <h3
        style={{
          fontFamily: 'IBM Plex Sans JP',
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        Large Buttons
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Button variant="groom" size="large" icon={<UserPlus size={20} />}>
          参加
        </Button>
        <Button variant="primary" icon={<Send size={20} />}>
          この記録を共有
        </Button>
        <Button variant="secondary" icon={<Search size={20} />}>
          エクスプローラーで確認
        </Button>
        <Button variant="bride" size="large">
          🎊 みんなでお祝いする
        </Button>
        <Button variant="timeDisplay">2024.03.14 15:30</Button>
      </div>

      <h3
        style={{
          fontFamily: 'IBM Plex Sans JP',
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        Icon Buttons (Reaction)
      </h3>
      <div
        style={{
          display: 'flex',
          gap: '0.8rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <IconButton>👏</IconButton>
        <IconButton>🎉</IconButton>
        <IconButton>❤️</IconButton>
        <IconButton>💕</IconButton>
        <IconButton>🌟</IconButton>
        <IconButton>💐</IconButton>
      </div>

      <h3
        style={{
          fontFamily: 'IBM Plex Sans JP',
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        Icon Buttons (Social Share)
      </h3>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <IconButton>
          <Twitter size={20} color="#1da1f2" />
        </IconButton>
        <IconButton>
          <Facebook size={20} color="#4267b2" />
        </IconButton>
        <IconButton>
          <MessageSquare size={20} color="#00c300" />
        </IconButton>
        <IconButton>
          <Camera size={20} color="#e4405f" />
        </IconButton>
      </div>

      <h3
        style={{
          fontFamily: 'IBM Plex Sans JP',
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        Copy Button
      </h3>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span
          style={{
            fontFamily: 'IBM Plex Mono',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
          }}
        >
          0x7f83b1657ff1fc...
        </span>
        <CopyButton textToCopy="0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069" />
      </div>
    </div>
  ),
  name: 'All Buttons (Showcase)',
}

// =================================================================
// INTERACTION DEMOS
// =================================================================

export const InteractionDemo: Story = {
  render: () => {
    const [reactionSent, setReactionSent] = React.useState<{
      [key: string]: boolean
    }>({})

    const handleReactionClick = (emoji: string) => {
      setReactionSent((prev) => ({ ...prev, [emoji]: !prev[emoji] }))
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          minWidth: '300px',
        }}
      >
        <h3
          style={{
            fontFamily: 'IBM Plex Sans JP',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          Interactive Demo
        </h3>

        <div>
          <p
            style={{
              fontFamily: 'IBM Plex Sans JP',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              marginBottom: '1rem',
            }}
          >
            リアクションボタンをクリックしてスプラッシュ効果を確認
          </p>
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            {['👏', '🎉', '❤️', '💕', '🌟', '💐'].map((emoji) => (
              <IconButton
                key={emoji}
                sent={reactionSent[emoji]}
                onClick={() => handleReactionClick(emoji)}
              >
                {emoji}
              </IconButton>
            ))}
          </div>
        </div>

        <div>
          <p
            style={{
              fontFamily: 'IBM Plex Sans JP',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              marginBottom: '1rem',
            }}
          >
            ソーシャルシェアボタンもクリック時にエフェクトが発生
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <IconButton>
              <Twitter size={20} color="#1da1f2" />
            </IconButton>
            <IconButton>
              <Facebook size={20} color="#4267b2" />
            </IconButton>
            <IconButton>
              <MessageSquare size={20} color="#00c300" />
            </IconButton>
            <IconButton>
              <Camera size={20} color="#e4405f" />
            </IconButton>
          </div>
        </div>

        <div>
          <p
            style={{
              fontFamily: 'IBM Plex Sans JP',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              marginBottom: '1rem',
            }}
          >
            コピーボタンはクリック後に状態が変化
          </p>
          <CopyButton textToCopy="テストテキストがコピーされます" />
        </div>
      </div>
    )
  },
  name: 'Interactive Demo',
}
