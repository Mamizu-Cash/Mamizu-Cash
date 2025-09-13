import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { CopyButton } from '../components/ui'

// =================================================================
// STORYBOOK META & STORIES - CopyButton (Utility Component)
// =================================================================
const meta: Meta<typeof CopyButton> = {
  title: 'Primitives/CopyButton',
  component: CopyButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    textToCopy: {
      control: 'text',
    },
    successMessage: {
      control: 'text',
    },
    resetDelay: {
      control: { type: 'number', min: 500, max: 5000, step: 500 },
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
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
// BASIC COPY BUTTON STORIES
// =================================================================

export const Default: Story = {
  args: {
    textToCopy: 'Hello, world!',
    children: 'コピー',
    successMessage: 'コピー済',
    resetDelay: 2000,
  },
}

export const CustomText: Story = {
  args: {
    textToCopy: 'Custom text to copy',
    children: 'Copy Text',
    successMessage: '✓ Copied!',
    resetDelay: 2000,
  },
}

export const LongDelay: Story = {
  args: {
    textToCopy: 'This will show success message for 5 seconds',
    children: 'コピー',
    successMessage: 'コピー完了！',
    resetDelay: 5000,
  },
}

export const ShortDelay: Story = {
  args: {
    textToCopy: 'Quick reset demo',
    children: 'コピー',
    successMessage: '✓',
    resetDelay: 1000,
  },
}

// =================================================================
// BLOCKCHAIN/CRYPTO USE CASES (from mockups)
// =================================================================

export const TransactionId: Story = {
  args: {
    textToCopy:
      '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    children: 'コピー',
    successMessage: 'コピー済',
    resetDelay: 2000,
  },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: 'IBM Plex Sans JP, sans-serif',
      }}
    >
      <span
        style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          wordBreak: 'break-all',
          maxWidth: '200px',
        }}
      >
        {args.textToCopy?.slice(0, 20)}...
      </span>
      <CopyButton {...args} />
    </div>
  ),
  name: 'Transaction ID',
}

export const WalletAddress: Story = {
  args: {
    textToCopy: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    children: 'コピー',
    successMessage: '✓ 完了',
    resetDelay: 2000,
  },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: 'IBM Plex Sans JP, sans-serif',
      }}
    >
      <span
        style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          wordBreak: 'break-all',
          maxWidth: '200px',
        }}
      >
        {args.textToCopy}
      </span>
      <CopyButton {...args} />
    </div>
  ),
  name: 'Wallet Address',
}

export const BlockHash: Story = {
  args: {
    textToCopy:
      '00000000000000000007316856900e76b4f7a9139cfbfba89842c8d196cd5f91',
    children: 'Hash',
    successMessage: 'Copied',
    resetDelay: 2000,
  },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: 'IBM Plex Sans JP, sans-serif',
      }}
    >
      <span
        style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          marginRight: '0.5rem',
        }}
      >
        Block Hash:
      </span>
      <span
        style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.8rem',
          color: 'var(--text-primary)',
          wordBreak: 'break-all',
          maxWidth: '150px',
        }}
      >
        {args.textToCopy?.slice(0, 16)}...
      </span>
      <CopyButton {...args} />
    </div>
  ),
  name: 'Block Hash',
}

// =================================================================
// DIFFERENT CONTENT TYPES
// =================================================================

export const EmailAddress: Story = {
  args: {
    textToCopy: 'user@example.com',
    children: 'メール',
    successMessage: 'メールアドレスをコピー',
    resetDelay: 2500,
  },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: 'IBM Plex Sans JP, sans-serif',
      }}
    >
      <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
        📧 {args.textToCopy}
      </span>
      <CopyButton {...args} />
    </div>
  ),
  name: 'Email Address',
}

export const PhoneNumber: Story = {
  args: {
    textToCopy: '+81-3-1234-5678',
    children: '電話',
    successMessage: '番号コピー済',
    resetDelay: 2000,
  },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: 'IBM Plex Sans JP, sans-serif',
      }}
    >
      <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
        📞 {args.textToCopy}
      </span>
      <CopyButton {...args} />
    </div>
  ),
  name: 'Phone Number',
}

export const ShareableUrl: Story = {
  args: {
    textToCopy: 'https://event.bitconin.aoki.app3',
    children: 'URL',
    successMessage: 'リンクコピー済',
    resetDelay: 2000,
  },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: 'IBM Plex Sans JP, sans-serif',
        maxWidth: '300px',
      }}
    >
      <span
        style={{
          fontSize: '0.9rem',
          color: 'var(--text-primary)',
          wordBreak: 'break-all',
          flex: 1,
        }}
      >
        🔗 {args.textToCopy}
      </span>
      <CopyButton {...args} />
    </div>
  ),
  name: 'Shareable URL',
}

