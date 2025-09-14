import { Bitcoin, Facebook, Gift, MessageSquare, Twitter } from "lucide-react";
import { Background, Button, Panel, Text } from "../../ui/index";
import commonStyles from "../CommonScreenStyles.module.css";
import styles from "./FinishScreen.module.css";

export type FinishScreenProps = {
  nickname?: string;
  onShare?: (
    platform: "twitter" | "facebook" | "line" | "misskey_misskey_io" | "misskey_key_aoki_app",
  ) => void;
  onSaveMoments?: () => void;
};

export function FinishScreen(props: FinishScreenProps) {
  const { nickname, onShare, onSaveMoments } = props;

  const handleShare = (
    platform: "twitter" | "facebook" | "line" | "misskey_misskey_io" | "misskey_key_aoki_app",
  ) => {
    onShare?.(platform);
  };

  return (
    <div className={`${commonStyles.container} ${styles.container}`}>
      <Background />
      <div className={`${commonStyles.mainContainer} ${styles.mainContainer}`}>
        <Panel size="medium" className={`${commonStyles.panel} ${styles.panel}`}>
          {/* Header Section */}
          <header className={`${commonStyles.header} ${styles.header}`}>
            <div className={styles.celebrationIcons}>
              <span className={styles.celebrationIcon}>🎊</span>
              <span className={styles.celebrationIcon}>💕</span>
              <span className={styles.celebrationIcon}>🎉</span>
            </div>
            <Text
              variant="h2"
              color="primary"
              align="center"
              weight="semibold"
              className={styles.title}
            >
              ありがとうございました
            </Text>
            <Text variant="bodyLarge" color="secondary" align="center" className={styles.subtitle}>
              {nickname ? `${nickname}さん、` : ""}永遠の証人として
              <br />
              この特別な瞬間に立ち会っていただき、
              <br />
              心より感謝申し上げます
            </Text>
          </header>

          {/* Certificate Section */}
          <main className={styles.mainContent}>
            {/* Share Section */}
            <section className={styles.shareSection}>
              <Text
                variant="label"
                color="primary"
                weight="semibold"
                align="center"
                className={styles.sectionTitle}
              >
                この感動をシェア
              </Text>

              <div className={styles.shareButtons}>
                <Button
                  variant="secondary"
                  onClick={() => handleShare("twitter")}
                  icon={<Twitter size={16} color="#1DA1F2" />}
                  aria-label="共有する: Twitter"
                  className={styles.shareButton}
                >
                  Twitter
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleShare("facebook")}
                  icon={<Facebook size={16} color="#1877F2" />}
                  aria-label="共有する: Facebook"
                  className={styles.shareButton}
                >
                  Facebook
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleShare("line")}
                  icon={<MessageSquare size={16} color="#06C755" />}
                  aria-label="共有する: LINE"
                  className={styles.shareButton}
                >
                  LINE
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleShare("misskey_misskey_io")}
                  icon={<MessageSquare size={16} color="#86b300" />}
                  aria-label="共有する: Misskey (misskey.io)"
                  className={styles.shareButton}
                >
                  Misskey.io
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleShare("misskey_key_aoki_app")}
                  icon={<MessageSquare size={16} color="#86b300" />}
                  aria-label="共有する: Misskey (Aokey)"
                  className={styles.shareButton}
                >
                  Aokey
                </Button>
              </div>
            </section>

            {/* Memory Save Section */}
            <section className={styles.memorySection}>
              <Button
                variant="bride"
                size="large"
                onClick={onSaveMoments}
                icon={<Gift size={18} />}
                aria-label="NFTを取得"
                className={styles.saveButton}
              >
                暗号資産でご祝儀を送って
                <br />
                NFTをゲット
              </Button>
              <Text variant="caption" color="tertiary" align="center" className={styles.saveNote}>
                証明書と記念写真のNFTをゲットできます
              </Text>
            </section>
          </main>

          {/* Footer */}
          <footer className={styles.footer}>
            <div className={styles.footerContent}>
              <Text variant="caption" color="tertiary" align="center">
                ブロックチェーン技術による永続的な記録
              </Text>
              <Text variant="caption" color="brand" align="center" weight="medium">
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Bitcoin size={14} aria-hidden="true" /> Powered by Bitcoin Network
                </span>
              </Text>
            </div>
          </footer>
        </Panel>
      </div>
    </div>
  );
}
