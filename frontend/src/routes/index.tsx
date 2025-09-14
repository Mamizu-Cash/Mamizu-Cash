import { createFileRoute } from "@tanstack/react-router";
import logo from "../logo.svg";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {/* Hero Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "4rem 2rem",
            marginBottom: "3rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "120px",
              height: "120px",
              backgroundColor: "#3b82f6",
              borderRadius: "50%",
              marginBottom: "2rem",
            }}
          >
            <img
              src={logo}
              style={{
                height: "60px",
                width: "60px",
                filter: "brightness(0) invert(1)",
              }}
              alt="Mamizu Cash"
            />
          </div>

          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: "bold",
              color: "#1e293b",
              marginBottom: "1rem",
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Mamizu Cash
          </h1>

          <p
            style={{
              fontSize: "1.5rem",
              color: "#64748b",
              marginBottom: "2rem",
              maxWidth: "600px",
              margin: "0 auto 2rem auto",
              lineHeight: "1.6",
            }}
          >
            Enterprise privacy payments with zero-knowledge technology
          </p>

          <p
            style={{
              fontSize: "1.1rem",
              color: "#475569",
              marginBottom: "3rem",
              maxWidth: "800px",
              margin: "0 auto 3rem auto",
              lineHeight: "1.7",
            }}
          >
            Secure, compliant, and completely private cross-border transactions for businesses.
            Protect your commercial relationships while maintaining full regulatory compliance.
          </p>

          {/* Feature Highlights */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2rem",
              marginBottom: "3rem",
            }}
          >
            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "#eff6ff",
                borderRadius: "12px",
                border: "1px solid #dbeafe",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  marginBottom: "0.5rem",
                }}
              >
                🛡️
              </div>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  color: "#1e293b",
                  marginBottom: "0.5rem",
                }}
              >
                Zero-Knowledge Privacy
              </h3>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.95rem",
                  lineHeight: "1.5",
                }}
              >
                Complete transaction unlinkability using advanced cryptographic proofs
              </p>
            </div>

            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "#f0fdf4",
                borderRadius: "12px",
                border: "1px solid #bbf7d0",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  marginBottom: "0.5rem",
                }}
              >
                🏢
              </div>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  color: "#1e293b",
                  marginBottom: "0.5rem",
                }}
              >
                Enterprise Compliant
              </h3>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.95rem",
                  lineHeight: "1.5",
                }}
              >
                KYC/KYB verified participants only. Fully auditable by regulators
              </p>
            </div>

            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "#fefce8",
                borderRadius: "12px",
                border: "1px solid #fef08a",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  marginBottom: "0.5rem",
                }}
              >
                🔗
              </div>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  color: "#1e293b",
                  marginBottom: "0.5rem",
                }}
              >
                Simple Integration
              </h3>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.95rem",
                  lineHeight: "1.5",
                }}
              >
                Share payment links via email, invoices, or QR codes seamlessly
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/deposit"
              style={{
                padding: "1rem 2rem",
                backgroundColor: "#3b82f6",
                color: "white",
                textDecoration: "none",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#3b82f6";
              }}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = "#3b82f6";
              }}
            >
              Start Private Transfer
              <span>→</span>
            </a>

            <a
              href="/withdraw"
              style={{
                padding: "1rem 2rem",
                backgroundColor: "white",
                color: "#3b82f6",
                textDecoration: "none",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: "600",
                border: "2px solid #3b82f6",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#3b82f6";
                e.currentTarget.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.color = "#3b82f6";
              }}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = "#3b82f6";
                e.currentTarget.style.color = "white";
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.color = "#3b82f6";
              }}
            >
              Receive Payment
              <span>↓</span>
            </a>
          </div>
        </div>

        {/* Credential Verification Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "1rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#1e293b",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Get Verified to Participate
          </h2>
          <p
            style={{
              color: "#64748b",
              marginBottom: "1.5rem",
              textAlign: "center",
              maxWidth: "600px",
              margin: "0 auto 1.5rem auto",
              lineHeight: "1.6",
            }}
          >
            To use Mamizu Cash, you need either a Mizuhiki SBT (individual) or UNTI credential
            (corporate). Choose your verification type below.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            {/* Individual Verification */}
            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "#eff6ff",
                borderRadius: "12px",
                border: "2px solid #dbeafe",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#3b82f6",
                  borderRadius: "50%",
                  marginBottom: "1rem",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>👤</span>
              </div>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  color: "#1e293b",
                  marginBottom: "0.5rem",
                }}
              >
                Individual (Mizuhiki SBT)
              </h3>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.95rem",
                  lineHeight: "1.5",
                  marginBottom: "1.5rem",
                }}
              >
                Personal KYC verification for individual users. Get your Mizuhiki Verified SBT to
                participate in private transactions.
              </p>
              <a
                href="/get-mizuhiki"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#2563eb";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#3b82f6";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = "#2563eb";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.backgroundColor = "#3b82f6";
                }}
              >
                Get Mizuhiki SBT
                <span>→</span>
              </a>
            </div>

            {/* Corporate Verification */}
            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "#f3e8ff",
                borderRadius: "12px",
                border: "2px solid #d8b4fe",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#8b5cf6",
                  borderRadius: "50%",
                  marginBottom: "1rem",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>🏢</span>
              </div>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  color: "#1e293b",
                  marginBottom: "0.5rem",
                }}
              >
                Corporate (UNTI)
              </h3>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.95rem",
                  lineHeight: "1.5",
                  marginBottom: "1.5rem",
                }}
              >
                Business KYB verification through ZK Email DKIM proof. Get your UNTI credential for
                enterprise transactions.
              </p>
              <a
                href="/get-unti"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#8b5cf6",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#7c3aed";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#8b5cf6";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = "#7c3aed";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.backgroundColor = "#8b5cf6";
                }}
              >
                Get UNTI Credential
                <span>→</span>
              </a>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#fef3c7",
              padding: "1rem",
              borderRadius: "8px",
              border: "1px solid #fcd34d",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                color: "#92400e",
                lineHeight: "1.5",
              }}
            >
              <strong>Note:</strong> Both sender and receiver must have valid credentials to
              complete a private transaction. This ensures regulatory compliance and prevents
              misuse.
            </p>
          </div>
        </div>

        {/* Technology Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#1e293b",
              marginBottom: "1rem",
            }}
          >
            Built on Japan Smart Chain Kaigan
          </h2>
          <p
            style={{
              color: "#64748b",
              marginBottom: "1.5rem",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            Leveraging Ethereum-compatible infrastructure with native compliance features and
            onshore governance for enterprise adoption.
          </p>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0.75rem 1.5rem",
              backgroundColor: "#f1f5f9",
              borderRadius: "8px",
            }}
          >
            <span style={{ color: "#475569", fontSize: "0.9rem" }}>
              Powered by: Tornado Cash Technology • Mizuhiki SBT • UNTI Credentials
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
