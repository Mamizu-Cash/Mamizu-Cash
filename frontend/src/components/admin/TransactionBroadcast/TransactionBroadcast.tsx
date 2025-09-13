import { useState } from 'react'
import { CONSTANTS } from '../../../constants'
import styles from './TransactionBroadcast.module.css'

export type TransactionBroadcastProps = {
  onTransactionSent?: (txid: string) => void
}

type BroadcastResponse = {
  success: boolean
  txid?: string
  error?: string
}

export function TransactionBroadcast({
  onTransactionSent,
}: TransactionBroadcastProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [broadcasting, setBroadcasting] = useState(false)
  const [lastBroadcastResult, setLastBroadcastResult] =
    useState<BroadcastResponse | null>(null)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('クリップボードにコピーしました')
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      alert('コピーに失敗しました')
    }
  }

  const broadcastTransaction = async (): Promise<BroadcastResponse> => {
    try {
      // First try Blockstream API
      const blockstreamResponse = await fetch(
        'https://blockstream.info/api/tx',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: CONSTANTS.precomputedTransactionDataHex,
        },
      )

      if (blockstreamResponse.ok) {
        const txid = await blockstreamResponse.text()
        return { success: true, txid: txid.trim() }
      }

      // If Blockstream fails, try BlockCypher API
      const blockcypherResponse = await fetch(
        'https://api.blockcypher.com/v1/btc/main/txs/push',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tx: CONSTANTS.precomputedTransactionDataHex,
          }),
        },
      )

      if (blockcypherResponse.ok) {
        const result = await blockcypherResponse.json()
        return { success: true, txid: result.hash }
      }

      // If both fail, try one more API - Mempool.space
      const mempoolResponse = await fetch('https://mempool.space/api/tx', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: CONSTANTS.precomputedTransactionDataHex,
      })

      if (mempoolResponse.ok) {
        const txid = await mempoolResponse.text()
        return { success: true, txid: txid.trim() }
      }

      const errorText = await mempoolResponse.text()
      return { success: false, error: `送信に失敗しました: ${errorText}` }
    } catch (error) {
      console.error('Transaction broadcast failed:', error)
      return {
        success: false,
        error: `ネットワークエラー: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  const handleBroadcastConfirm = async () => {
    setShowConfirmDialog(false)
    setBroadcasting(true)
    setLastBroadcastResult(null)

    const result = await broadcastTransaction()
    setLastBroadcastResult(result)
    setBroadcasting(false)

    if (result.success && result.txid) {
      onTransactionSent?.(result.txid)
    }
  }

  const openExternalBroadcaster = () => {
    window.open(
      'https://mempool.space/tx/push',
      '_blank',
      'noopener,noreferrer',
    )
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>トランザクション送信</h2>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>事前計算済みトランザクション</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <label className={styles.infoLabel}>
              トランザクションハッシュ:
            </label>
            <div className={styles.hashContainer}>
              <code className={styles.hashText}>
                {CONSTANTS.precomputedTransactionHash}
              </code>
              <button
                className={`${styles.button} ${styles.copyButton}`}
                onClick={() =>
                  copyToClipboard(CONSTANTS.precomputedTransactionHash)
                }
              >
                コピー
              </button>
            </div>
          </div>

          <div className={styles.infoItem}>
            <label className={styles.infoLabel}>
              生トランザクションデータ:
            </label>
            <div className={styles.rawTxContainer}>
              <textarea
                className={styles.rawTxTextarea}
                readOnly
                value={CONSTANTS.precomputedTransactionDataHex}
              />
              <button
                className={`${styles.button} ${styles.copyButton}`}
                onClick={() =>
                  copyToClipboard(CONSTANTS.precomputedTransactionDataHex)
                }
              >
                生トランザクションをコピー
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.warningSection}>
        <div className={styles.warningBox}>
          <h4 className={styles.warningTitle}>⚠️ 重要な警告</h4>
          <p className={styles.warningText}>
            トランザクションを送信すると取り消しができません。実行前に以下を確認してください：
          </p>
          <ul className={styles.warningList}>
            <li>新郎新婦の署名が完了していること</li>
            <li>すべての参加者が検証を完了していること</li>
            <li>トランザクションハッシュが正しいこと</li>
            <li>ネットワーク状況が安定していること</li>
          </ul>
        </div>
      </div>

      <div className={styles.actionSection}>
        <div className={styles.actionButtons}>
          <button
            className={`${styles.button} ${styles.dangerButton}`}
            onClick={() => setShowConfirmDialog(true)}
            disabled={broadcasting}
          >
            {broadcasting ? '送信中...' : 'トランザクションを送信'}
          </button>

          <button
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={openExternalBroadcaster}
          >
            外部送信システムを開く
          </button>
        </div>

        {lastBroadcastResult && (
          <div
            className={`${styles.resultBox} ${lastBroadcastResult.success ? styles.success : styles.error}`}
          >
            {lastBroadcastResult.success ? (
              <div>
                <h4 className={styles.resultTitle}>✅ 送信成功</h4>
                <p>トランザクションが正常に送信されました。</p>
                <p>
                  <strong>TXID:</strong> <code>{lastBroadcastResult.txid}</code>
                </p>
                <a
                  href={`https://mempool.space/tx/${lastBroadcastResult.txid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.explorerLink}
                >
                  エクスプローラーで確認
                </a>
              </div>
            ) : (
              <div>
                <h4 className={styles.resultTitle}>❌ 送信失敗</h4>
                <p>{lastBroadcastResult.error}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showConfirmDialog && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>
              トランザクション送信の最終確認
            </h3>
            <div className={styles.modalContent}>
              <p>本当にトランザクションを送信しますか？</p>
              <p>
                <strong>この操作は取り消しできません。</strong>
              </p>
              <div className={styles.confirmDetails}>
                <p>
                  <strong>送信するトランザクション:</strong>
                </p>
                <code className={styles.confirmHash}>
                  {CONSTANTS.precomputedTransactionHash}
                </code>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button
                className={`${styles.button} ${styles.cancelButton}`}
                onClick={() => setShowConfirmDialog(false)}
              >
                キャンセル
              </button>
              <button
                className={`${styles.button} ${styles.dangerButton}`}
                onClick={handleBroadcastConfirm}
              >
                送信する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
