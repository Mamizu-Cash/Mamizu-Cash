import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Text } from '../components/ui/Text/Text'

// =================================================================
// STORYBOOK META & STORIES - Text (Typography Component)
// =================================================================
const meta: Meta<typeof Text> = {
  title: 'Primitives/Text',
  component: Text,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: { type: 'select' },
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'span',
        'div',
        'label',
        'caption',
        'code',
        'pre',
      ],
    },
    variant: {
      control: { type: 'select' },
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'body',
        'bodyLarge',
        'bodySmall',
        'label',
        'labelSmall',
        'caption',
        'mono',
        'monoLarge',
        'monoSmall',
      ],
    },
    color: {
      control: { type: 'select' },
      options: [
        'primary',
        'secondary',
        'tertiary',
        'accent',
        'brand',
        'info',
        'success',
        'warning',
        'error',
        'white',
      ],
    },
    weight: {
      control: { type: 'select' },
      options: ['light', 'normal', 'medium', 'semibold', 'bold'],
    },
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right', 'justify'],
    },
    decoration: {
      control: { type: 'select' },
      options: ['underline', 'lineThrough', 'noDecoration'],
    },
    transform: {
      control: { type: 'select' },
      options: ['uppercase', 'lowercase', 'capitalize'],
    },
    effect: {
      control: { type: 'select' },
      options: ['embossed', 'embossedStrong', 'glowing'],
    },
    truncate: {
      control: { type: 'select' },
      options: [false, true, 2, 3],
    },
    children: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// =================================================================
// BASIC TEXT STORIES
// =================================================================

export const Default: Story = {
  args: {
    children: 'Default text paragraph',
    as: 'p',
    variant: 'body',
    color: 'primary',
  },
}

export const Heading: Story = {
  args: {
    children: 'Main Heading',
    as: 'h1',
    variant: 'h1',
    color: 'primary',
  },
}

export const Label: Story = {
  args: {
    children: 'Form Label',
    as: 'label',
    variant: 'label',
    color: 'primary',
  },
}

export const Monospace: Story = {
  args: {
    children:
      '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    as: 'code',
    variant: 'mono',
    color: 'secondary',
  },
}

// =================================================================
// TYPOGRAPHY SCALE
// =================================================================

export const TypographyScale: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minWidth: '500px',
      }}
    >
      <Text as="h1" variant="h1">
        Heading 1 - Main Title
      </Text>
      <Text as="h2" variant="h2">
        Heading 2 - Section Title
      </Text>
      <Text as="h3" variant="h3">
        Heading 3 - Subsection
      </Text>
      <Text as="h4" variant="h4">
        Heading 4 - Component Title
      </Text>
      <Text as="h5" variant="h5">
        Heading 5 - Small Title
      </Text>
      <Text as="h6" variant="h6">
        Heading 6 - Micro Title
      </Text>
      <Text variant="bodyLarge">Body Large - Introductory paragraph text</Text>
      <Text variant="body">
        Body - Regular paragraph text for general content
      </Text>
      <Text variant="bodySmall">
        Body Small - Supporting text and descriptions
      </Text>
      <Text variant="label">Label - Form labels and UI text</Text>
      <Text variant="labelSmall">Label Small - Compact UI text</Text>
      <Text variant="caption">Caption - Fine print and metadata</Text>
    </div>
  ),
  name: 'Typography Scale',
}

// =================================================================
// COLOR VARIANTS
// =================================================================

export const Colors: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        minWidth: '400px',
      }}
    >
      <Text color="primary">Primary text color (default)</Text>
      <Text color="secondary">Secondary text color</Text>
      <Text color="tertiary">Tertiary text color</Text>
      <Text color="accent">Accent text color (pink)</Text>
      <Text color="brand">Brand text color (bitcoin orange)</Text>
      <Text color="info">Info text color (blue)</Text>
      <Text color="success">Success text color</Text>
      <Text color="warning">Warning text color</Text>
      <Text color="error">Error text color</Text>
      <div
        style={{ background: '#374151', padding: '1rem', borderRadius: '8px' }}
      >
        <Text color="white">White text color (on dark background)</Text>
      </div>
    </div>
  ),
  name: 'Colors',
}

