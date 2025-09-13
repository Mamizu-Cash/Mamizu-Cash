import { CONSTANTS } from "../../../constants";
import {
  Avatar,
  Background,
  Badge,
  Button,
  Carousel,
  IconButton,
  Panel,
  Spinner,
  Text,
} from "../../ui/index";
import commonStyles from "../CommonScreenStyles.module.css";
import styles from "./CeremonyScreen.module.css";

// 署名状態（従来: waiting|signing|completed）をより意味的な pending|signing|signed に変更
export type ParticipantSigningStatus = "pending" | "signing" | "signed";

// 呼び出し側から渡す直交した軸の props
export interface CeremonyScreenProps {
  ceremonyStarted: boolean;
  signing: {
    bride: ParticipantSigningStatus;
    groom: ParticipantSigningStatus;
  };
  // ブロックチェーン記録フェーズ
  recording: "idle" | "recording" | "completed";
  witnessCount: number;
  txid?: string | null;
  onReaction?: (reaction: string) => void;
  onCelebrate?: () => void;
  /**
   * 旧 API 互換用（deprecated）。旧 props がもし渡された場合は内部で正規化。
   * 新しい呼び出し側では使用しない。
   */
  // @deprecated
  status?: any;
  // @deprecated
  brideStatus?: "waiting" | "signing" | "completed";
  // @deprecated
  groomStatus?: "waiting" | "signing" | "completed";
}

const REACTIONS = ["🎉", "👏", "❤️", "🌟", "✨", "🥳"];

const TECH_SLIDES = [
  {
    icon: "🔗",
    title: "ブロックチェーン技術",
    content: "世界で最も安全で分散化されたネットワークに永久保存されます",
  },
  {
    icon: "🔐",
    title: "暗号学的証明",
    content: "数学的に改ざん不可能な電子署名で、真正性が保証されます",
  },
  {
    icon: "🌍",
    title: "グローバル検証",
    content: "世界中の誰でも、いつでも記録の真正性を確認できます",
  },
  {
    icon: "⏳",
    title: "永続性",
    content: "何世代にもわたって保存され、歴史の証人となります",
  },
];

// 表示用フェーズ（UI 内部 derivation）
type DisplayPhase =
  | "waiting"
  | "bride-signing"
  | "groom-signing"
  | "both-signing"
  | "signing-pending"
  | "ready-to-record"
  | "recording"
  | "completed";

