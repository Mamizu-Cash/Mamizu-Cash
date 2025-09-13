import { useState } from 'react'
import { ControlPanel } from '../admin/ControlPanel'
import { ParticipantsTable } from '../admin/ParticipantsTable'
import { TransactionBroadcast } from '../admin/TransactionBroadcast'
import { updateVerifierState } from '../../lib/verifierApi'
import toast from 'react-hot-toast'
import styles from './AdminScreen.module.css'

type CeremonyState = 'waiting' | 'signing' | 'completed'

export type AdminScreenProps = {
  onStartCeremony: () => void
  onForceState: (bride: CeremonyState, groom: CeremonyState) => void
  onPublishTxid: () => void
  onClearTxid: () => void
  onSendReaction: (message: string) => void
  loading?: boolean
  wsReady?: boolean
}

type TabType = 'control' | 'participants' | 'transaction'

export function AdminScreen({
  onStartCeremony,
  onForceState,
  onPublishTxid,
  onClearTxid,
  loading = false,
  onSendReaction,
  wsReady,
}: AdminScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>('control')

  const handleTransactionSent = async (txid: string) => {
    try {
      await updateVerifierState({ txid })
      toast.success(`トランザクションが送信されました: ${txid}`)
    } catch (error) {
      console.error('Failed to update verifier state with txid:', error)
      toast.error('txidの更新に失敗しました')
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>管理者画面</h1>

      {/* タブナビゲーション */}
      <div className={styles.tabNavigation}>
        <div
          className={`${styles.tab} ${activeTab === 'control' ? styles.active : ''}`}
          onClick={() => setActiveTab('control')}
        >
          制御
        </div>
        <div
          className={`${styles.tab} ${activeTab === 'participants' ? styles.active : ''}`}
          onClick={() => setActiveTab('participants')}
        >
          参加者一覧
        </div>
        <div
          className={`${styles.tab} ${activeTab === 'transaction' ? styles.active : ''}`}
          onClick={() => setActiveTab('transaction')}
        >
          トランザクション
        </div>
      </div>

      {/* タブコンテンツ */}
      <div className={styles.tabContent}>
        {activeTab === 'control' && (
          <ControlPanel
            onStartCeremony={onStartCeremony}
            onForceState={onForceState}
            onPublishTxid={onPublishTxid}
            onClearTxid={onClearTxid}
            onSendReaction={onSendReaction}
            loading={loading}
            wsReady={wsReady}
          />
        )}

        {activeTab === 'participants' && (
          <ParticipantsTable autoRefresh={true} refreshInterval={30000} />
        )}

        {activeTab === 'transaction' && (
          <TransactionBroadcast onTransactionSent={handleTransactionSent} />
        )}
      </div>
    </div>
  )
}