// =================================================================
// FONT WEIGHTS
// =================================================================

export const FontWeights: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        minWidth: '400px',
      }}
    >
      <Text weight="light">Light font weight (300)</Text>
      <Text weight="normal">Normal font weight (400)</Text>
      <Text weight="medium">Medium font weight (500)</Text>
      <Text weight="semibold">Semibold font weight (600)</Text>
      <Text weight="bold">Bold font weight (700)</Text>
    </div>
  ),
  name: 'Font Weights',
}

// =================================================================
// ALIGNMENT OPTIONS
// =================================================================

export const Alignment: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '400px',
      }}
    >
      <Text align="left">
        Left aligned text - This is aligned to the left side of the container.
      </Text>
      <Text align="center">
        Center aligned text - This text is centered in the container.
      </Text>
      <Text align="right">
        Right aligned text - This is aligned to the right side of the container.
      </Text>
      <Text align="justify">
        Justify aligned text - This text is justified to stretch across the full
        width of the container, creating even margins on both sides.
      </Text>
    </div>
  ),
  name: 'Alignment',
}

// =================================================================
// TEXT DECORATIONS
// =================================================================

export const Decorations: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        minWidth: '300px',
      }}
    >
      <Text>Normal text without decoration</Text>
      <Text decoration="underline">Underlined text</Text>
      <Text decoration="lineThrough">Line-through text</Text>
      <Text decoration="noDecoration">Text with no decoration (explicit)</Text>
    </div>
  ),
  name: 'Decorations',
}

// =================================================================
// TEXT TRANSFORMATIONS
// =================================================================

export const Transformations: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        minWidth: '300px',
      }}
    >
      <Text>Normal case text</Text>
      <Text transform="uppercase">Uppercase text transformation</Text>
      <Text transform="lowercase">LOWERCASE TEXT TRANSFORMATION</Text>
      <Text transform="capitalize">
        capitalize each word text transformation
      </Text>
    </div>
  ),
  name: 'Transformations',
}

// =================================================================
// SPECIAL EFFECTS (from design-26)
// =================================================================

export const Effects: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minWidth: '400px',
      }}
    >
      <Text>Normal text without effects</Text>
      <Text effect="embossed">Embossed text effect (subtle)</Text>
      <Text effect="embossedStrong" variant="h3">
        Strong embossed effect (headlines)
      </Text>
      <Text effect="glowing" color="brand">
        Glowing brand text
      </Text>
      <Text effect="glowing" color="accent">
        Glowing accent text
      </Text>
      <Text effect="glowing" color="info">
        Glowing info text
      </Text>
    </div>
  ),
  name: 'Effects (from design-26)',
}

// =================================================================
// MONOSPACE VARIANTS
// =================================================================

export const MonospaceVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minWidth: '500px',
      }}
    >
      <div>
        <Text variant="label" color="secondary">
          Transaction ID (Large)
        </Text>
        <Text as="code" variant="monoLarge" color="primary">
          0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
        </Text>
      </div>
      <div>
        <Text variant="label" color="secondary">
          Wallet Address (Medium)
        </Text>
        <Text as="code" variant="mono" color="primary">
          bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
        </Text>
      </div>
      <div>
        <Text variant="label" color="secondary">
          Block Hash (Small)
        </Text>
        <Text as="code" variant="monoSmall" color="secondary">
          00000000000000000007316856900e76b4f7a9139cfbfba89842c8d196cd5f91
        </Text>
      </div>
      <div>
        <Text variant="label" color="secondary">
          Timestamp
        </Text>
        <Text as="code" variant="mono" color="info">
          2024.03.14 15:30:42
        </Text>
      </div>
    </div>
  ),
  name: 'Monospace Variants',
}

