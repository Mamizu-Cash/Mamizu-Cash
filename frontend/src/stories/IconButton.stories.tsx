import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import {
  Heart,
  Star,
  ThumbsUp,
  Send,
  Share,
  Bookmark,
  Settings,
  Search,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Twitter,
  Facebook,
  MessageSquare,
  Camera,
  Copy,
  Check,
} from 'lucide-react'

import { IconButton } from '../components/ui'

// =================================================================
// STORYBOOK META & STORIES - IconButton (Primitive Icon Component)
// =================================================================
const meta: Meta<typeof IconButton> = {
  title: 'Primitives/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    sent: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    children: {
      control: false,
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// =================================================================
// BASIC ICON BUTTON STORIES
// =================================================================

export const Default: Story = {
  args: {
    children: <Heart size={20} />,
    sent: false,
    disabled: false,
    loading: false,
  },
}

export const Sent: Story = {
  args: {
    children: <Heart size={20} />,
    sent: true,
    disabled: false,
    loading: false,
  },
}

export const Disabled: Story = {
  args: {
    children: <Heart size={20} />,
    sent: false,
    disabled: true,
    loading: false,
  },
}

export const Loading: Story = {
  args: {
    children: <Send size={20} />,
    sent: false,
    disabled: false,
    loading: true,
  },
}

// =================================================================
// COMMON ICON VARIATIONS
// =================================================================

export const ActionIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <IconButton>
        <Heart size={20} />
      </IconButton>
      <IconButton>
        <Star size={20} />
      </IconButton>
      <IconButton>
        <ThumbsUp size={20} />
      </IconButton>
      <IconButton>
        <Send size={20} />
      </IconButton>
      <IconButton>
        <Share size={20} />
      </IconButton>
      <IconButton>
        <Bookmark size={20} />
      </IconButton>
    </div>
  ),
  name: 'Action Icons',
}

export const NavigationIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <IconButton>
        <ChevronLeft size={20} />
      </IconButton>
      <IconButton>
        <Search size={20} />
      </IconButton>
      <IconButton>
        <Plus size={20} />
      </IconButton>
      <IconButton>
        <Settings size={20} />
      </IconButton>
      <IconButton>
        <X size={20} />
      </IconButton>
      <IconButton>
        <ChevronRight size={20} />
      </IconButton>
    </div>
  ),
  name: 'Navigation Icons',
}

export const SocialMediaIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
  name: 'Social Media Icons',
}

// =================================================================
// EMOJI REACTION BUTTONS (from mockups)
// =================================================================

export const EmojiReactions: Story = {
  render: () => (
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
  ),
  name: 'Emoji Reactions',
}

export const EmojiReactionsSent: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '0.8rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <IconButton sent>👏</IconButton>
      <IconButton>🎉</IconButton>
      <IconButton sent>❤️</IconButton>
      <IconButton>💕</IconButton>
      <IconButton sent>🌟</IconButton>
      <IconButton>💐</IconButton>
    </div>
  ),
  name: 'Emoji Reactions (Some Sent)',
}

// =================================================================
// INTERACTIVE STORIES
// =================================================================

export const InteractiveReactions: Story = {
  render: () => {
    const [sentReactions, setSentReactions] = React.useState<{
      [key: string]: boolean
    }>({})

    const handleReactionClick = (emoji: string) => {
      setSentReactions((prev) => ({
        ...prev,
        [emoji]: !prev[emoji],
      }))
    }

    const emojis = ['👏', '🎉', '❤️', '💕', '🌟', '💐']

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          alignItems: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'IBM Plex Sans JP',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
          }}
        >
          Click emoji buttons to toggle sent state
        </p>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          {emojis.map((emoji) => (
            <IconButton
              key={emoji}
              sent={sentReactions[emoji] || false}
              onClick={() => handleReactionClick(emoji)}
            >
              {emoji}
            </IconButton>
          ))}
        </div>
      </div>
    )
  },
  name: 'Interactive Reactions Demo',
}

export const CopyButtonVariation: Story = {
  render: () => {
    const [copied, setCopied] = React.useState(false)

    const handleCopy = () => {
      navigator.clipboard.writeText('Sample text copied to clipboard')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'IBM Plex Mono',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
          }}
        >
          0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa...
        </p>
        <IconButton sent={copied} onClick={handleCopy}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </IconButton>
      </div>
    )
  },
  name: 'Copy Button Variation',
}

// =================================================================
// SIZE VARIATIONS
// =================================================================

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <IconButton style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
        <Heart size={14} />
      </IconButton>
      <IconButton style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
        <Heart size={16} />
      </IconButton>
      <IconButton>
        <Heart size={20} />
      </IconButton>
      <IconButton
        style={{ width: '56px', height: '56px', fontSize: '1.25rem' }}
      >
        <Heart size={24} />
      </IconButton>
    </div>
  ),
  name: 'Size Variations',
}

// =================================================================
// SHOWCASE STORY
// =================================================================

export const AllIconButtonsShowcase: Story = {
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
        Action Icons
      </h3>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <IconButton>
          <Heart size={20} />
        </IconButton>
        <IconButton sent>
          <Star size={20} />
        </IconButton>
        <IconButton>
          <ThumbsUp size={20} />
        </IconButton>
        <IconButton>
          <Send size={20} />
        </IconButton>
        <IconButton>
          <Bookmark size={20} />
        </IconButton>
      </div>

      <h3
        style={{
          fontFamily: 'IBM Plex Sans JP',
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        Emoji Reactions
      </h3>
      <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
        <IconButton>👏</IconButton>
        <IconButton sent>🎉</IconButton>
        <IconButton>❤️</IconButton>
        <IconButton sent>💕</IconButton>
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
        Social Media
      </h3>
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

      <h3
        style={{
          fontFamily: 'IBM Plex Sans JP',
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        States
      </h3>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <IconButton>
          <Heart size={20} />
        </IconButton>
        <IconButton sent>
          <Heart size={20} />
        </IconButton>
        <IconButton disabled>
          <Heart size={20} />
        </IconButton>
        <IconButton loading>
          <Send size={20} />
        </IconButton>
      </div>
    </div>
  ),
  name: 'All IconButtons (Showcase)',
}
