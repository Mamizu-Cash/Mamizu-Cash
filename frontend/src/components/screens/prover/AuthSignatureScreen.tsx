import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Background,
  Button,
  Panel,
  Text,
  Avatar,
  Badge,
  Spinner,
} from '../../ui/index'
import styles from './AuthSignatureScreen.module.css'
import commonStyles from '../CommonScreenStyles.module.css'
import logoWide from '../../../assets/logo-wide.svg'
import type { ProverRole } from './WelcomeScreen'

export type AuthSignatureStatus =
  | 'ready'
  | 'authenticating'
  | 'auth-success'
  | 'generating'
  | 'signing'
  | 'uploading'
  | 'success'
  | 'auth-error'
  | 'signature-error'

export type AuthSignatureScreenProps = {
  ceremonyId?: string
  role?: ProverRole
  documentHash?: string
  status: AuthSignatureStatus
  onFullProcess: () => Promise<void>
}

export function AuthSignatureScreen(props: AuthSignatureScreenProps) {
  const { ceremonyId, role, documentHash, status, onFullProcess } = props

  const getStatusMessage = () => {
    switch (status) {
      case 'ready':
        return ''
      case 'authenticating':
        return '生体認証を実行中...'
      case 'auth-success':
        return '認証完了 - 署名を開始します...'
      case 'generating':
        return '暗号学的鍵を生成中...'
      case 'signing':
        return '誓約文書に電子署名中...'
      case 'uploading':
        return '署名データを送信中...'
      case 'success':
        return '認証・署名が完了しました！'
      case 'auth-error':
        return '認証に失敗しました。再試行できません。'
      case 'signature-error':
        return '署名に失敗しました。もう一度お試しください。'
      default:
        return ''
    }
  }

  const getRoleDisplayName = (role?: ProverRole) => {
    if (!role) return ''
    return role === 'BRIDE' ? '新婦' : '新郎'
  }

  const getRoleColor = (role?: ProverRole) => {
    if (!role) return 'secondary'
    return role === 'BRIDE' ? 'accent' : 'info'
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'ready':
        return '🔐'
      case 'authenticating':
        return '⏳'
      case 'auth-success':
        return '✅'
      case 'generating':
        return '🔐'
      case 'signing':
        return '📝'
      case 'uploading':
        return '📤'
      case 'success':
        return '🎉'
      case 'auth-error':
      case 'signature-error':
        return '❌'
      default:
        return '🔐'
    }
  }

  const getStatusBadgeVariant = () => {
    switch (status) {
      case 'ready':
        return 'secondary'
      case 'authenticating':
      case 'generating':
      case 'signing':
      case 'uploading':
        return 'warning'
      case 'auth-success':
      case 'success':
        return 'success'
      case 'auth-error':
      case 'signature-error':
        return 'error'
      default:
        return 'secondary'
    }
  }

  const getMainTitle = () => {
    if (status === 'ready') return '認証・署名'
    if (['authenticating', 'auth-success'].includes(status)) return '本人認証'
    if (['generating', 'signing', 'uploading'].includes(status))
      return '誓いの署名'
    if (status === 'success') return '完了'
    return 'エラー'
  }

  const isProcessing = [
    'authenticating',
    'auth-success',
    'generating',
    'signing',
    'uploading',
  ].includes(status)

  const hasError = status === 'auth-error' || status === 'signature-error'

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
              <Avatar size="large" variant="primary">
                {getStatusIcon()}
              </Avatar>
              <Text
                variant="h2"
                color="primary"
                align="center"
                weight="semibold"
                className={styles.title}
              >
                {getMainTitle()}
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
              <Badge
                variant={getStatusBadgeVariant() as any}
                size="medium"
                className={styles.statusBadge}
              >
                {getStatusMessage() || '認証・署名の準備ができました'}
              </Badge>
            </div>
          </header>

          {/* Main Content */}
          <main className={styles.mainContent}>
            {status === 'ready' && (
              <section className={styles.readySection}>
                <Text
                  variant="bodyLarge"
                  color="primary"
                  align="center"
                  weight="medium"
                  className={styles.readyTitle}
                >
                  生体認証から署名まで連続実行
                </Text>
                <Text
                  variant="body"
                  color="secondary"
                  align="center"
                  className={styles.readyText}
                >
                  本人確認の後、自動的に誓約文書への
                  <br />
                  電子署名を実行します。
                  <br />
                  全ての処理が完了するまでお待ちください。
                </Text>

                <div className={styles.processFlow}>
                  <div className={styles.flowStep}>
                    <Avatar size="medium" variant="secondary">
                      🔐
                    </Avatar>
                    <Text variant="caption" color="secondary" align="center">
                      生体認証
                    </Text>
                  </div>
                  <div className={styles.flowArrow}>→</div>
                  <div className={styles.flowStep}>
                    <Avatar size="medium" variant="secondary">
                      📝
                    </Avatar>
                    <Text variant="caption" color="secondary" align="center">
                      電子署名
                    </Text>
                  </div>
                  <div className={styles.flowArrow}>→</div>
                  <div className={styles.flowStep}>
                    <Avatar size="medium" variant="secondary">
                      ✅
                    </Avatar>
                    <Text variant="caption" color="secondary" align="center">
                      完了
                    </Text>
                  </div>
                </div>

                {documentHash && (
                  <div className={styles.documentInfo}>
                    <Text variant="caption" color="secondary" weight="semibold">
                      署名対象文書:
                    </Text>
                    <Text
                      variant="monoSmall"
                      color="tertiary"
                      className={styles.documentHash}
                      truncate
                    >
                      {documentHash}
                    </Text>
                  </div>
                )}
              </section>
            )}

            {isProcessing && (
              <section className={styles.processingSection}>
                <div className={styles.progressContainer}>
                  <Spinner size="large" variant="bitcoin" />
                </div>
              </section>
            )}

            {status === 'success' && (
              <section className={styles.successSection}>
                <div className={styles.successIcon}>🎉</div>
                <Text
                  variant="h4"
                  color="success"
                  align="center"
                  weight="semibold"
                >
                  認証・署名完了
                </Text>
                <Text
                  variant="body"
                  color="secondary"
                  align="center"
                  className={styles.successMessage}
                >
                  あなたの永遠の誓いが
                  <br />
                  安全に署名されました
                </Text>
              </section>
            )}

            {hasError && (
              <section className={styles.errorSection}>
                <div className={styles.errorIcon}>❌</div>
                <Text
                  variant="h4"
                  color="error"
                  align="center"
                  weight="semibold"
                >
                  処理失敗
                </Text>
                <Text
                  variant="body"
                  color="secondary"
                  align="center"
                  className={styles.errorMessage}
                >
                  {getStatusMessage()}
                </Text>
              </section>
            )}

            {/* Action Buttons */}
            <section className={styles.actionSection}>
              {status === 'ready' && (
                <Button
                  type="button"
                  variant="primary"
                  size="large"
                  onClick={onFullProcess}
                  icon="🚀"
                  className={styles.startButton}
                >
                  認証・署名を開始
                </Button>
              )}
            </section>
          </main>

          {/* Footer */}
          <footer className={styles.footer}>
            <div className={styles.footerContent}>
              <Text variant="caption" color="tertiary" align="center">
                {ceremonyId && `式典ID: ${ceremonyId} | `}
                WebAuthn + Web Crypto API による安全な処理
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