// =================================================================
// TRUNCATION OPTIONS
// =================================================================

export const Truncation: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '300px',
      }}
    >
      <div>
        <Text variant="labelSmall" color="secondary">
          Single Line Truncation
        </Text>
        <Text truncate>
          This is a very long text that should be truncated with an ellipsis
          when it exceeds the container width.
        </Text>
      </div>
      <div>
        <Text variant="labelSmall" color="secondary">
          Two Line Clamp
        </Text>
        <Text truncate={2}>
          This is a longer text that should be clamped to exactly two lines. The
          text will wrap to the second line and then be truncated with an
          ellipsis if it's still too long to fit.
        </Text>
      </div>
      <div>
        <Text variant="labelSmall" color="secondary">
          Three Line Clamp
        </Text>
        <Text truncate={3}>
          This is an even longer text that should be clamped to exactly three
          lines. The text will wrap to multiple lines as needed, but will be
          truncated after the third line if there's still more content that
          doesn't fit within the container.
        </Text>
      </div>
    </div>
  ),
  name: 'Truncation',
}

// =================================================================
// MOCKUP USE CASES
// =================================================================

export const BrandingText: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        alignItems: 'center',
      }}
    >
      <Text as="h1" variant="h1" color="primary" effect="embossedStrong">
        ₿ ビット婚姻
      </Text>
      <Text variant="h3" color="secondary">
        証人参加
      </Text>
      <Text variant="body" color="secondary" align="center">
        QRコードをスキャンして
        <br />
        二人の永遠の証人になってください
      </Text>
    </div>
  ),
  name: 'Branding Text (from mockup)',
}

export const CeremonyInfo: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minWidth: '300px',
      }}
    >
      <Text as="h2" variant="h2" color="primary" align="center">
        誓いの瞬間
      </Text>
      <Text
        variant="labelSmall"
        color="brand"
        transform="uppercase"
        align="center"
      >
        STEP 2
      </Text>
      <Text variant="body" color="secondary" align="center">
        署名を見守っています...
      </Text>
    </div>
  ),
  name: 'Ceremony Info (from mockup)',
}

export const BlockchainInfo: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minWidth: '400px',
      }}
    >
      <Text as="h3" variant="h3" color="success">
        永遠の記録完成
      </Text>
      <Text variant="body" color="secondary">
        ブロックチェーンに愛の証明が刻まれました
      </Text>

      <div style={{ marginTop: '1rem' }}>
        <Text variant="label" color="secondary">
          トランザクションID
        </Text>
        <Text as="code" variant="mono" color="primary" truncate>
          0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
        </Text>
      </div>

      <div>
        <Text variant="label" color="secondary">
          記録日時
        </Text>
        <Text as="code" variant="mono" color="info">
          2024/03/14 15:30:42
        </Text>
      </div>

      <div>
        <Text variant="label" color="secondary">
          ネットワーク
        </Text>
        <Text variant="body" color="primary">
          Bitcoin Testnet
        </Text>
      </div>
    </div>
  ),
  name: 'Blockchain Info (from mockup)',
}

export const FormLabels: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        minWidth: '300px',
      }}
    >
      <div>
        <Text as="label" variant="label" color="primary">
          ニックネーム（任意）
        </Text>
      </div>

      <div>
        <Text as="label" variant="label" color="primary">
          利用規約およびプライバシーポリシーに同意します
          <Text as="span" color="error">
            *
          </Text>
        </Text>
      </div>

      <div>
        <Text variant="labelSmall" color="secondary">
          この瞬間にリアクションを送りましょう
        </Text>
      </div>

      <div>
        <Text variant="caption" color="tertiary">
          最大50文字まで入力できます
        </Text>
      </div>
    </div>
  ),
  name: 'Form Labels (from mockup)',
}

// =================================================================
// INTERACTIVE DEMO
// =================================================================

