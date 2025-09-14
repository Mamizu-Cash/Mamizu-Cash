import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Checkbox } from "../components/ui/Checkbox/Checkbox";

// =================================================================
// STORYBOOK META & STORIES - Checkbox (Primitive Form Component)
// =================================================================
const meta: Meta<typeof Checkbox> = {
  title: "Primitives/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "accent"],
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
    },
    checked: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    required: {
      control: "boolean",
    },
    label: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =================================================================
// BASIC CHECKBOX STORIES
// =================================================================

export const Default: Story = {
  args: {
    label: "Default checkbox",
    variant: "primary",
    size: "medium",
    checked: false,
    disabled: false,
    required: false,
  },
};

export const Checked: Story = {
  args: {
    label: "Checked checkbox",
    checked: true,
    variant: "primary",
    size: "medium",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled checkbox",
    disabled: true,
    variant: "primary",
    size: "medium",
  },
};

export const DisabledChecked: Story = {
  args: {
    label: "Disabled checked checkbox",
    disabled: true,
    checked: true,
    variant: "primary",
    size: "medium",
  },
};

export const Required: Story = {
  args: {
    label: "Required checkbox",
    required: true,
    variant: "primary",
    size: "medium",
  },
};

// =================================================================
// VARIANT STORIES
// =================================================================

export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        minWidth: "300px",
      }}
    >
      <h3 style={{ margin: 0, fontFamily: "IBM Plex Sans JP" }}>Checkbox Variants</h3>
      <Checkbox variant="primary" label="Primary (Blue)" />
      <Checkbox variant="secondary" label="Secondary (Bitcoin Orange)" />
      <Checkbox variant="accent" label="Accent (Pink)" />
    </div>
  ),
  name: "Variants",
};

export const VariantsChecked: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        minWidth: "300px",
      }}
    >
      <h3 style={{ margin: 0, fontFamily: "IBM Plex Sans JP" }}>Checked Variants</h3>
      <Checkbox variant="primary" label="Primary (Blue)" checked />
      <Checkbox variant="secondary" label="Secondary (Bitcoin Orange)" checked />
      <Checkbox variant="accent" label="Accent (Pink)" checked />
    </div>
  ),
  name: "Variants (Checked)",
};

// =================================================================
// SIZE STORIES
// =================================================================

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        minWidth: "300px",
      }}
    >
      <h3 style={{ margin: 0, fontFamily: "IBM Plex Sans JP" }}>Checkbox Sizes</h3>
      <Checkbox size="small" label="Small checkbox" />
      <Checkbox size="medium" label="Medium checkbox (default)" />
      <Checkbox size="large" label="Large checkbox" />
    </div>
  ),
  name: "Sizes",
};

export const SizesChecked: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        minWidth: "300px",
      }}
    >
      <h3 style={{ margin: 0, fontFamily: "IBM Plex Sans JP" }}>Checked Sizes</h3>
      <Checkbox size="small" label="Small checkbox" checked />
      <Checkbox size="medium" label="Medium checkbox (default)" checked />
      <Checkbox size="large" label="Large checkbox" checked />
    </div>
  ),
  name: "Sizes (Checked)",
};

// =================================================================
// FORM USE CASES (from mockups)
// =================================================================

export const TermsAndConditions: Story = {
  args: {
    label: "利用規約およびプライバシーポリシーに同意します",
    required: true,
    variant: "primary",
  },
  render: (args) => (
    <div style={{ minWidth: "350px" }}>
      <Checkbox {...args} />
    </div>
  ),
  name: "Terms and Conditions (from mockup)",
};

export const NewsletterSubscription: Story = {
  args: {
    label: "ニュースレターの配信を希望する",
    variant: "secondary",
  },
  render: (args) => (
    <div style={{ minWidth: "300px" }}>
      <Checkbox {...args} />
    </div>
  ),
  name: "Newsletter Subscription",
};

