import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Avatar } from '../components/ui/Avatar/Avatar'

// =================================================================
// STORYBOOK META & STORIES - Avatar (Primitive Display Component)
// =================================================================
const meta: Meta<typeof Avatar> = {
  title: 'Primitives/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'extraLarge', 'huge'],
    },
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
      ],
    },
    status: {
      control: { type: 'select' },
      options: ['online', 'busy', 'offline', 'away'],
    },
    interactive: {
      control: 'boolean',
    },
    name: {
      control: 'text',
    },
    initials: {
      control: 'text',
    },
    src: {
      control: 'text',
    },
    alt: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// =================================================================
// BASIC AVATAR STORIES
// =================================================================

export const Default: Story = {
  args: {
    name: 'John Doe',
    size: 'medium',
    variant: 'default',
    interactive: false,
  },
}

export const WithInitials: Story = {
  args: {
    initials: 'JD',
    size: 'medium',
    variant: 'primary',
  },
}

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    alt: 'Profile picture',
    name: 'John Doe',
    size: 'medium',
  },
}

export const WithEmoji: Story = {
  args: {
    children: '👰',
    size: 'large',
    variant: 'accent',
  },
}

export const Interactive: Story = {
  args: {
    name: 'Jane Smith',
    size: 'large',
    variant: 'primary',
    interactive: true,
    onClick: () => alert('Avatar clicked!'),
  },
}

// =================================================================
// SIZE VARIANTS
// =================================================================

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Avatar size="small" name="Small Avatar" variant="primary" />
      <Avatar size="medium" name="Medium Avatar" variant="primary" />
      <Avatar size="large" name="Large Avatar" variant="primary" />
      <Avatar size="extraLarge" name="Extra Large Avatar" variant="primary" />
      <Avatar size="huge" name="Huge Avatar" variant="primary" />
    </div>
  ),
  name: 'Sizes',
}

// =================================================================
// COLOR VARIANTS
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
      <Avatar variant="default" name="Default User" />
      <Avatar variant="primary" name="Primary User" />
      <Avatar variant="secondary" name="Secondary User" />
      <Avatar variant="accent" name="Accent User" />
      <Avatar variant="success" name="Success User" />
      <Avatar variant="warning" name="Warning User" />
      <Avatar variant="error" name="Error User" />
    </div>
  ),
  name: 'Variants',
}

// =================================================================
// STATUS INDICATORS
// =================================================================

export const StatusIndicators: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <Avatar
          name="Online User"
          variant="primary"
          status="online"
          size="large"
        />
        <div
          style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6b7280' }}
        >
          Online
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar name="Busy User" variant="warning" status="busy" size="large" />
        <div
          style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6b7280' }}
        >
          Busy
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar
          name="Away User"
          variant="secondary"
          status="away"
          size="large"
        />
        <div
          style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6b7280' }}
        >
          Away
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar
          name="Offline User"
          variant="default"
          status="offline"
          size="large"
        />
        <div
          style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6b7280' }}
        >
          Offline
        </div>
      </div>
    </div>
  ),
  name: 'Status Indicators',
}

// =================================================================
// EMOJI AVATARS (from mockups)
// =================================================================

export const EmojiAvatars: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Avatar size="huge" variant="accent">
          👰
        </Avatar>
        <div
          style={{
            marginTop: '0.5rem',
            fontSize: '0.9rem',
            color: 'var(--bride-primary)',
            fontWeight: '500',
          }}
        >
          新婦
        </div>
      </div>
      <div style={{ fontSize: '2rem', margin: '0 1rem' }}>💕</div>
      <div style={{ textAlign: 'center' }}>
        <Avatar size="huge" variant="primary">
          🤵
        </Avatar>
        <div
          style={{
            marginTop: '0.5rem',
            fontSize: '0.9rem',
            color: 'var(--groom-primary)',
            fontWeight: '500',
          }}
        >
          新郎
        </div>
      </div>
    </div>
  ),
  name: 'Emoji Avatars (from mockup)',
}

