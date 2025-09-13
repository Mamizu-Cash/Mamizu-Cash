import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Background,
  Button,
  Panel,
  Text,
  Input,
  Checkbox,
} from '../../ui/index'
import styles from './RegisterScreen.module.css'
import commonStyles from '../CommonScreenStyles.module.css'
import logoWide from '../../../assets/logo-wide.svg'
import { CONSTANTS } from '../../../constants'
export type RegisterScreenProps = {
  sessionId?: string
  onRegister?: (data: {
    agreed: boolean
    nickname?: string
    message?: string
  }) => void
}

export function RegisterScreen(props: RegisterScreenProps) {
  const { sessionId, onRegister } = props
  const navigate = useNavigate()

  const [agreed, setAgreed] = useState(false)
  const [nickname, setNickname] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreed) {
      alert('利用規約とプライバシーポリシーへの同意が必要です')
      return
    }

    setIsSubmitting(true)

    try {
      // データを親コンポーネントに送信
      await onRegister?.({
        agreed,
        nickname: nickname.trim() || undefined,
        message: message.trim() || undefined,
      })

      // 次の画面に遷移
      navigate({ to: '/verifier/ceremony' })
    } catch (error) {
      console.error('Registration failed:', error)
      alert('参加登録に失敗しました。もう一度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
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
          {/* Header Section */}
          <header className={`${commonStyles.header} ${styles.header}`}>
            <div className={styles.brandGroup}>
              <img
                src={logoWide}
                alt="ビット婚姻"
                className={styles.brandLogo}
              />
            </div>
            <div className={styles.welcomeSection}>
              <Text
                variant="h2"
                color="primary"
                align="center"
                weight="semibold"
                className={styles.welcomeTitle}
              >
                永遠の証人になってください
              </Text>
              <Text
                variant="bodyLarge"
                color="secondary"
                align="center"
                className={styles.welcomeMessage}
              >
                あなたも二人の愛の証人として、
                <br />
                この特別な瞬間に立ち会ってください。
              </Text>
            </div>
          </header>
          {/* Form Section */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* 必須項目：利用規約同意 */}
            <div className={styles.formSection}>
              <Text
                variant="label"
                color="primary"
                weight="medium"
                className={styles.sectionTitle}
              >
                参加にあたって
              </Text>

              <div className={styles.agreementSection}>
                <Checkbox
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  label={
                    <span>
                      <a
                        href={CONSTANTS.tosUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#1976d2',
                          textDecoration: 'underline',
                        }}
                      >
                        利用規約とプライバシーポリシー
                      </a>
                      に同意する
                    </span>
                  }
                  required
                />
              </div>
            </div>

            {/* 任意項目：ニックネーム */}
            <div className={styles.formSection}>
              <Text
                variant="label"
                color="primary"
                weight="medium"
                className={styles.sectionTitle}
              >
                ニックネーム
                <Text
                  variant="caption"
                  color="tertiary"
                  className={styles.optionalNote}
                >
                  任意
                </Text>
              </Text>

              <Input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="例：太郎"
                maxLength={20}
                className={styles.nicknameInput}
              />
            </div>

            {/* 任意項目：お祝いメッセージ */}
            <div className={styles.formSection}>
              <Text
                variant="label"
                color="primary"
                weight="medium"
                className={styles.sectionTitle}
              >
                お祝いメッセージ
                <Text
                  variant="caption"
                  color="tertiary"
                  className={styles.optionalNote}
                >
                  任意
                </Text>
              </Text>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="お二人への祝福のメッセージをお聞かせください"
                maxLength={200}
                rows={3}
                className={styles.messageTextarea}
              />
              <Text
                variant="caption"
                color="tertiary"
                align="right"
                className={styles.charCount}
              >
                {message.length}/200
              </Text>
            </div>

            {/* Submit Button */}
            <div className={styles.submitSection}>
              <Button
                type="submit"
                variant="primary"
                size="large"
                loading={isSubmitting}
                disabled={!agreed || isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? '参加登録中...' : '証人として参加する'}
              </Button>
            </div>

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
          </form>
        </Panel>
      </div>
    </div>
  )
}
