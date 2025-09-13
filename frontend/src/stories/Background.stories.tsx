import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Background } from '../components/ui/Background/Background'
import Panel from '../components/ui/Panel/Panel'

// =================================================================
// STORYBOOK META & STORIES - Background (Animated Ceremonial Background)
// =================================================================
const meta: Meta<typeof Background> = {
  title: 'Primitives/Background',
  component: Background,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Background>

export const Default: Story = {
  render: () => <Background />,
}

export const WithBox: Story = {
  render: () => (
    <div
      style={{
        position: 'relative',
        width: 400,
        height: 300,
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
        border: '1px solid #eee',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Background />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          fontFamily: 'IBM Plex Sans JP, sans-serif',
          fontSize: '2rem',
          color: 'rgba(47, 79, 79, 0.3)',
          fontWeight: 300,
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        Ceremonial Background
        <br />
        <small style={{ fontSize: '0.5em' }}>Background Only</small>
      </div>
    </div>
  ),
}

export const WithPanel: Story = {
  render: () => (
    <Panel>
      <Background />
    </Panel>
  ),
}