export const PrivacySettings: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        minWidth: "350px",
      }}
    >
      <h3 style={{ margin: 0, fontFamily: "IBM Plex Sans JP" }}>Privacy Settings</h3>
      <Checkbox label="匿名での参加を希望する" variant="primary" />
      <Checkbox label="証人リストに名前を表示する" variant="primary" checked />
      <Checkbox label="記念品の受け取りを希望する" variant="accent" />
      <Checkbox label="今後のイベント情報を受け取る" variant="secondary" />
    </div>
  ),
  name: "Privacy Settings Form",
};

export const WitnessPermissions: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        minWidth: "350px",
      }}
    >
      <h3 style={{ margin: 0, fontFamily: "IBM Plex Sans JP" }}>証人権限設定</h3>
      <Checkbox label="リアクション絵文字の送信を許可する" variant="primary" checked />
      <Checkbox label="マーキーメッセージの投稿を許可する" variant="primary" checked />
      <Checkbox label="一斉祝福への参加を許可する" variant="accent" checked />
      <Checkbox label="記録の共有を許可する" variant="secondary" />
    </div>
  ),
  name: "Witness Permissions (from mockup)",
};

// =================================================================
// COMPLEX LABEL CONTENT
// =================================================================

export const ComplexLabel: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        minWidth: "400px",
      }}
    >
      <Checkbox
        label={
          <span>
            I agree to the{" "}
            <a
              href="#"
              style={{
                color: "var(--bitcoin-primary)",
                textDecoration: "underline",
              }}
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              style={{
                color: "var(--bitcoin-primary)",
                textDecoration: "underline",
              }}
            >
              Privacy Policy
            </a>
          </span>
        }
        required
        variant="primary"
      />

      <Checkbox
        label={
          <div>
            <div style={{ fontWeight: "500", marginBottom: "0.25rem" }}>
              Subscribe to premium features
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Get access to advanced blockchain analytics and priority support
            </div>
          </div>
        }
        variant="secondary"
      />

      <Checkbox
        label={
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>🎉</span>
            <span>参加記念品の受け取りを希望する</span>
            <span
              style={{
                fontSize: "0.8rem",
                background: "var(--bitcoin-primary)",
                color: "white",
                padding: "0.125rem 0.5rem",
                borderRadius: "12px",
              }}
            >
              無料
            </span>
          </div>
        }
        variant="accent"
      />
    </div>
  ),
  name: "Complex Label Content",
};

// =================================================================
// INTERACTIVE STORIES
// =================================================================

export const ControlledCheckbox: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);
    const [variant, setVariant] = React.useState<"primary" | "secondary" | "accent">("primary");
    const [size, setSize] = React.useState<"small" | "medium" | "large">("medium");
    const [disabled, setDisabled] = React.useState(false);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          minWidth: "300px",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.25rem",
                fontSize: "0.8rem",
              }}
            >
              Variant:
            </label>
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value as any)}
              style={{
                padding: "0.25rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
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
                display: "block",
                marginBottom: "0.25rem",
                fontSize: "0.8rem",
              }}
            >
              Size:
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as any)}
              style={{
                padding: "0.25rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "0.8rem",
              }}
            >
              <input
                type="checkbox"
                checked={disabled}
                onChange={(e) => setDisabled(e.target.checked)}
              />
              Disabled
            </label>
          </div>
        </div>

        <div
          style={{
            padding: "1rem",
            border: "1px solid var(--premium-border)",
            borderRadius: "8px",
          }}
        >
          <Checkbox
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            label="Live checkbox demo"
            variant={variant}
            size={size}
            disabled={disabled}
          />
        </div>

        <div
          style={{
            padding: "0.75rem",
            background: "#f8f9fa",
            borderRadius: "8px",
            fontSize: "0.9rem",
          }}
        >
          <strong>Current state:</strong> {checked ? "Checked" : "Unchecked"}
        </div>
      </div>
    );
  },
  name: "Controlled Checkbox Demo",
};