export const InteractiveDemo: Story = {
  render: () => {
    const [variant, setVariant] = React.useState<any>('body')
    const [color, setColor] = React.useState<any>('primary')
    const [weight, setWeight] = React.useState<any>('normal')
    const [effect, setEffect] = React.useState<any>('')

    const sampleText = 'この文章でタイポグラフィの設定をテストできます'

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          minWidth: '400px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
          }}
        >
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
              onChange={(e) => setVariant(e.target.value)}
              style={{
                width: '100%',
                padding: '0.25rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            >
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
              <option value="body">Body</option>
              <option value="bodyLarge">Body Large</option>
              <option value="bodySmall">Body Small</option>
              <option value="label">Label</option>
              <option value="caption">Caption</option>
              <option value="mono">Mono</option>
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
              Color:
            </label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                width: '100%',
                padding: '0.25rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="accent">Accent</option>
              <option value="brand">Brand</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
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
              Weight:
            </label>
            <select
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              style={{
                width: '100%',
                padding: '0.25rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            >
              <option value="">Default</option>
              <option value="light">Light</option>
              <option value="normal">Normal</option>
              <option value="medium">Medium</option>
              <option value="semibold">Semibold</option>
              <option value="bold">Bold</option>
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
              Effect:
            </label>
            <select
              value={effect}
              onChange={(e) => setEffect(e.target.value)}
              style={{
                width: '100%',
                padding: '0.25rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            >
              <option value="">None</option>
              <option value="embossed">Embossed</option>
              <option value="embossedStrong">Embossed Strong</option>
              <option value="glowing">Glowing</option>
            </select>
          </div>
        </div>

        <div
          style={{
            padding: '2rem',
            border: '1px solid var(--premium-border)',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <Text
            variant={variant}
            color={color}
            weight={weight || undefined}
            effect={effect || undefined}
          >
            {sampleText}
          </Text>
        </div>
      </div>
    )
  },
  name: 'Interactive Demo',
}

// =================================================================
// SHOWCASE STORY
// =================================================================

export const AllTextShowcase: Story = {
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
        <Text as="h2" variant="h2" color="primary">
          Typography Hierarchy
        </Text>
        <Text variant="bodySmall" color="secondary">
          Complete text component system
        </Text>
      </div>

      <div>
        <Text as="h3" variant="h3" color="secondary">
          Headings
        </Text>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <Text as="h1" variant="h1">
            Main Title (H1)
          </Text>
          <Text as="h2" variant="h2">
            Section (H2)
          </Text>
          <Text as="h3" variant="h3">
            Subsection (H3)
          </Text>
          <Text as="h4" variant="h4">
            Component (H4)
          </Text>
        </div>
      </div>

      <div>
        <Text as="h3" variant="h3" color="secondary">
          Body Text
        </Text>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <Text variant="bodyLarge">Large body text for introductions</Text>
          <Text variant="body">Regular body text for content</Text>
          <Text variant="bodySmall">Small body text for details</Text>
        </div>
      </div>

      <div>
        <Text as="h3" variant="h3" color="secondary">
          Colors & Effects
        </Text>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <Text color="brand" effect="glowing">
            Brand color with glow
          </Text>
          <Text color="accent" weight="semibold">
            Accent color semibold
          </Text>
          <Text color="info">Info color text</Text>
          <Text color="success">Success message</Text>
          <Text color="error">Error message</Text>
        </div>
      </div>

      <div>
        <Text as="h3" variant="h3" color="secondary">
          Monospace (Technical)
        </Text>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <Text as="code" variant="mono" color="secondary">
            0x7f83b1657ff1fc...
          </Text>
          <Text as="code" variant="monoSmall" color="tertiary">
            2024.03.14 15:30:42
          </Text>
          <Text as="code" variant="monoLarge" color="brand">
            Bitcoin Testnet
          </Text>
        </div>
      </div>
    </div>
  ),
  name: 'All Text (Showcase)',
}