export function CeremonyScreen(rawProps: CeremonyScreenProps) {
  // 旧 props からの自動正規化（後方互換）。新形式ならそのまま使う。
  const props = normalizeIncomingProps(rawProps);
  const { ceremonyStarted, signing, recording, txid, onReaction, onCelebrate } = props;

  const brideStatus = signing.bride;
  const groomStatus = signing.groom;

  const phase: DisplayPhase = deriveDisplayPhase(
    ceremonyStarted,
    brideStatus,
    groomStatus,
    recording,
  );

  const handleReaction = (reaction: string) => {
    onReaction?.(reaction);
  };

  const handleCelebrate = () => {
    onCelebrate?.();
  };

  const getStatusMessage = () => {
    switch (phase) {
      case "waiting":
        return "儀式の開始をお待ちください";
      case "bride-signing":
        return "新婦が署名中です";
      case "groom-signing":
        return "新郎が署名中です";
      case "both-signing":
        return "両者が署名中です";
      case "signing-pending":
        return "署名待ちです";
      case "ready-to-record":
        return "記録準備完了";
      case "recording":
        return "ブロックチェーンに記録中です";
      case "completed":
        return "記録が完了しました！";
      default:
        return "状況を確認中です";
    }
  };

  const getStatusColor = () => {
    switch (phase) {
      case "waiting":
        return "secondary";
      case "bride-signing":
        return "accent";
      case "groom-signing":
        return "info";
      case "both-signing":
        return "brand";
      case "signing-pending":
        return "secondary";
      case "ready-to-record":
        return "accent";
      case "recording":
        return "warning";
      case "completed":
        return "success";
      default:
        return "secondary";
    }
  };

  const shouldShowReactions = true;
  const shouldShowCelebration = phase === "completed" && Boolean(txid);

  return (
    <div className={`${commonStyles.container} ${styles.container}`}>
      <Background />
      <div className={`${commonStyles.mainContainer} ${styles.mainContainer}`}>
        <Panel size="medium" className={`${commonStyles.panel} ${styles.panel}`}>
          {/* Header Section */}
          <header className={`${commonStyles.header} ${styles.header}`}>
            <div className={styles.avatarSection}>
              <Avatar size="large" variant="accent">
                💒
              </Avatar>
            </div>
            <Text
              variant="h3"
              color="primary"
              align="center"
              weight="semibold"
              className={styles.title}
            >
              誓いの瞬間
            </Text>
            <Badge variant={getStatusColor() as any} size="large" className={styles.statusBadge}>
              {getStatusMessage()}
            </Badge>
          </header>

          {/* Main Content - Status Display */}
          <main className={styles.mainContent}>
            {/* Couple Status */}
            <div className={styles.coupleStatus}>
              {/* Bride Status */}
              <div className={styles.personStatus}>
                <Avatar
                  size="large"
                  variant={
                    brideStatus === "signed"
                      ? "success"
                      : brideStatus === "signing"
                        ? "accent"
                        : "secondary"
                  }
                >
                  👰
                </Avatar>
                <Text
                  variant="label"
                  weight="semibold"
                  color={
                    brideStatus === "signed"
                      ? "success"
                      : brideStatus === "signing"
                        ? "accent"
                        : "secondary"
                  }
                  align="center"
                  className={styles.personLabel}
                >
                  新婦
                </Text>
                <div className={styles.statusIndicator}>
                  {brideStatus === "signing" && <Spinner size="small" variant="gradient" />}
                  {brideStatus === "signed" && (
                    <Text variant="bodySmall" color="success" weight="medium">
                      署名済み
                    </Text>
                  )}
                  {brideStatus === "pending" && (
                    <Text variant="bodySmall" color="secondary">
                      待機中
                    </Text>
                  )}
                </div>
              </div>
              {/* Heart Animation */}
              <div className={styles.heartSection}>
                <div
                  className={`${styles.heart} ${phase === "both-signing" ? styles.heartPulse : ""}`}
                >
                  💕
                </div>
              </div>
              {/* Groom Status */}
              <div className={styles.personStatus}>
                <Avatar
                  size="large"
                  variant={
                    groomStatus === "signed"
                      ? "success"
                      : groomStatus === "signing"
                        ? "primary"
                        : "secondary"
                  }
                >
                  🤵
                </Avatar>
                <Text
                  variant="label"
                  weight="semibold"
                  color={
                    groomStatus === "signed"
                      ? "success"
                      : groomStatus === "signing"
                        ? "info"
                        : "secondary"
                  }
                  align="center"
                  className={styles.personLabel}
                >
                  新郎
                </Text>
                <div className={styles.statusIndicator}>
                  {groomStatus === "signing" && <Spinner size="small" variant="gradient" />}
                  {groomStatus === "signed" && (
                    <Text variant="bodySmall" color="success" weight="medium">
                      署名済み
                    </Text>
                  )}
                  {groomStatus === "pending" && (
                    <Text variant="bodySmall" color="secondary">
                      待機中
                    </Text>
                  )}
                </div>
              </div>
            </div>
            {/* Certificate to be signed section */}

            <div className={styles.certificateSection}>
              <Button
                variant="secondary"
                onClick={() => {
                  window.open(CONSTANTS.documentUrl);
                }}
                className={styles.signButton}
              >
                婚姻証明書を表示
              </Button>
            </div>

            {/* Recording Status */}
            {phase === "recording" && (
              <div className={styles.recordingSection}>
                <Spinner size="large" variant="bitcoin" />
                <Text
                  variant="bodyLarge"
                  color="brand"
                  align="center"
                  weight="medium"
                  className={styles.recordingText}
                >
                  ブロックチェーンに永久記録中...
                </Text>
              </div>
            )}

            {/* Completion Celebration */}
            {phase === "completed" && (
              <div className={styles.celebrationSection}>
                <div className={styles.celebrationIcon}>🎊</div>
                <Text
                  variant="h4"
                  color="success"
                  align="center"
                  weight="semibold"
                  className={styles.celebrationText}
                >
                  おめでとうございます！
                </Text>
                <Text
                  variant="body"
                  color="secondary"
                  align="center"
                  className={styles.celebrationSubText}
                >
                  永遠の愛が刻まれました
                </Text>
                {txid && (
                  <Text
                    variant="bodySmall"
                    color="secondary"
                    align="center"
                    className={styles.txidText}
                  >
                    取引ID: {txid}
                  </Text>
                )}
              </div>
            )}
          </main>

          {/* Interactive Section */}
          {shouldShowReactions && (
            <section className={styles.interactionSection}>
              <Text
                variant="label"
                color="primary"
                align="center"
                weight="medium"
                className={styles.interactionTitle}
              >
                お祝いの気持ちを送りましょう
              </Text>
              <div className={styles.reactionButtons}>
                {REACTIONS.map((reaction) => (
                  <IconButton
                    key={reaction}
                    onClick={() => handleReaction(reaction)}
                    aria-label={`Send ${reaction} reaction`}
                  >
                    {reaction}
                  </IconButton>
                ))}
              </div>
            </section>
          )}

          {/* Celebration Button */}
          {shouldShowCelebration && (
            <section className={styles.celebrationButtonSection}>
              <Button
                variant="primary"
                size="large"
                onClick={handleCelebrate}
                className={styles.celebrationButton}
              >
                次へ
              </Button>
            </section>
          )}

          {/* Technology Education Carousel */}
          <section className={styles.educationSection}>
            <Carousel
              size="small"
              autoPlay={true}
              autoPlayInterval={6000}
              showIndicators={true}
              showArrows={true}
              className={styles.techCarousel}
            >
              {TECH_SLIDES.map((slide) => (
                <Carousel.Template
                  key={slide.title}
                  icon={<span className={styles.slideIcon}>{slide.icon}</span>}
                  title={slide.title}
                  className={styles.carouselSlide}
                >
                  {slide.content}
                </Carousel.Template>
              ))}
            </Carousel>
          </section>
        </Panel>
      </div>
    </div>
  );
}

