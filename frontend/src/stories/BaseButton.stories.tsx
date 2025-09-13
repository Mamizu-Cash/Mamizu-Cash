import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { BaseButton } from '../components/ui'

// =================================================================
// STORYBOOK META & STORIES - BaseButton (Foundational Component)
// =================================================================
const meta: Meta<typeof BaseButton> = {
  title: 'Primitives/BaseButton',
  component: BaseButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    variant: {
      control: 'text',
    },
    children: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// =================================================================
// BASIC STORIES
// =================================================================

export const Default: Story = {
  args: {
    children: 'Base Button',
    loading: false,
    disabled: false,
  },
}

export const Loading: Story = {
  args: {
    children: 'Loading...',
    loading: true,
    disabled: false,
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    loading: false,
    disabled: true,
  },
}

export const WithCustomClass: Story = {
  args: {
    children: 'Custom Styled',
    className: 'custom-button',
    loading: false,
    disabled: false,
  },
  render: (args) => (
    <div>
      <style>{`
        .custom-button {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .custom-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .custom-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
      <BaseButton {...args} />
    </div>
  ),
}

// =================================================================
// INTERACTION STORIES
// =================================================================

export const WithClickHandler: Story = {
  args: {
    children: 'Click Me',
    loading: false,
    disabled: false,
    onClick: () => alert('BaseButton clicked!'),
  },
}

export const InteractiveDemo: Story = {
  render: () => {
    const [loading, setLoading] = React.useState(false)
    const [disabled, setDisabled] = React.useState(false)

    const handleClick = () => {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        alert('Action completed!')
      }, 2000)
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
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label>
            <input
              type="checkbox"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
            />
            Disabled
          </label>
        </div>

        <BaseButton
          onClick={handleClick}
          loading={loading}
          disabled={disabled}
          style={{
            background: loading
              ? 'linear-gradient(135deg, #f59e0b, #d97706)'
              : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '500',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            transition: 'all 0.2s',
          }}
        >
          {loading ? 'Processing...' : 'Click for Demo'}
        </BaseButton>
      </div>
    )
  },
  name: 'Interactive Demo',
}

// =================================================================
// FOUNDATION EXAMPLES
// =================================================================

export const AsFormButton: Story = {
  args: {
    children: 'Submit',
    type: 'submit',
    loading: false,
    disabled: false,
  },
  render: (args) => (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        alert('Form submitted!')
      }}
    >
      <BaseButton
        {...args}
        style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '500',
          cursor: 'pointer',
        }}
      />
    </form>
  ),
}

export const WithAriaLabel: Story = {
  args: {
    children: '❤️',
    'aria-label': 'Like this item',
    loading: false,
    disabled: false,
  },
  render: (args) => (
    <BaseButton
      {...args}
      style={{
        background: 'transparent',
        border: '2px solid #e5e7eb',
        borderRadius: '50%',
        width: '3rem',
        height: '3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    />
  ),
}
