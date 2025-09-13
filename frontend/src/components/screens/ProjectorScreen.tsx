import { useEffect, useState } from "react";
import logoWide from "../../assets/logo-wide.svg";
import { Avatar, Background, Button, Panel, QrCode } from "../ui/index";
import commonStyles from "./CommonScreenStyles.module.css";
import styles from "./ProjectorScreen.module.css";

export type ProjectorScreenProps = {
  brideStatus: "completed" | "in-progress" | "waiting";
  groomStatus: "completed" | "in-progress" | "waiting";
  witnessCount: number;
  networkReady: boolean;
  qrData?: string; // QRコードに埋め込むデータ
  txid?: string | null; // トランザクションID
  reactions?: { id: number; message: string; x: number }[]; // リアクション配列
};

export function ProjectorScreen(props: ProjectorScreenProps) {
  const {
    brideStatus,
    groomStatus,
    witnessCount,
    networkReady,
    qrData = "https://event.bitconin.aoki.app",
    txid = null,
    reactions = [],
  } = props;

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("ja-JP", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(timeString);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${commonStyles.container} ${styles.container}`}>
      <Background />
      <div className={`${commonStyles.mainContainer} ${styles.mainContainer}`}>
        <Panel size="large" className={`${commonStyles.panel} ${styles.panel}`}>
          {/* Header Section */}
          <header className={`${styles.header}`}>
            <div className={styles.brandGroup}>
              <img src={logoWide} alt="ビット婚姻" className={styles.brandLogo} />
            </div>
            <Button variant="timeDisplay">{currentTime}</Button>
          </header>

          {/* Main Content Section */}
          <main className={styles.mainContent}>
            {/* Bride Status */}
            <section className={styles.person}>
              <div className={styles.avatarContainer}>
                <Avatar size="huge" variant="accent">
                  👰
                </Avatar>
              </div>
              <div className={`${styles.personLabel} ${styles.brideLabel}`}>新婦</div>
              <div
                className={`${styles.personStatus} ${
                  brideStatus === "completed"
                    ? styles.statusCompleted
                    : brideStatus === "in-progress"
                      ? styles.statusInProgress
                      : ""
                }`}
              >
                {brideStatus === "completed"
                  ? "署名済み"
                  : brideStatus === "in-progress"
                    ? "署名中"
                    : "未署名"}
              </div>
            </section>

            {/* QR Code Section */}
            <section className={styles.qrSection}>
              <h2 className={styles.qrTitle}>証人参加</h2>
              {txid ? (
                <p className={styles.qrMessage}>
                  うまく検証できない場合、
                  <br />
                  　再度QRコードをスキャンしてください
                </p>
              ) : (
                <p className={styles.qrMessage}>
                  QRコードをスキャンして
                  <br />
                  二人の永遠の証人になってください
                </p>
              )}
              <Panel>
                <div className={styles.qrCode}>
                  {qrData && <QrCode text={qrData} options={{ margin: 1 }} />}
                </div>
              </Panel>
            </section>

            {/* Groom Status */}
            <section className={styles.person}>
              <div className={styles.avatarContainer}>
                <Avatar size="huge" variant="primary">
                  🤵
                </Avatar>
              </div>
              <div className={`${styles.personLabel} ${styles.groomLabel}`}>新郎</div>
              <div
                className={`${styles.personStatus} ${
                  groomStatus === "completed"
                    ? styles.statusCompleted
                    : groomStatus === "in-progress"
                      ? styles.statusInProgress
                      : ""
                }`}
              >
                {groomStatus === "completed"
                  ? "署名済み"
                  : groomStatus === "in-progress"
                    ? "署名中"
                    : "未署名"}
              </div>
            </section>
          </main>
          <section className={styles.bottomLabel}>
            <div className={styles.qrInstruction}>{txid ? txid : "Scan to Witness"}</div>
          </section>

          {/* Footer Section */}
          <footer className={styles.footer}>
            <div className={styles.witnessInfo}>
              {witnessCount > 1 ? `証人 ${witnessCount}名参加` : ""}
            </div>
            <div className={styles.networkStatus}>{networkReady ? "Network Ready" : ""}</div>
          </footer>
        </Panel>

        <div className={styles.reactionArea}>
          {reactions.map((r) => (
            <div
              key={r.id}
              className={styles.reactionPop}
              style={{
                left: `${r.x}%`,
              }}
            >
              {r.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
