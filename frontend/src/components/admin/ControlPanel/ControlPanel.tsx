import { useState } from 'react'
import styles from './ControlPanel.module.css'

type CeremonyState = 'waiting' | 'signing' | 'completed'

export type ControlPanelProps = {
  onStartCeremony: () => void
  onForceState: (bride: CeremonyState, groom: CeremonyState) => void
  onPublishTxid: () => void
  onClearTxid: () => void
  onSendReaction: (message: string) => void
  loading?: boolean
  wsReady?: boolean
}

export function ControlPanel({
  onStartCeremony,
  onForceState,
  onPublishTxid,
  onClearTxid,
  loading = false,
  onSendReaction,
  wsReady,
}: ControlPanelProps) {
  const [brideState, setBrideState] = useState<CeremonyState>('waiting')
  const [groomState, setGroomState] = useState<CeremonyState>('waiting')
  const [reactionMsg, setReactionMsg] = useState('')

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <button
          className={`${styles.button} ${styles.primary}`}
          onClick={onStartCeremony}
          disabled={loading}
        >
          儀式を開始する
        </button>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>強制的に新郎新婦の状態を変更</h3>
        <div className={styles.flexRow}>
          <label className={styles.label}>
            新婦状態:
            <select
              className={styles.select}
              value={brideState}
              onChange={(e) => setBrideState(e.target.value as CeremonyState)}
              disabled={loading}
            >
              <option value="waiting">未署名</option>
              <option value="signing">署名中</option>
              <option value="completed">署名済み</option>
            </select>
          </label>
          <label className={styles.label}>
            新郎状態:
            <select
              className={styles.select}
              value={groomState}
              onChange={(e) => setGroomState(e.target.value as CeremonyState)}
              disabled={loading}
            >
              <option value="waiting">未署名</option>
              <option value="signing">署名中</option>
              <option value="completed">署名済み</option>
            </select>
          </label>
          <button
            className={`${styles.button} ${styles.primary}`}
            onClick={() => onForceState(brideState, groomState)}
            disabled={loading}
          >
            状態を強制変更
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>txidを公開</h3>
        <div className={styles.flexRow}>
          <button
            className={`${styles.button} ${styles.primary}`}
            onClick={() => onPublishTxid()}
            disabled={loading}
          >
            txidを公開
          </button>
          <button
            className={`${styles.button}`}
            onClick={() => onClearTxid()}
            disabled={loading}
          >
            txidを空にする
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>リアクション送信</h3>
        <div className={styles.flexRow}>
          <input
            className={styles.input}
            type="text"
            value={reactionMsg}
            onChange={(e) => setReactionMsg(e.target.value)}
            placeholder="リアクションメッセージ"
            disabled={loading}
          />
          <button
            className={`${styles.button} ${styles.primary}`}
            onClick={() => {
              onSendReaction(reactionMsg)
              setReactionMsg('')
            }}
            disabled={loading || !reactionMsg.trim() || !wsReady}
          >
            送信
          </button>
          {!wsReady && (
            <span className={styles.errorText}>WebSocket未接続</span>
          )}
        </div>
      </div>
    </div>
  )
}
