import { createFileRoute } from "@tanstack/react-router";
import logo from "../logo.svg";
import styles from "./index.module.css";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.logoContainer}>
            <img src={logo} className={styles.logo} alt="Mamizu Cash" />
          </div>

          <h1 className={styles.title}>Mamizu Cash</h1>

          <p className={styles.subtitle}>
            Enterprise privacy payments with zero-knowledge technology
          </p>

          <p className={styles.description}>
            Secure, compliant, and completely private cross-border transactions for businesses.
            Protect your commercial relationships while maintaining full regulatory compliance.
          </p>

          {/* Feature Highlights */}
          <div className={styles.featuresGrid}>
            <div className={`${styles.featureCard} ${styles.featureCardPrivacy}`}>
              <span className={styles.featureIcon}>🛡️</span>
              <h3 className={styles.featureTitle}>Zero-Knowledge Privacy</h3>
              <p className={styles.featureDescription}>
                Complete transaction unlinkability using advanced cryptographic proofs
              </p>
            </div>

            <div className={`${styles.featureCard} ${styles.featureCardCompliance}`}>
              <span className={styles.featureIcon}>🏢</span>
              <h3 className={styles.featureTitle}>Enterprise Compliant</h3>
              <p className={styles.featureDescription}>
                KYC/KYB verified participants only. Fully auditable by regulators
              </p>
            </div>

            <div className={`${styles.featureCard} ${styles.featureCardIntegration}`}>
              <span className={styles.featureIcon}>🔗</span>
              <h3 className={styles.featureTitle}>Simple Integration</h3>
              <p className={styles.featureDescription}>
                Share payment links via email, invoices, or QR codes seamlessly
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={styles.ctaContainer}>
            <a href="/deposit" className={styles.ctaPrimary} aria-label="Start a private transfer">
              Start Private Transfer
              <span aria-hidden="true">→</span>
            </a>

            <a
              href="/withdraw"
              className={styles.ctaSecondary}
              aria-label="Receive a private payment"
            >
              Receive Payment
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        {/* Credential Verification Section */}
        <section className={styles.credentialsSection}>
          <h2 className={styles.credentialsTitle}>Get Verified to Participate</h2>
          <p className={styles.credentialsDescription}>
            To use Mamizu Cash, you need either a Mizuhiki SBT (individual) or UNTI credential
            (corporate). Choose your verification type below.
          </p>

          <div className={styles.credentialsGrid}>
            {/* Individual Verification */}
            <div className={`${styles.credentialCard} ${styles.credentialCardIndividual}`}>
              <div
                className={`${styles.credentialIconContainer} ${styles.credentialIconIndividual}`}
              >
                <span className={styles.credentialIcon}>👤</span>
              </div>
              <h3 className={styles.credentialTitle}>Individual (Mizuhiki SBT)</h3>
              <p className={styles.credentialDescription}>
                Personal KYC verification for individual users. Get your Mizuhiki Verified SBT to
                participate in private transactions.
              </p>
              <a
                href="/get-mizuhiki"
                className={`${styles.credentialButton} ${styles.credentialButtonIndividual}`}
                aria-label="Get Mizuhiki SBT for individual verification"
              >
                Get Mizuhiki SBT
                <span aria-hidden="true">→</span>
              </a>
            </div>

            {/* Corporate Verification */}
            <div className={`${styles.credentialCard} ${styles.credentialCardCorporate}`}>
              <div
                className={`${styles.credentialIconContainer} ${styles.credentialIconCorporate}`}
              >
                <span className={styles.credentialIcon}>🏢</span>
              </div>
              <h3 className={styles.credentialTitle}>Corporate (UNTI)</h3>
              <p className={styles.credentialDescription}>
                Business KYB verification through ZK Email DKIM proof. Get your UNTI credential for
                enterprise transactions.
              </p>
              <a
                href="/get-unti"
                className={`${styles.credentialButton} ${styles.credentialButtonCorporate}`}
                aria-label="Get UNTI credential for corporate verification"
              >
                Get UNTI Credential
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <div className={styles.notice}>
            <p className={styles.noticeText}>
              <strong>Note:</strong> Both sender and receiver must have valid credentials to
              complete a private transaction. This ensures regulatory compliance and prevents
              misuse.
            </p>
          </div>
        </section>

        {/* Technology Section */}
        <section className={styles.technologySection}>
          <h2 className={styles.technologyTitle}>Built on Japan Smart Chain Kaigan</h2>
          <p className={styles.technologyDescription}>
            Leveraging Ethereum-compatible infrastructure with native compliance features and
            onshore governance for enterprise adoption.
          </p>

          <div className={styles.technologyBadge}>
            <span className={styles.technologyBadgeText}>
              Powered by: Tornado Cash Technology • Mizuhiki SBT • UNTI Credentials
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
