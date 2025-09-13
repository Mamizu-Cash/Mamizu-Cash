import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Carousel, Panel } from "../components/ui";

// =================================================================
// STORYBOOK META & STORIES - Carousel Component (Panel Composition)
// =================================================================
const meta: Meta<typeof Carousel> = {
  title: "Components/Carousel",
  component: Carousel,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Carousel component for rotating content display with flexible children API. **Designed to be used WITH Panel component** for visual styling.

**Key Features:**
- Children-based API supporting both structured Template and free-form ReactNode content
- Auto-play functionality (5s interval, 10s pause after user interaction)
- Transparent design (combine with Panel for visual effects)
- Arrow navigation with IconButton integration
- Responsive and accessible
- Smooth transitions inspired by design-26-production-ready.html

**Recommended Usage Pattern:**
\`\`\`jsx
<Panel size="medium">
  <Carousel showArrows showIndicators>
    <Carousel.Template icon="🔒" title="Security">
      Blockchain provides immutable records
    </Carousel.Template>
    <Carousel.Template icon="🌍" title="Global">
      Accessible from anywhere in the world
    </Carousel.Template>
  </Carousel>
</Panel>
\`\`\`

**Template Usage:**
\`\`\`jsx
<Carousel.Template icon="🔒" title="Security">
  Description content goes here
</Carousel.Template>
\`\`\`

**Custom Content:**
\`\`\`jsx
<Carousel>
  <div>Custom slide 1</div>
  <CustomComponent />
  <p>Any React content works</p>
</Carousel>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: false,
      description:
        "Array of ReactNode children - supports both Carousel.Template and any JSX content",
    },
    autoPlay: {
      control: "boolean",
      description: "Enable/disable auto-play functionality",
    },
    autoPlayInterval: {
      control: { type: "number", min: 1000, max: 10000, step: 500 },
      description: "Auto-play interval in milliseconds",
    },
    pauseOnInteraction: {
      control: { type: "number", min: 5000, max: 30000, step: 1000 },
      description: "Pause duration after user interaction",
    },
    showIndicators: {
      control: "boolean",
      description: "Show/hide navigation indicators",
    },
    showArrows: {
      control: "boolean",
      description: "Show/hide arrow navigation buttons",
    },
    variant: {
      control: { type: "select" },
      options: ["default", "tech", "minimal"],
      description: "Visual variant of the carousel",
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "Size variant matching Panel sizes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =================================================================
// BASIC STORIES - Panel + Carousel Composition
// =================================================================

export const Default: Story = {
  render: (args) => (
    <div style={{ width: "600px", margin: "0 auto" }}>
      <Panel size="medium">
        <Carousel {...args}>
          <Carousel.Template icon="🔒" title="世界最高の安全性">
            ブロックチェーンで永久保存・改ざん不可能
          </Carousel.Template>
          <Carousel.Template icon="🌍" title="世界中から検証可能">
            いつでもどこからでも記録の真正性を確認
          </Carousel.Template>
          <Carousel.Template icon="💎" title="伝統と革新の融合">
            古からの結婚の誓いを最新技術で永遠に
          </Carousel.Template>
        </Carousel>
      </Panel>
    </div>
  ),
  args: {
    autoPlay: true,
    autoPlayInterval: 5000,
    pauseOnInteraction: 10000,
    showIndicators: true,
    showArrows: false,
    variant: "default",
    size: "medium",
  },
  name: "Default (Panel + Carousel)",
};

export const WithArrows: Story = {
  render: (args) => (
    <div style={{ width: "600px", margin: "0 auto" }}>
      <Panel size="medium">
        <Carousel {...args}>
          <Carousel.Template icon="🔒" title="世界最高の安全性">
            ブロックチェーンで永久保存・改ざん不可能
          </Carousel.Template>
          <Carousel.Template icon="🌍" title="世界中から検証可能">
            いつでもどこからでも記録の真正性を確認
          </Carousel.Template>
          <Carousel.Template icon="💎" title="伝統と革新の融合">
            古からの結婚の誓いを最新技術で永遠に
          </Carousel.Template>
        </Carousel>
      </Panel>
    </div>
  ),
  args: {
    autoPlay: true,
    showIndicators: true,
    showArrows: true,
    variant: "tech",
    size: "medium",
  },
  name: "With Arrow Navigation",
  parameters: {
    docs: {
      description: {
        story:
          "Carousel with both indicators and arrow navigation. Arrows are placed in the same row as indicators.",
      },
    },
  },
};

export const TechCarousel: Story = {
  render: (args) => (
    <div style={{ width: "600px", margin: "0 auto" }}>
      <Panel size="medium">
        <Carousel {...args}>
          <Carousel.Template icon="🔒" title="世界最高の安全性">
            ブロックチェーンで永久保存・改ざん不可能
          </Carousel.Template>
          <Carousel.Template icon="🌍" title="世界中から検証可能">
            いつでもどこからでも記録の真正性を確認
          </Carousel.Template>
          <Carousel.Template icon="💎" title="伝統と革新の融合">
            古からの結婚の誓いを最新技術で永遠に
          </Carousel.Template>
        </Carousel>
      </Panel>
    </div>
  ),
  args: {
    variant: "tech",
    size: "medium",
    autoPlay: true,
    showIndicators: true,
    showArrows: true,
  },
  name: "Tech Variant (from mockup)",
  parameters: {
    docs: {
      description: {
        story:
          "Tech carousel as seen in verifier-02-ceremony.html mockup. Features blockchain technology benefits with Panel styling.",
      },
    },
  },
};

// =================================================================
// STANDALONE CAROUSEL (WITHOUT PANEL)
// =================================================================

export const StandaloneCarousel: Story = {
  render: (args) => (
    <div
      style={{
        minWidth: "420px",
        padding: "1rem",
        border: "2px dashed #e5e7eb",
        borderRadius: "8px",
        background: "#f9fafb",
      }}
    >
      <p
        style={{
          textAlign: "center",
          marginBottom: "1rem",
          fontSize: "0.9rem",
          color: "#6b7280",
          fontFamily: "IBM Plex Sans JP, sans-serif",
        }}
      >
        Carousel without Panel (transparent container)
      </p>
      <Carousel {...args}>
        <Carousel.Template icon="⚡" title="高速処理">
          透明なコンテナとして動作
        </Carousel.Template>
        <Carousel.Template icon="🎨" title="柔軟なデザイン">
          Panel との組み合わせは自由
        </Carousel.Template>
      </Carousel>
    </div>
  ),
  args: {
    autoPlay: true,
    showIndicators: true,
    showArrows: true,
    variant: "default",
    size: "medium",
  },
  name: "Standalone (without Panel)",
  parameters: {
    docs: {
      description: {
        story:
          "Carousel used without Panel component. Shows the transparent nature of the carousel container.",
      },
    },
  },
};

// =================================================================
// CUSTOM CONTENT STORIES
// =================================================================

export const CustomContent: Story = {
  render: (args) => (
    <div style={{ width: "600px", margin: "0 auto" }}>
      <Panel size="medium">
        <Carousel {...args}>
          <div style={{ textAlign: "center", padding: "1rem" }}>
            <h3
              style={{
                fontSize: "1.2rem",
                color: "#374151",
                marginBottom: "0.5rem",
                fontFamily: "IBM Plex Sans JP, sans-serif",
              }}
            >
              カスタムスライド 1
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>自由なHTMLコンテンツを配置可能</p>
          </div>
          <div
            style={{
              textAlign: "center",
              padding: "1rem",
              background: "linear-gradient(135deg, #e64980, #ff6b9d)",
              color: "white",
              borderRadius: "12px",
              margin: "0 1rem",
            }}
          >
            <h3 style={{ marginBottom: "0.5rem" }}>グラデーション背景</h3>
            <p style={{ fontSize: "0.85rem" }}>CSS スタイルも自由に適用</p>
          </div>
          <div style={{ textAlign: "center", padding: "1rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📱</div>
            <p style={{ color: "#374151" }}>アイコンとテキストの組み合わせ</p>
          </div>
        </Carousel>
      </Panel>
    </div>
  ),
  args: {
    variant: "default",
    size: "medium",
    autoPlay: true,
    showIndicators: true,
    showArrows: true,
  },
  name: "Custom ReactNode Content",
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates using regular ReactNode children instead of Template with Panel composition.",
      },
    },
  },
};

// =================================================================
// SIZE VARIANTS WITH PANEL
// =================================================================

export const SizeComparison: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        alignItems: "center",
        minWidth: "600px",
      }}
    >
      <div>
        <h3
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            fontFamily: "IBM Plex Sans JP, sans-serif",
            color: "#374151",
          }}
        >
          Small Panel + Carousel
        </h3>
        <Panel size="small">
          <Carousel size="small" variant="minimal" autoPlay={false} showArrows showIndicators>
            <Carousel.Template icon="💰" title="コスト削減">
              従来の書類手続きコストを大幅に削減
            </Carousel.Template>
            <Carousel.Template icon="⚡" title="迅速な処理">
              デジタル化により即座に記録・証明が完了
            </Carousel.Template>
          </Carousel>
        </Panel>
      </div>

      <div>
        <h3
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            fontFamily: "IBM Plex Sans JP, sans-serif",
            color: "#374151",
          }}
        >
          Medium Panel + Carousel
        </h3>
        <Panel size="medium">
          <Carousel size="medium" variant="tech" autoPlay={false} showArrows showIndicators>
            <Carousel.Template icon="🔒" title="世界最高の安全性">
              ブロックチェーンで永久保存・改ざん不可能
            </Carousel.Template>
            <Carousel.Template icon="🌍" title="世界中から検証可能">
              いつでもどこからでも記録の真正性を確認
            </Carousel.Template>
          </Carousel>
        </Panel>
      </div>

      <div>
        <h3
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            fontFamily: "IBM Plex Sans JP, sans-serif",
            color: "#374151",
          }}
        >
          Large Panel + Carousel
        </h3>
        <Panel size="large">
          <Carousel size="large" variant="default" autoPlay={false} showArrows showIndicators>
            <Carousel.Template icon="⛓️" title="不変の記録">
              ブロックチェーン技術により記録の改ざんは不可能
            </Carousel.Template>
            <Carousel.Template icon="👁️" title="完全な透明性">
              すべての証人が記録の真正性を確認可能
            </Carousel.Template>
            <Carousel.Template icon="♾️" title="永続性の保証">
              分散ネットワークにより半永久的な保存を実現
            </Carousel.Template>
          </Carousel>
        </Panel>
      </div>
    </div>
  ),
  name: "Size Comparison (Panel + Carousel)",
  parameters: {
    layout: "padded",
  },
};

export const FullWidthExample: Story = {
  render: () => (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "1rem",
      }}
    >
      <Panel size="medium" full={true}>
        <Carousel size="medium" variant="tech" autoPlay={false} showArrows showIndicators>
          <Carousel.Template icon="🖥️" title="フル幅表示">
            コンテナ幅いっぱいに表示される
          </Carousel.Template>
          <Carousel.Template icon="📱" title="適切な制御">
            親コンテナで幅を制御
          </Carousel.Template>
        </Carousel>
      </Panel>
    </div>
  ),
  name: "Full Width with Container",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: "Demonstrates the `full` prop with a proper container to prevent infinite width.",
      },
    },
  },
};

// =================================================================
// NAVIGATION VARIANTS
// =================================================================

export const ArrowsOnly: Story = {
  render: (args) => (
    <div style={{ width: "600px", margin: "0 auto" }}>
      <Panel size="medium">
        <Carousel {...args}>
          <Carousel.Template icon="1️⃣" title="誓いの交換">
            新郎新婦がデジタル署名で永遠の誓いを交換
          </Carousel.Template>
          <Carousel.Template icon="2️⃣" title="証人の立会い">
            招待された証人がQRコードで参加・署名
          </Carousel.Template>
          <Carousel.Template icon="3️⃣" title="ブロックチェーン記録">
            全ての署名をブロックチェーンに永久記録
          </Carousel.Template>
        </Carousel>
      </Panel>
    </div>
  ),
  args: {
    showIndicators: false,
    showArrows: true,
    autoPlay: true,
    variant: "default",
    size: "medium",
  },
  name: "Arrows Only Navigation",
};

export const IndicatorsOnly: Story = {
  render: (args) => (
    <div style={{ width: "600px", margin: "0 auto" }}>
      <Panel size="medium">
        <Carousel {...args}>
          <Carousel.Template icon="📱" title="モバイル最適化">
            スマートフォンからの参加に最適化
          </Carousel.Template>
          <Carousel.Template icon="💻" title="デスクトップ対応">
            PC環境でもスムーズに動作
          </Carousel.Template>
          <Carousel.Template icon="📺" title="プロジェクター表示">
            大画面表示に最適化された設計
          </Carousel.Template>
        </Carousel>
      </Panel>
    </div>
  ),
  args: {
    showIndicators: true,
    showArrows: false,
    autoPlay: true,
    variant: "tech",
    size: "medium",
  },
  name: "Indicators Only Navigation",
};

export const NoNavigation: Story = {
  render: (args) => (
    <div style={{ width: "600px", margin: "0 auto" }}>
      <Panel size="medium">
        <Carousel {...args}>
          <Carousel.Template icon="🔄" title="自動再生のみ">
            ナビゲーション非表示でコンテンツに集中
          </Carousel.Template>
          <Carousel.Template icon="👀" title="視覚重視">
            ユーザーインターフェースを最小限に
          </Carousel.Template>
        </Carousel>
      </Panel>
    </div>
  ),
  args: {
    showIndicators: false,
    showArrows: false,
    autoPlay: true,
    variant: "minimal",
    size: "medium",
  },
  name: "No Navigation (Auto-play Only)",
};

// =================================================================
// REAL-WORLD USE CASES
// =================================================================

export const CeremonyFeatures: Story = {
  render: (args) => (
    <div style={{ width: "600px", margin: "0 auto" }}>
      <Panel size="medium">
        <Carousel {...args}>
          <Carousel.Template icon="👥" title="証人参加システム">
            QRコードスキャンで簡単に証人として参加可能
          </Carousel.Template>
          <Carousel.Template icon="🔄" title="リアルタイム同期">
            プロジェクター画面と証人画面が完全に同期
          </Carousel.Template>
          <Carousel.Template icon="💕" title="感情の共有">
            リアクション絵文字で喜びの瞬間を共有
          </Carousel.Template>
          <Carousel.Template icon="📜" title="永続的な記録">
            ブロックチェーンに刻まれる不変の愛の証明
          </Carousel.Template>
        </Carousel>
      </Panel>
    </div>
  ),
  args: {
    variant: "tech",
    size: "medium",
    autoPlay: true,
    autoPlayInterval: 6000,
    showIndicators: true,
    showArrows: true,
  },
  name: "Ceremony Features Showcase",
};

export const InteractiveDemo: Story = {
  render: () => {
    const [currentSlide, setCurrentSlide] = React.useState(0);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          minWidth: "420px",
        }}
      >
        <Panel size="medium">
          <Carousel
            variant="tech"
            size="medium"
            autoPlay={true}
            showIndicators={true}
            showArrows={true}
            onSlideChange={setCurrentSlide}
          >
            <Carousel.Template icon="🔒" title="世界最高の安全性">
              ブロックチェーンで永久保存・改ざん不可能
            </Carousel.Template>
            <Carousel.Template icon="🌍" title="世界中から検証可能">
              いつでもどこからでも記録の真正性を確認
            </Carousel.Template>
            <Carousel.Template icon="💎" title="伝統と革新の融合">
              古からの結婚の誓いを最新技術で永遠に
            </Carousel.Template>
          </Carousel>
        </Panel>
        <div
          style={{
            fontFamily: "IBM Plex Sans JP, sans-serif",
            fontSize: "0.9rem",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          現在のスライド: {currentSlide + 1} / 3
          <br />
          <em>矢印・インジケーターをクリックすると10秒間自動再生が停止します</em>
        </div>
      </div>
    );
  },
  name: "Interactive Demo with All Controls",
};

// =================================================================
// EDGE CASES
// =================================================================

export const SingleSlide: Story = {
  render: (args) => (
    <div style={{ width: "600px", margin: "0 auto" }}>
      <Panel size="medium">
        <Carousel {...args}>
          <Carousel.Template icon="🏆" title="単一スライド">
            一つのスライドの場合、ナビゲーションは自動的に非表示になります
          </Carousel.Template>
        </Carousel>
      </Panel>
    </div>
  ),
  args: {
    variant: "tech",
    size: "medium",
    showIndicators: true,
    showArrows: true,
  },
  name: "Single Slide (Navigation Hidden)",
};