// 旧 props が渡された場合に新形式へ寄せる
function normalizeIncomingProps(p: CeremonyScreenProps): Required<CeremonyScreenProps> {
  // 新形式が揃っているか判定
  const hasNew =
    typeof p.ceremonyStarted === "boolean" &&
    p.signing != null &&
    typeof p.signing === "object" &&
    typeof p.signing.bride === "string" &&
    typeof p.signing.groom === "string" &&
    typeof p.recording === "string";

  if (hasNew) {
    return p as Required<CeremonyScreenProps>;
  }

  // 旧形式 -> 新形式変換
  const legacyBride = (p as any).brideStatus as "waiting" | "signing" | "completed";
  const legacyGroom = (p as any).groomStatus as "waiting" | "signing" | "completed";
  const legacyStatus = (p as any).status as string;

  const mapParticipant = (
    s: "waiting" | "signing" | "completed" | undefined,
  ): ParticipantSigningStatus => {
    if (s === "signing") return "signing";
    if (s === "completed") return "signed";
    return "pending";
  };

  // recording 推定
  let recording: "idle" | "recording" | "completed" = "idle";
  if (legacyStatus === "recording") recording = "recording";
  else if (legacyStatus === "completed") recording = "completed";

  const ceremonyStarted = legacyStatus !== "waiting";

  return {
    ceremonyStarted,
    signing: {
      bride: mapParticipant(legacyBride),
      groom: mapParticipant(legacyGroom),
    },
    recording,
    witnessCount: p.witnessCount ?? 0,
    txid: p.txid ?? null,
    onReaction: p.onReaction ?? (() => {}),
    onCelebrate: p.onCelebrate ?? (() => {}),
    status: legacyStatus,
    brideStatus: legacyBride,
    groomStatus: legacyGroom,
  };
}

function deriveDisplayPhase(
  ceremonyStarted: boolean,
  bride: ParticipantSigningStatus,
  groom: ParticipantSigningStatus,
  recording: "idle" | "recording" | "completed",
): DisplayPhase {
  if (!ceremonyStarted) return "waiting";
  if (recording === "recording") return "recording";
  if (recording === "completed") return "completed";

  const brideSigning = bride === "signing";
  const groomSigning = groom === "signing";
  const brideSigned = bride === "signed";
  const groomSigned = groom === "signed";

  if (!brideSigned || !groomSigned) {
    if (brideSigning && groomSigning) return "both-signing";
    if (brideSigning) return "bride-signing";
    if (groomSigning) return "groom-signing";
    return "signing-pending";
  }
  // 両者署名完了: 記録前
  return "ready-to-record";
}
