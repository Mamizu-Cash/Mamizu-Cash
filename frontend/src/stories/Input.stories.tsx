import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Input } from '../components/ui/Input/Input'

// =================================================================
// STORYBOOK META & STORIES - Input (Primitive Form Component)
// =================================================================
const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'accent'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    state: {
      control: { type: 'select' },
      options: ['default', 'error', 'success'],
    },
    fullWidth: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
    value: {
      control: 'text',
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// =================================================================
// BASIC INPUT STORIES
// =================================================================

export const Default: Story = {
  args: {
    placeholder: 'Enter text here...',
    variant: 'primary',
    size: 'medium',
    state: 'default',
    fullWidth: true,
  },
}

export const WithValue: Story = {
  args: {
    value: 'Sample input text',
    placeholder: 'Enter text here...',
    variant: 'primary',
    size: 'medium',
    state: 'default',
  },
}

export const Disabled: Story = {
  args: {
    value: 'Disabled input',
    disabled: true,
    variant: 'primary',
    size: 'medium',
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
        flexDirection: 'column',
        gap: '1rem',
        minWidth: '300px',
      }}
    >
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          Primary (Blue)
        </label>
        <Input variant="primary" placeholder="Primary input (blue focus)" />
      </div>
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          Secondary (Bitcoin Orange)
        </label>
        <Input
          variant="secondary"
          placeholder="Secondary input (orange focus)"
        />
      </div>
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          Accent (Pink)
        </label>
        <Input variant="accent" placeholder="Accent input (pink focus)" />
      </div>
    </div>
  ),
  name: 'Variants',
}

// =================================================================
// SIZE STORIES
// =================================================================

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minWidth: '300px',
      }}
    >
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.8rem',
            fontWeight: '500',
          }}
        >
          Small
        </label>
        <Input size="small" placeholder="Small input field" />
      </div>
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          Medium (Default)
        </label>
        <Input size="medium" placeholder="Medium input field" />
      </div>
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '1rem',
            fontWeight: '500',
          }}
        >
          Large
        </label>
        <Input size="large" placeholder="Large input field" />
      </div>
    </div>
  ),
  name: 'Sizes',
}

// =================================================================
// STATE STORIES
// =================================================================

export const States: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minWidth: '300px',
      }}
    >
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          Default State
        </label>
        <Input state="default" placeholder="Default input state" />
      </div>
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
            color: '#dc2626',
          }}
        >
          Error State
        </label>
        <Input state="error" value="Invalid input" />
        <p
          style={{ fontSize: '0.8rem', color: '#dc2626', marginTop: '0.25rem' }}
        >
          This field is required
        </p>
      </div>
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
            color: '#10b981',
          }}
        >
          Success State
        </label>
        <Input state="success" value="Valid input" />
        <p
          style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.25rem' }}
        >
          ✓ Input is valid
        </p>
      </div>
    </div>
  ),
  name: 'States',
}

// =================================================================
// INPUT TYPES (from mockups)
// =================================================================

export const InputTypes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minWidth: '300px',
      }}
    >
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          Text Input
        </label>
        <Input type="text" placeholder="Enter your name" />
      </div>
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          Email Input
        </label>
        <Input type="email" placeholder="example@email.com" />
      </div>
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          Password Input
        </label>
        <Input type="password" placeholder="Enter password" />
      </div>
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          Number Input
        </label>
        <Input type="number" placeholder="Enter amount" />
      </div>
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          Phone Input
        </label>
        <Input type="tel" placeholder="+81-90-1234-5678" />
      </div>
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          URL Input
        </label>
        <Input type="url" placeholder="https://example.com" />
      </div>
    </div>
  ),
  name: 'Input Types',
}

// =================================================================
// FORM USE CASES (from mockups)
// =================================================================

export const WitnessNicknameInput: Story = {
  args: {
    type: 'text',
    placeholder: 'お好きな名前を入力してください',
    maxLength: 20,
    variant: 'primary',
  },
  render: (args) => (
    <div style={{ minWidth: '300px' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.9rem',
          fontWeight: '500',
          fontFamily: 'IBM Plex Sans JP, sans-serif',
        }}
      >
        ニックネーム（任意）
      </label>
      <Input {...args} />
    </div>
  ),
  name: 'Witness Nickname (from mockup)',
}

export const MarqueeMessageInput: Story = {
  args: {
    type: 'text',
    placeholder: '祝福メッセージを入力してください...',
    maxLength: 50,
    variant: 'accent',
  },
  render: (args) => (
    <div style={{ minWidth: '350px' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.9rem',
          fontWeight: '500',
          fontFamily: 'IBM Plex Sans JP, sans-serif',
        }}
      >
        祝福メッセージ
      </label>
      <Input {...args} />
      <p
        style={{
          fontSize: '0.8rem',
          color: 'var(--text-tertiary)',
          marginTop: '0.25rem',
          textAlign: 'right',
        }}
      >
        最大50文字
      </p>
    </div>
  ),
  name: 'Marquee Message (from mockup)',
}