export const PersonStatusAvatars: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Avatar size="extraLarge" variant="primary" status="online">
          🤵
        </Avatar>
        <div
          style={{
            marginTop: '0.75rem',
            fontSize: '1rem',
            fontWeight: '500',
            color: 'var(--groom-primary)',
          }}
        >
          新郎
        </div>
        <div
          style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: '600' }}
        >
          署名済み
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar size="extraLarge" variant="accent" status="busy">
          👰
        </Avatar>
        <div
          style={{
            marginTop: '0.75rem',
            fontSize: '1rem',
            fontWeight: '500',
            color: 'var(--bride-primary)',
          }}
        >
          新婦
        </div>
        <div
          style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: '600' }}
        >
          署名中
        </div>
      </div>
    </div>
  ),
  name: 'Person Status (from mockup)',
}

// =================================================================
// CONTENT VARIATIONS
// =================================================================

export const ContentTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', fontFamily: 'IBM Plex Sans JP' }}>
          Initials
        </h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Avatar name="田中 太郎" variant="primary" size="large" />
          <Avatar name="山田 花子" variant="accent" size="large" />
          <Avatar initials="BTC" variant="secondary" size="large" />
          <Avatar name="Alice Bob" variant="success" size="large" />
        </div>
      </div>

      <div>
        <h3 style={{ margin: '0 0 1rem 0', fontFamily: 'IBM Plex Sans JP' }}>
          Emojis
        </h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Avatar variant="primary" size="large">
            👤
          </Avatar>
          <Avatar variant="accent" size="large">
            👰
          </Avatar>
          <Avatar variant="primary" size="large">
            🤵
          </Avatar>
          <Avatar variant="secondary" size="large">
            💎
          </Avatar>
          <Avatar variant="success" size="large">
            ✅
          </Avatar>
        </div>
      </div>

      <div>
        <h3 style={{ margin: '0 0 1rem 0', fontFamily: 'IBM Plex Sans JP' }}>
          Images (with fallback)
        </h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Avatar
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            name="John Doe"
            variant="primary"
            size="large"
          />
          <Avatar
            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
            name="Jane Smith"
            variant="accent"
            size="large"
          />
          <Avatar
            src="broken-image-url.jpg"
            name="Fallback User"
            variant="secondary"
            size="large"
          />
        </div>
      </div>
    </div>
  ),
  name: 'Content Types',
}

// =================================================================
// INTERACTIVE DEMOS
// =================================================================

export const InteractiveAvatars: Story = {
  render: () => {
    const [selectedAvatar, setSelectedAvatar] = React.useState<string | null>(
      null,
    )

    const avatars = [
      { id: 'bride', name: '新婦', emoji: '👰', variant: 'accent' as const },
      { id: 'groom', name: '新郎', emoji: '🤵', variant: 'primary' as const },
      {
        id: 'witness1',
        name: '証人1',
        initials: 'W1',
        variant: 'secondary' as const,
      },
      {
        id: 'witness2',
        name: '証人2',
        initials: 'W2',
        variant: 'success' as const,
      },
    ]

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
          Click on avatars to select them
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {avatars.map((avatar) => (
            <div key={avatar.id} style={{ textAlign: 'center' }}>
              <Avatar
                size="large"
                variant={
                  selectedAvatar === avatar.id ? 'success' : avatar.variant
                }
                interactive
                initials={avatar.initials}
                onClick={() =>
                  setSelectedAvatar(
                    selectedAvatar === avatar.id ? null : avatar.id,
                  )
                }
                style={{
                  transform:
                    selectedAvatar === avatar.id ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.2s ease',
                }}
              >
                {avatar.emoji}
              </Avatar>
              <div
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.8rem',
                  color: selectedAvatar === avatar.id ? '#10b981' : '#6b7280',
                  fontWeight: selectedAvatar === avatar.id ? '500' : '400',
                }}
              >
                {avatar.name}
              </div>
            </div>
          ))}
        </div>

        {selectedAvatar && (
          <div
            style={{
              padding: '1rem',
              background: '#f0f9ff',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: '#0369a1',
            }}
          >
            Selected: {avatars.find((a) => a.id === selectedAvatar)?.name}
          </div>
        )}
      </div>
    )
  },
  name: 'Interactive Demo',
}

