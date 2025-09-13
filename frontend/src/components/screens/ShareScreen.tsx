import { Background, Button, Panel, Text } from '../ui/index'
import styles from './ShareScreen.module.css'
import commonStyles from './CommonScreenStyles.module.css'
import logoWide from '../../assets/logo-wide.svg'
import { CONSTANTS } from '../../constants'

export function ShareScreen() {
  return (
    <div className={`${commonStyles.container} ${styles.container}`}>
      <Background />
      <div className={`${commonStyles.mainContainer} ${styles.mainContainer}`}>
        <Panel
          size="medium"
          className={`${commonStyles.panel} ${styles.panel}`}
        >
          {/* Header Section */}
          <header className={`${commonStyles.header} ${styles.header}`}>
            <div className={styles.brandGroup}>
              <img
                src={logoWide}
                alt="ビット婚姻"
                className={styles.brandLogo}
              />
            </div>
            <div className={styles.titleSection}>
              <Text
                variant="h1"
                color="primary"
                align="center"
                weight="bold"
                className={styles.mainTitle}
              >
                ビット婚姻の共有
              </Text>
              <Text
                variant="bodyLarge"
                color="secondary"
                align="center"
                className={styles.subtitle}
              >
                {CONSTANTS.names.bride}さんと{CONSTANTS.names.groom}さんの
                <br />
                特別な瞬間を共有しましょう
              </Text>
            </div>
          </header>

          {/* Content Section */}
          <main className={styles.mainContent}>
            <div className={styles.contentContainer}>
              {/* Marriage Certificate Section */}
              <div className={styles.infoSection}>
                <Text
                  variant="bodyLarge"
                  color="primary"
                  align="center"
                  weight="bold"
                  className={styles.sectionTitle}
                >
                  💍 婚姻証明書
                </Text>
                <Text
                  variant="body"
                  color="secondary"
                  align="center"
                  className={styles.sectionLabel}
                >
                  ドキュメントハッシュ:
                </Text>
                <Text
                  variant="bodySmall"
                  color="secondary"
                  align="center"
                  className={styles.hashValue}
                >
                  {CONSTANTS.precomputedDocumentHash}
                </Text>
              </div>

              {/* Blockchain Proof Section */}
              <div className={styles.infoSection}>
                <Text
                  variant="bodyLarge"
                  color="primary"
                  align="center"
                  weight="bold"
                  className={styles.sectionTitle}
                >
                  🔗 ブロックチェーン証明
                </Text>
                <Text
                  variant="body"
                  color="secondary"
                  align="center"
                  className={styles.sectionLabel}
                >
                  トランザクションハッシュ:
                </Text>
                <Text
                  variant="bodySmall"
                  color="secondary"
                  align="center"
                  className={styles.hashValue}
                >
                  {CONSTANTS.precomputedTransactionHash}
                </Text>
              </div>

              {/* Action Buttons */}
              <div className={styles.buttonSection}>
                <a
                  href={CONSTANTS.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.buttonLink}
                >
                  <Button variant="primary" size="large" className={styles.actionButton}>
                    📄 証明書を確認
                  </Button>
                </a>

                <a
                  href={`${CONSTANTS.blockExplorer.tx.replace('xxx', CONSTANTS.precomputedTransactionHash)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.buttonLink}
                >
                  <Button variant="secondary" size="large" className={styles.actionButton}>
                    🔍 ブロックチェーンで確認
                  </Button>
                </a>

                <a href="https://aoki.app/" target="_blank" className={styles.buttonLink}>
                  <Button variant="groom" size="large" className={styles.actionButton}>
                    ❓ AokiAppへ
                  </Button>
                </a>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className={styles.footer}>
            <div className={styles.footerContent}>
              <Text variant="caption" color="tertiary" align="center">
                ブロックチェーン技術による永続的な記録
              </Text>
              <Text
                variant="caption"
                color="brand"
                align="center"
                weight="medium"
              >
                Powered by AokiApp Inc.
              </Text>
            </div>
          </footer>
        </Panel>
      </div>
    </div>
  )
}