export const BlockchainDataInput: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minWidth: '400px',
      }}
    >
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          Transaction ID
        </label>
        <Input
          type="text"
          placeholder="0x..."
          variant="secondary"
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        />
      </div>
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          Wallet Address
        </label>
        <Input
          type="text"
          placeholder="bc1q..."
          variant="secondary"
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        />
      </div>
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          Private Key
        </label>
        <Input
          type="password"
          placeholder="Enter private key"
          variant="secondary"
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        />
      </div>
    </div>
  ),
  name: 'Blockchain Data Inputs',
}

// =================================================================
// INTERACTIVE STORIES
// =================================================================

export const ControlledInput: Story = {
  render: () => {
    const [value, setValue] = React.useState('')
    const [variant, setVariant] = React.useState<
      'primary' | 'secondary' | 'accent'
    >('primary')
    const [size, setSize] = React.useState<'small' | 'medium' | 'large'>(
      'medium',
    )

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          minWidth: '300px',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '0.25rem',
                fontSize: '0.8rem',
              }}
            >
              Variant:
            </label>
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value as any)}
              style={{
                padding: '0.25rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="accent">Accent</option>
            </select>
          </div>
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '0.25rem',
                fontSize: '0.8rem',
              }}
            >
              Size:
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as any)}
              style={{
                padding: '0.25rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>

        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            Live Input Demo
          </label>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type something..."
            variant={variant}
            size={size}
          />
        </div>

        <div
          style={{
            padding: '0.75rem',
            background: '#f8f9fa',
            borderRadius: '8px',
            fontSize: '0.9rem',
          }}
        >
          <strong>Current value:</strong> {value || '(empty)'}
        </div>
      </div>
    )
  },
  name: 'Controlled Input Demo',
}

export const ValidationDemo: Story = {
  render: () => {
    const [email, setEmail] = React.useState('')
    const [nickname, setNickname] = React.useState('')

    const emailValid = email.includes('@') && email.includes('.')
    const nicknameValid = nickname.length >= 2 && nickname.length <= 20

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          minWidth: '300px',
        }}
      >
        <h3 style={{ margin: 0, fontFamily: 'IBM Plex Sans JP' }}>
          Form Validation Demo
        </h3>

        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            Email Address
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            state={email ? (emailValid ? 'success' : 'error') : 'default'}
            variant="primary"
          />
          {email && !emailValid && (
            <p
              style={{
                fontSize: '0.8rem',
                color: '#dc2626',
                marginTop: '0.25rem',
              }}
            >
              Please enter a valid email address
            </p>
          )}
          {email && emailValid && (
            <p
              style={{
                fontSize: '0.8rem',
                color: '#10b981',
                marginTop: '0.25rem',
              }}
            >
              ✓ Email is valid
            </p>
          )}
        </div>

        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            Nickname (2-20 characters)
          </label>
          <Input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="お好きな名前を入力してください"
            state={nickname ? (nicknameValid ? 'success' : 'error') : 'default'}
            variant="accent"
            maxLength={25}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '0.25rem',
            }}
          >
            {nickname && !nicknameValid && (
              <p style={{ fontSize: '0.8rem', color: '#dc2626' }}>
                {nickname.length < 2
                  ? 'Too short (min 2 chars)'
                  : 'Too long (max 20 chars)'}
              </p>
            )}
            {nickname && nicknameValid && (
              <p style={{ fontSize: '0.8rem', color: '#10b981' }}>
                ✓ Nickname is valid
              </p>
            )}
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              {nickname.length}/20
            </span>
          </div>
        </div>
      </div>
    )
  },
  name: 'Validation Demo',
}

// =================================================================
// SHOWCASE STORY
// =================================================================

export const AllInputsShowcase: Story = {
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
        Input Variants
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input variant="primary" placeholder="Primary input (blue focus)" />
        <Input
          variant="secondary"
          placeholder="Secondary input (orange focus)"
        />
        <Input variant="accent" placeholder="Accent input (pink focus)" />
      </div>

      <h3
        style={{
          fontFamily: 'IBM Plex Sans JP',
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        Input Sizes
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input size="small" placeholder="Small input" />
        <Input size="medium" placeholder="Medium input" />
        <Input size="large" placeholder="Large input" />
      </div>

      <h3
        style={{
          fontFamily: 'IBM Plex Sans JP',
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        Input States
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input placeholder="Default state" />
        <Input state="error" value="Error state" />
        <Input state="success" value="Success state" />
        <Input disabled value="Disabled state" />
      </div>

      <h3
        style={{
          fontFamily: 'IBM Plex Sans JP',
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        Common Use Cases
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input
          type="text"
          placeholder="お好きな名前を入力してください"
          maxLength={20}
        />
        <Input type="email" placeholder="example@email.com" variant="primary" />
        <Input
          type="password"
          placeholder="パスワードを入力"
          variant="primary"
        />
        <Input
          type="text"
          placeholder="祝福メッセージを入力してください..."
          variant="accent"
          maxLength={50}
        />
      </div>
    </div>
  ),
  name: 'All Inputs (Showcase)',
}
