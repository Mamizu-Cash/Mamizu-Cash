import { useState } from 'react'
import {
  Background,
  Button,
  Panel,
  Text,
  Checkbox,
  Spinner,
  Badge,
} from '../../ui/index'
import styles from './DocumentScreen.module.css'
import commonStyles from '../CommonScreenStyles.module.css'
import logoWide from '../../../assets/logo-wide.svg'
import type { ProverRole } from './WelcomeScreen'
import { CONSTANTS } from '../../../constants'

export type DocumentScreenProps = {
  ceremonyId?: string
  role?: ProverRole
  documentUrl?: string
  documentLoaded: boolean
  documentHash: string
  isProcessing: boolean
  onConfirm: () => Promise<void>
}

export function DocumentScreen(props: DocumentScreenProps) {
  const {
    ceremonyId,
    role,
    documentUrl,
    documentLoaded,
    documentHash,
    isProcessing,
    onConfirm,
  } = props
  const [confirmed, setConfirmed] = useState(false)

  const getRoleDisplayName = (role?: ProverRole) => {
    if (!role) return ''
    return role === 'BRIDE' ? '新婦' : '新郎'
  }

  const getRoleColor = (role?: ProverRole) => {
    if (!role) return 'secondary'
    return role === 'BRIDE' ? 'accent' : 'info'
  }

  return (
    <div className={`${commonStyles.container} ${styles.container}`}>
      <Background />
      <div className={`${commonStyles.mainContainer} ${styles.mainContainer}`}>
        <Panel size="large" className={`${commonStyles.panel} ${styles.panel}`}>
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
                variant="h2"
                color="primary"
                align="center"
                weight="semibold"
                className={styles.title}
              >
                誓約文書の確認
              </Text>
              {role && (
                <Badge
                  variant={getRoleColor(role) as any}
                  size="large"
                  className={styles.roleBadge}
                >
                  {getRoleDisplayName(role)}として参加
                </Badge>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main className={styles.mainContent}>
            {!documentLoaded ? (
              /* Loading State */
              <section className={styles.loadingSection}>
                <Spinner size="large" variant="gradient" />
                <Text
                  variant="bodyLarge"
                  color="secondary"
                  align="center"
                  weight="medium"
                >
                  誓約文書を読み込んでいます...
                </Text>
                <Text
                  variant="body"
                  color="tertiary"
                  align="center"
                  className={styles.loadingNote}
                >
                  文書の完全性を検証中
                </Text>
              </section>
            ) : (
              <>
                {/* PDFファイルを表示ボタン */}
                <Button
                  variant="secondary"
                  onClick={() => {
                    window.open(documentUrl || CONSTANTS.documentUrl)
                  }}
                  className={styles.fullViewButton}
                >
                  PDFファイルを表示
                </Button>

                {/* Document Hash */}
                <section className={styles.hashSection}>
                  <Text
                    variant="label"
                    color="primary"
                    weight="semibold"
                    className={styles.sectionTitle}
                  >
                    文書完全性証明
                  </Text>
                  <div className={styles.hashDisplay}>
                    <Text
                      variant="caption"
                      color="secondary"
                      className={styles.hashLabel}
                    >
                      SHA-256ハッシュ値:
                    </Text>
                    <Text
                      variant="monoSmall"
                      color="tertiary"
                      className={styles.hashValue}
                      truncate
                    >
                      {documentHash}
                    </Text>
                  </div>
                  <Text
                    variant="caption"
                    color="tertiary"
                    align="center"
                    className={styles.hashNote}
                  >
                    このハッシュ値により文書の改ざんを検知できます
                  </Text>
                </section>

                {/* Confirmation */}
                <section className={styles.confirmationSection}>
                  <div className={styles.confirmationBox}>
                    <Checkbox
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      label="上記の誓約文書の内容を確認し、同意します"
                      required
                      className={styles.confirmationCheckbox}
                    />
                  </div>
                </section>

                {/* Action Button */}
                <section className={styles.actionSection}>
                  <Button
                    type="button"
                    variant="primary"
                    size="large"
                    loading={isProcessing}
                    disabled={!confirmed || isProcessing}
                    onClick={onConfirm}
                    className={styles.confirmButton}
                  >
                    {isProcessing ? '処理中...' : '内容を確認して次へ'}
                  </Button>
                </section>
              </>
            )}
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