export const AvatarGroup: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ margin: '0 0 1rem 0', fontFamily: 'IBM Plex Sans JP' }}>
          Witness List
        </h3>
        <div style={{ display: 'flex', gap: '-0.5rem' }}>
          {[
            { name: 'Alice Johnson', variant: 'primary' as const },
            { name: 'Bob Smith', variant: 'secondary' as const },
            { name: 'Carol Davis', variant: 'accent' as const },
            { name: 'David Wilson', variant: 'success' as const },
            { name: 'Eve Brown', variant: 'warning' as const },
          ].map((person, index) => (
            <Avatar
              key={person.name}
              name={person.name}
              variant={person.variant}
              size="medium"
              style={{
                marginLeft: index > 0 ? '-0.5rem' : 0,
                zIndex: 5 - index,
                border: '2px solid white',
              }}
              status={index < 3 ? 'online' : 'offline'}
            />
          ))}
          <div
            style={{
              marginLeft: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.9rem',
              color: '#6b7280',
            }}
          >
            +15 more
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ margin: '0 0 1rem 0', fontFamily: 'IBM Plex Sans JP' }}>
          Team
        </h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Avatar
            name="Admin User"
            variant="error"
            size="large"
            status="online"
          />
          <Avatar
            name="Moderator"
            variant="warning"
            size="medium"
            status="busy"
          />
          <Avatar
            name="Member 1"
            variant="primary"
            size="medium"
            status="online"
          />
          <Avatar
            name="Member 2"
            variant="secondary"
            size="medium"
            status="away"
          />
          <Avatar
            name="Guest"
            variant="default"
            size="small"
            status="offline"
          />
        </div>
      </div>
    </div>
  ),
  name: 'Avatar Groups',
}

// =================================================================
// SHOWCASE STORY
// =================================================================

export const AllAvatarsShowcase: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '3rem',
        minWidth: '600px',
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
          Avatar Sizes
        </h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Avatar size="small" name="Small" variant="primary" />
          <Avatar size="medium" name="Medium" variant="primary" />
          <Avatar size="large" name="Large" variant="primary" />
          <Avatar size="extraLarge" name="Extra Large" variant="primary" />
          <Avatar size="huge" name="Huge" variant="primary" />
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
          Avatar Variants
        </h3>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Avatar variant="default" name="Default" size="large" />
          <Avatar variant="primary" name="Primary" size="large" />
          <Avatar variant="secondary" name="Secondary" size="large" />
          <Avatar variant="accent" name="Accent" size="large" />
          <Avatar variant="success" name="Success" size="large" />
          <Avatar variant="warning" name="Warning" size="large" />
          <Avatar variant="error" name="Error" size="large" />
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
          Content Types
        </h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Avatar name="田中 太郎" variant="primary" size="large" />
          <Avatar variant="accent" size="large">
            👰
          </Avatar>
          <Avatar
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            name="Profile"
            variant="secondary"
            size="large"
          />
          <Avatar initials="BTC" variant="warning" size="large" />
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
          Status Indicators
        </h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Avatar
            name="Online"
            variant="success"
            size="large"
            status="online"
          />
          <Avatar name="Busy" variant="warning" size="large" status="busy" />
          <Avatar name="Away" variant="secondary" size="large" status="away" />
          <Avatar
            name="Offline"
            variant="default"
            size="large"
            status="offline"
          />
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
          Ceremony Participants (from mockup)
        </h3>
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Avatar size="huge" variant="primary" status="online">
              🤵
            </Avatar>
            <div
              style={{
                marginTop: '0.75rem',
                fontSize: '1rem',
                fontWeight: '500',
                color: 'var(--groom-primary)',
              }}
            >
              新郎
            </div>
            <div
              style={{
                fontSize: '0.9rem',
                color: '#10b981',
                fontWeight: '600',
              }}
            >
              署名済み
            </div>
          </div>
          <div style={{ fontSize: '2rem', margin: '0 1rem' }}>💕</div>
          <div style={{ textAlign: 'center' }}>
            <Avatar size="huge" variant="accent" status="busy">
              👰
            </Avatar>
            <div
              style={{
                marginTop: '0.75rem',
                fontSize: '1rem',
                fontWeight: '500',
                color: 'var(--bride-primary)',
              }}
            >
              新婦
            </div>
            <div
              style={{
                fontSize: '0.9rem',
                color: '#f59e0b',
                fontWeight: '600',
              }}
            >
              署名中
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  name: 'All Avatars (Showcase)',
}
