import {
  Background,
  Button,
  Panel,
  Text,
  Avatar,
  Badge,
  CopyButton,
} from '../../ui/index'
import styles from './CompletionScreen.module.css'
import commonStyles from '../CommonScreenStyles.module.css'
import logoWide from '../../../assets/logo-wide.svg'
import type { ProverRole } from './WelcomeScreen'

export type CompletionScreenProps = {
  ceremonyId?: string
  role?: ProverRole
  txid?: string
  blockHeight?: number
  certificateUrl?: string
  onShare: (platform: 'twitter' | 'facebook' | 'line') => void
  onDownloadCertificate: () => void
}

export function CompletionScreen(props: CompletionScreenProps) {
  const {
    ceremonyId,
    role,
    txid,
    blockHeight,
    certificateUrl,
    onShare,
    onDownloadCertificate,
  } = props

  const currentTime = new Date().toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tokyo',
  })

  const getRoleDisplayName = (role?: ProverRole) => {
    if (!role) return ''
    return role === 'BRIDE' ? '新婦' : '新郎'
  }

  const getRoleColor = (role?: ProverRole) => {
    if (!role) return 'secondary'
    return role === 'BRIDE' ? 'accent' : 'info'
  }

  const getPartnerRoleName = (role?: ProverRole) => {
    if (!role) return 'パートナー'
    return role === 'BRIDE' ? '新郎' : '新婦'
  }

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
            <div className={styles.celebrationSection}>
              <div className={styles.celebrationIcons}>
                <span className={styles.celebrationIcon}>🎊</span>
                <span className={styles.celebrationIcon}>💕</span>
                <span className={styles.celebrationIcon}>🎉</span>
              </div>
              <Text
                variant="h1"
                color="primary"
                align="center"
                weight="bold"
                className={styles.congratsTitle}
              >
                おめでとうございます！
              </Text>
              <Text
                variant="h3"
                color="secondary"
                align="center"
                weight="medium"
                className={styles.congratsSubtitle}
              >
                永遠の愛がブロックチェーンに刻まれました
              </Text>
              {role && (
                <Badge
                  variant={getRoleColor(role) as any}
                  size="large"
                  className={styles.roleBadge}
                >
                  {getRoleDisplayName(role)}として参加完了
                </Badge>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main className={styles.mainContent}>
            {/* Success Summary */}
            <section className={styles.summarySection}>
              <Text
                variant="bodyLarge"
                color="primary"
                align="center"
                weight="medium"
                className={styles.summaryTitle}
              >
                あなたと{getPartnerRoleName(role)}の永遠の誓いが
                <br />
                世界で最も安全なブロックチェーンに記録されました
              </Text>
              <Text
                variant="body"
                color="secondary"
                align="center"
                className={styles.summaryText}
              >
                この記録は改ざん不可能で、永続的に保存され、
                <br />
                世界中の誰でもその真正性を検証することができます。
              </Text>
            </section>

            {/* Transaction Details */}
            {txid && (
              <section className={styles.detailsSection}>
                <Text
                  variant="label"
                  color="primary"
                  weight="semibold"
                  className={styles.sectionTitle}
                >
                  ブロックチェーン記録詳細
                </Text>

                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <Text variant="caption" color="secondary" weight="medium">
                      記録完了日時
                    </Text>
                    <Text variant="body" color="primary" weight="semibold">
                      {currentTime}
                    </Text>
                  </div>

                  <div className={styles.detailItem}>
                    <Text variant="caption" color="secondary" weight="medium">
                      トランザクションID
                    </Text>
                    <div className={styles.copyableItem}>
                      <Text
                        variant="monoSmall"
                        color="brand"
                        className={styles.txid}
                        truncate
                      >
                        {txid}
                      </Text>
                      <CopyButton
                        textToCopy={txid}
                        className={styles.copyButton}
                      />
                    </div>
                  </div>

                  {blockHeight && (
                    <div className={styles.detailItem}>
                      <Text variant="caption" color="secondary" weight="medium">
                        ブロック高
                      </Text>
                      <Text variant="body" color="primary" weight="semibold">
                        {blockHeight.toLocaleString()}
                      </Text>
                    </div>
                  )}

                  {ceremonyId && (
                    <div className={styles.detailItem}>
                      <Text variant="caption" color="secondary" weight="medium">
                        式典ID
                      </Text>
                      <Text variant="monoSmall" color="tertiary">
                        {ceremonyId}
                      </Text>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Certificate and Actions */}
            <section className={styles.actionsSection}>
              <Text
                variant="label"
                color="primary"
                weight="semibold"
                align="center"
                className={styles.sectionTitle}
              >
                次のステップ
              </Text>

              <div className={styles.actionButtons}>
                {certificateUrl && (
                  <Button
                    variant="primary"
                    size="large"
                    onClick={onDownloadCertificate}
                    icon="📜"
                    className={styles.certificateButton}
                  >
                    婚姻証明書をダウンロード
                  </Button>
                )}

                <div className={styles.shareButtons}>
                  <Text
                    variant="caption"
                    color="secondary"
                    weight="medium"
                    align="center"
                    className={styles.shareLabel}
                  >
                    この喜びをシェア:
                  </Text>
                  <div className={styles.shareButtonGroup}>
                    <Button
                      variant="secondary"
                      onClick={() => onShare('twitter')}
                      className={styles.shareButton}
                    >
                      Twitter
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => onShare('facebook')}
                      className={styles.shareButton}
                    >
                      Facebook
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => onShare('line')}
                      className={styles.shareButton}
                    >
                      LINE
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className={styles.featuresSection}>
              <div className={styles.features}>
                <div className={styles.feature}>
                  <Avatar size="medium" variant="success">
                    🔒
                  </Avatar>
                  <Text variant="bodySmall" color="primary" weight="medium">
                    永続保存
                  </Text>
                  <Text variant="caption" color="secondary" align="center">
                    ブロックチェーンに永久保存
                  </Text>
                </div>
                <div className={styles.feature}>
                  <Avatar size="medium" variant="primary">
                    🌍
                  </Avatar>
                  <Text variant="bodySmall" color="primary" weight="medium">
                    世界検証
                  </Text>
                  <Text variant="caption" color="secondary" align="center">
                    誰でも真正性を確認可能
                  </Text>
                </div>
                <div className={styles.feature}>
                  <Avatar size="medium" variant="accent">
                    🔐
                  </Avatar>
                  <Text variant="bodySmall" color="primary" weight="medium">
                    改ざん不可
                  </Text>
                  <Text variant="caption" color="secondary" align="center">
                    暗号学的に保護された記録
                  </Text>
                </div>
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className={styles.footer}>
            <div className={styles.footerContent}>
              <Text variant="caption" color="tertiary" align="center">
                この記録は Bitcoin ネットワークによって永続的に保護されています
              </Text>
              <Text
                variant="caption"
                color="brand"
                align="center"
                weight="medium"
              >
                Powered by AokiApp Inc.
              </Text>
              <Text
                variant="caption"
                color="tertiary"
                align="center"
                className={styles.thankYou}
              >
                ビット婚姻をご利用いただき、ありがとうございました
              </Text>
            </div>
          </footer>
        </Panel>
      </div>
    </div>
  )
}