// =================================================================
// INTERACTIVE STORIES
// =================================================================

export const WithCallbacks: Story = {
  args: {
    textToCopy: 'Text with callbacks',
    children: 'コピー',
    successMessage: 'Success!',
    resetDelay: 2000,
    onCopySuccess: (text: string) => console.log('Successfully copied:', text),
    onCopyError: (error: Error) => console.error('Copy failed:', error),
  },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center',
      }}
    >
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Check console for callback logs
      </p>
      <CopyButton {...args} />
    </div>
  ),
  name: 'With Callbacks',
}

export const MultipleButtons: Story = {
  render: () => {
    const items = [
      { label: 'Transaction 1', value: '0x1234567890abcdef' },
      { label: 'Transaction 2', value: '0xfedcba0987654321' },
      { label: 'Transaction 3', value: '0x1111222233334444' },
    ]

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3
          style={{
            fontFamily: 'IBM Plex Sans JP',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          Multiple Copy Buttons
        </h3>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.5rem',
              border: '1px solid var(--premium-border)',
              borderRadius: '8px',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                {item.label}
              </div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  fontFamily: 'IBM Plex Mono, monospace',
                }}
              >
                {item.value}
              </div>
            </div>
            <CopyButton
              textToCopy={item.value}
              successMessage={`${item.label} コピー済`}
              resetDelay={2000}
            >
              コピー
            </CopyButton>
          </div>
        ))}
      </div>
    )
  },
  name: 'Multiple Buttons',
}

export const InteractiveDemo: Story = {
  render: () => {
    const [customText, setCustomText] = React.useState('Enter text to copy...')
    const [successMessage, setSuccessMessage] = React.useState('コピー済')
    const [resetDelay, setResetDelay] = React.useState(2000)

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
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

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            width: '100%',
          }}
        >
          <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            Text to Copy:
          </label>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid var(--premium-border)',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              resize: 'vertical',
              minHeight: '60px',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              Success Message:
            </label>
            <input
              value={successMessage}
              onChange={(e) => setSuccessMessage(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid var(--premium-border)',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                marginTop: '0.25rem',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              Reset Delay (ms):
            </label>
            <input
              type="number"
              value={resetDelay}
              onChange={(e) => setResetDelay(Number(e.target.value))}
              min="500"
              max="5000"
              step="500"
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid var(--premium-border)',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                marginTop: '0.25rem',
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem',
            border: '1px solid var(--premium-border)',
            borderRadius: '8px',
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              wordBreak: 'break-all',
              maxWidth: '200px',
            }}
          >
            {customText.length > 30
              ? `${customText.slice(0, 30)}...`
              : customText}
          </span>
          <CopyButton
            textToCopy={customText}
            successMessage={successMessage}
            resetDelay={resetDelay}
            onCopySuccess={(text) => console.log('Copied:', text)}
          >
            コピー
          </CopyButton>
        </div>
      </div>
    )
  },
  name: 'Interactive Demo',
}

// =================================================================
// SHOWCASE STORY
// =================================================================

export const AllCopyButtonsShowcase: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        minWidth: '400px',
      }}
    >
      <h3
        style={{
          fontFamily: 'IBM Plex Sans JP',
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        Basic Copy Button
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>Simple text copy</span>
        <CopyButton textToCopy="Hello, World!">コピー</CopyButton>
      </div>

      <h3
        style={{
          fontFamily: 'IBM Plex Sans JP',
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        Blockchain Data
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.8rem',
            }}
          >
            TX: 0x7f83b1657ff1fc...
          </span>
          <CopyButton textToCopy="0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069">
            コピー
          </CopyButton>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.8rem',
            }}
          >
            Address: bc1qxy2kgdygjrsqtzq2n0yrf...
          </span>
          <CopyButton textToCopy="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh">
            コピー
          </CopyButton>
        </div>
      </div>

      <h3
        style={{
          fontFamily: 'IBM Plex Sans JP',
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        Contact Information
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📧 contact@example.com</span>
          <CopyButton
            textToCopy="contact@example.com"
            successMessage="メールコピー済"
          >
            メール
          </CopyButton>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📞 +81-3-1234-5678</span>
          <CopyButton
            textToCopy="+81-3-1234-5678"
            successMessage="電話番号コピー済"
          >
            電話
          </CopyButton>
        </div>
      </div>
    </div>
  ),
  name: 'All CopyButtons (Showcase)',
}