export const CheckboxGroup: Story = {
  render: () => {
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

    const options = [
      {
        id: "reactions",
        label: "リアクション絵文字の送信",
        variant: "primary" as const,
      },
      {
        id: "messages",
        label: "マーキーメッセージの投稿",
        variant: "primary" as const,
      },
      {
        id: "celebration",
        label: "一斉祝福への参加",
        variant: "accent" as const,
      },
      { id: "sharing", label: "記録の共有", variant: "secondary" as const },
    ];

    const handleOptionChange = (optionId: string, checked: boolean) => {
      setSelectedOptions((prev) =>
        checked ? [...prev, optionId] : prev.filter((id) => id !== optionId),
      );
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          minWidth: "350px",
        }}
      >
        <h3 style={{ margin: 0, fontFamily: "IBM Plex Sans JP" }}>証人権限の選択</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {options.map((option) => (
            <Checkbox
              key={option.id}
              label={option.label}
              variant={option.variant}
              checked={selectedOptions.includes(option.id)}
              onChange={(e) => handleOptionChange(option.id, e.target.checked)}
            />
          ))}
        </div>

        <div
          style={{
            padding: "1rem",
            background: "#f8f9fa",
            borderRadius: "8px",
            fontSize: "0.9rem",
          }}
        >
          <strong>Selected permissions:</strong>
          {selectedOptions.length > 0 ? (
            <ul style={{ margin: "0.5rem 0 0 1rem", padding: 0 }}>
              {selectedOptions.map((id) => {
                const option = options.find((o) => o.id === id);
                return <li key={id}>{option?.label}</li>;
              })}
            </ul>
          ) : (
            <div style={{ marginTop: "0.5rem", color: "var(--text-secondary)" }}>None selected</div>
          )}
        </div>
      </div>
    );
  },
  name: "Checkbox Group Demo",
};

// =================================================================
// SHOWCASE STORY
// =================================================================

export const AllCheckboxesShowcase: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        minWidth: "400px",
      }}
    >
      <h3
        style={{
          fontFamily: "IBM Plex Sans JP",
          color: "var(--text-primary)",
          margin: 0,
        }}
      >
        Checkbox Variants
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Checkbox variant="primary" label="Primary checkbox (blue)" />
        <Checkbox variant="secondary" label="Secondary checkbox (orange)" />
        <Checkbox variant="accent" label="Accent checkbox (pink)" />
      </div>

      <h3
        style={{
          fontFamily: "IBM Plex Sans JP",
          color: "var(--text-primary)",
          margin: 0,
        }}
      >
        Checkbox States
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Checkbox label="Default state" />
        <Checkbox label="Checked state" checked />
        <Checkbox label="Disabled state" disabled />
        <Checkbox label="Disabled checked" checked disabled />
        <Checkbox label="Required checkbox" required />
      </div>

      <h3
        style={{
          fontFamily: "IBM Plex Sans JP",
          color: "var(--text-primary)",
          margin: 0,
        }}
      >
        Checkbox Sizes
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Checkbox size="small" label="Small checkbox" checked />
        <Checkbox size="medium" label="Medium checkbox" checked />
        <Checkbox size="large" label="Large checkbox" checked />
      </div>

      <h3
        style={{
          fontFamily: "IBM Plex Sans JP",
          color: "var(--text-primary)",
          margin: 0,
        }}
      >
        Common Use Cases
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Checkbox
          label="利用規約およびプライバシーポリシーに同意します"
          required
          variant="primary"
        />
        <Checkbox label="リアクション絵文字の送信を許可する" variant="primary" checked />
        <Checkbox label="記念品の受け取りを希望する" variant="accent" />
        <Checkbox label="ニュースレターの配信を希望する" variant="secondary" />
      </div>
    </div>
  ),
  name: "All Checkboxes (Showcase)",
};
