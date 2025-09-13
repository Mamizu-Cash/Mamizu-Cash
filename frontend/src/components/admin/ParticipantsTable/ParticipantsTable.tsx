import { useEffect, useState } from "react";
import { fetchVerifierList } from "../../../lib/verifierApi";
import styles from "./ParticipantsTable.module.css";

type Participant = {
  clientId: string;
  userName?: string;
  registerMessage?: string;
  connectedAt: string;
  lastActiveAt: string;
  isActive: boolean;
};

export type ParticipantsTableProps = {
  autoRefresh?: boolean;
  refreshInterval?: number;
};

export function ParticipantsTable({
  autoRefresh = false,
  refreshInterval = 30000,
}: ParticipantsTableProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadParticipants = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVerifierList();
      const participantList: Participant[] = Object.values(data).map((verifier) => ({
        ...verifier,
        joinedAt: verifier.joinedAt.toISOString(),
        connectedAt: verifier.connectedAt.toISOString(),
        lastActiveAt: verifier.lastActiveAt.toISOString(),
      }));
      setParticipants(participantList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "参加者データの取得に失敗しました");
      console.error("Failed to load participants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, [loadParticipants]);

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(loadParticipants, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, loadParticipants]);

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getConnectionStatus = (participant: Participant) => {
    if (!participant.isActive) {
      return { text: "切断", className: styles.statusDisconnected };
    }

    const lastActiveTime = new Date(participant.lastActiveAt).getTime();
    const now = Date.now();
    const timeDiff = now - lastActiveTime;

    if (timeDiff > 60000) {
      // 1分以上
      return { text: "非アクティブ", className: styles.statusInactive };
    }

    return { text: "接続中", className: styles.statusConnected };
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>参加者一覧</h2>
        <div className={styles.headerActions}>
          <span className={styles.participantCount}>{participants.length}名が参加中</span>
          <button
            className={`${styles.button} ${styles.refreshButton}`}
            onClick={loadParticipants}
            disabled={loading}
          >
            {loading ? "更新中..." : "更新"}
          </button>
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {loading && participants.length === 0 ? (
        <div className={styles.loadingContainer}>
          <p className={styles.loadingText}>参加者データを読み込み中...</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.headerRow}>
                <th className={styles.headerCell}>名前</th>
                <th className={styles.headerCell}>メッセージ</th>
                <th className={styles.headerCell}>接続状況</th>
                <th className={styles.headerCell}>接続時刻</th>
                <th className={styles.headerCell}>最終アクティブ</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant) => {
                const status = getConnectionStatus(participant);
                return (
                  <tr key={participant.clientId} className={styles.dataRow}>
                    <td className={styles.dataCell}>
                      <div className={styles.participantName}>
                        {participant.userName || <span className={styles.notSet}>未設定</span>}
                      </div>
                    </td>
                    <td className={styles.dataCell}>
                      <div className={styles.participantMessage}>
                        {participant.registerMessage || (
                          <span className={styles.notSet}>未設定</span>
                        )}
                      </div>
                    </td>
                    <td className={styles.dataCell}>
                      <span className={`${styles.status} ${status.className}`}>{status.text}</span>
                    </td>
                    <td className={styles.dataCell}>{formatDateTime(participant.connectedAt)}</td>
                    <td className={styles.dataCell}>{formatDateTime(participant.lastActiveAt)}</td>
                  </tr>
                );
              })}
              {participants.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>
                    参加者がいません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
