import { Award, ExternalLink, FileCheck, Key, Shield, Users, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import AokiAppLogo from "../../../assets/aokiapp.svg";
import { CONSTANTS } from "../../../constants";
import { base64ToArrayBuffer, parseX509Certificate } from "../../../lib/cmsVerifier";
import {
  Avatar,
  Background,
  Badge,
  Button,
  CopyButton,
  Input,
  Panel,
  Spinner,
  Text,
} from "../../ui/index";
import commonStyles from "../CommonScreenStyles.module.css";
import styles from "./VerifyScreen.module.css";

// 公開鍵情報を抽出するヘルパー関数
function extractPublicKeyInfo(certBase64: string): string {
  try {
    const certBuffer = base64ToArrayBuffer(certBase64);
    const parsed = parseX509Certificate(certBuffer);
    // 公開鍵の最初の16バイトをHexで表示
    const publicKeyBytes = new Uint8Array(parsed.publicKeyDer);
    return Array.from(publicKeyBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
  } catch (error) {
    console.error("Failed to extract public key info:", error);
    return "データ解析エラー";
  }
}

export type VerificationData = {
  txid: string;
  documentHash: string;
  cmsHash: string;
};

export type VerifyScreenProps = {
  verificationData: VerificationData;
  onVerify?: () => Promise<boolean>;
  onContinue?: () => void;
};

// 証明書情報の型定義
interface CertificateInfo {
  name: string;
  role: string;
  publicKey: string;
  certificateData: string;
  isValid: boolean;
  issuer: string;
  subject: string;
  certifier: string;
  validity: {
    notBefore: string;
    notAfter: string;
  };
}

export function VerifyScreen(props: VerifyScreenProps) {
  const { verificationData, onVerify, onContinue } = props;

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "verifying" | "success" | "error"
  >("pending");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateInfo | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [hasReviewedCertificate, setHasReviewedCertificate] = useState(false);
  const [verifyClickCount, setVerifyClickCount] = useState(0);
  const [highlightCouple, setHighlightCouple] = useState(false);

  // 証明書情報を解析
  const certificateInfos: CertificateInfo[] = [
    {
      name: CONSTANTS.names.bride,
      role: "新婦",
      publicKey: extractPublicKeyInfo(CONSTANTS.certs.bride),
      certificateData: CONSTANTS.certs.bride,
      isValid: true,
      issuer: CONSTANTS.names.groom,
      subject: CONSTANTS.names.bride,
      certifier: "株式会社AokiApp",
      validity: {
        notBefore: "2025年8月21日",
        notAfter: "2026年8月21日",
      },
    },
    {
      name: CONSTANTS.names.groom,
      role: "新郎",
      publicKey: extractPublicKeyInfo(CONSTANTS.certs.groom),
      certificateData: CONSTANTS.certs.groom,
      isValid: true,
      issuer: CONSTANTS.names.bride,
      subject: CONSTANTS.names.groom,
      certifier: "株式会社AokiApp",
      validity: {
        notBefore: "2025年8月21日",
        notAfter: "2026年8月21日",
      },
    },
  ];

  const handleContinue = useCallback(() => {
    onContinue?.();
  }, [onContinue]);

  // 5秒後に自動で次の画面に遷移
  useEffect(() => {
    if (verificationStatus === "success") {
      const timer = setTimeout(() => {
        handleContinue();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [verificationStatus, handleContinue]);

  const handleVerification = async () => {
    // Gate: require certificate review unless user clicked 3 times
    if (!hasReviewedCertificate && verifyClickCount < 2) {
      setVerifyClickCount((c) => c + 1);
      // Flash bride/groom area
      setHighlightCouple(true);
      setTimeout(() => setHighlightCouple(false), 1200);
      return;
    }
    // If third click without review, allow skipping
    if (!hasReviewedCertificate && verifyClickCount >= 2) {
      setVerifyClickCount((c) => c + 1);
    }
    setIsVerifying(true);
    setVerificationStatus("verifying");
    setVerificationMessage("記録の真正性を検証中...");

    try {
      const isValid = await onVerify?.();

      if (isValid) {
        setVerificationStatus("success");
        setVerificationMessage("記録の真正性が確認されました！");
      } else {
        setVerificationStatus("error");
        setVerificationMessage("検証中にエラーが発生しました");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setVerificationStatus("error");
      setVerificationMessage("検証に失敗しました。もう一度お試しください。");
    } finally {
      setIsVerifying(false);
    }
  };

  // 証明書モーダルを開く
  const openCertificateModal = (certificate: CertificateInfo) => {
    setSelectedCertificate(certificate);
    dialogRef.current?.showModal();
    // Mark certificate as reviewed when opened
    setHasReviewedCertificate(true);
  };

  // 証明書モーダルを閉じる
  const closeCertificateModal = () => {
    dialogRef.current?.close();
    setSelectedCertificate(null);
  };

  // Removed timestamp formatting as timestamp field was dropped

  const getStatusBadgeVariant = () => {
    switch (verificationStatus) {
      case "pending":
        return "secondary";
      case "verifying":
        return "warning";
      case "success":
        return "success";
      case "error":
        return "error";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case "pending":
        return "🔍";
      case "verifying":
        return "⏳";
      case "success":
        return "✅";
      case "error":
        return "❌";
      default:
        return "🔍";
    }
  };

  return (
    <div className={`${commonStyles.container} ${styles.container}`}>
      <Background />
      <div className={`${commonStyles.mainContainer} ${styles.mainContainer}`}>
        <Panel size="medium" className={`${commonStyles.panel} ${styles.panel}`}>
          {/* Header Section */}
          <header className={`${commonStyles.header} ${styles.header}`}>
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
              記録の検証
            </Text>
            <Badge
              variant={getStatusBadgeVariant() as any}
              size="large"
              className={styles.statusBadge}
            >
              {verificationMessage || "記録詳細を確認してください"}
            </Badge>
          </header>

          {/* Main Content - Record Details */}
          <main className={styles.mainContent}>
            {/* Transaction ID only (reduced) */}
            <section className={styles.recordSection}>
              <Text
                variant="label"
                color="primary"
                weight="semibold"
                className={styles.sectionTitle}
              >
                トランザクションハッシュ
              </Text>
              <div className={styles.recordDetails}>
                <div className={styles.recordItem}>
                  <div className={styles.copyableItem}>
                    <Text variant="mono" color="primary" className={styles.txid} truncate>
                      {verificationData.txid}
                    </Text>
                    <CopyButton textToCopy={verificationData.txid} className={styles.copyButton} />
                  </div>
                </div>
              </div>
            </section>

            {/* Document Hash */}
            <section className={styles.recordSection}>
              <Text
                variant="label"
                color="primary"
                weight="semibold"
                className={styles.sectionTitle}
              >
                誓約文書PDFファイルのハッシュ
              </Text>

              <div className={styles.copyableItem}>
                <Text
                  variant="monoSmall"
                  color="secondary"
                  className={styles.documentHash}
                  truncate
                >
                  {verificationData.documentHash}
                </Text>
                <CopyButton
                  textToCopy={verificationData.documentHash}
                  className={styles.copyButton}
                />
              </div>
            </section>

            {/* CMS Hash */}
            <section className={styles.recordSection}>
              <Text
                variant="label"
                color="primary"
                weight="semibold"
                className={styles.sectionTitle}
              >
                ブロックチェーンにコミットされるCMSハッシュ
              </Text>

              <div className={styles.copyableItem}>
                <Text
                  variant="monoSmall"
                  color="secondary"
                  className={styles.documentHash}
                  truncate
                >
                  {verificationData.cmsHash}
                </Text>
                <CopyButton textToCopy={verificationData.cmsHash} className={styles.copyButton} />
              </div>
            </section>

            {/* Certificate Signers Section */}
            <section className={styles.recordSection}>
              <div className={styles.coupleStatus}>
                {certificateInfos.map((cert) => (
                  <div
                    key={cert.name}
                    className={`${styles.personStatus} ${highlightCouple ? styles.personStatusFlash : ""}`}
                    onClick={() => openCertificateModal(cert)}
                  >
                    <Avatar
                      size="large"
                      variant={cert.isValid ? "success" : "error"}
                      style={{ cursor: "pointer" }}
                    >
                      {cert.role === "新婦" ? "👰" : "🤵"}
                    </Avatar>
                    <Text
                      variant="bodySmall"
                      color="secondary"
                      align="center"
                      className={styles.personName}
                    >
                      {cert.name}
                    </Text>
                  </div>
                ))}
              </div>
              <Text variant="bodySmall" color="secondary" align="center">
                アイコンをクリックして証明書詳細を表示
              </Text>
            </section>

            {/* Verification Process */}
            {verificationStatus === "verifying" && (
              <section className={styles.verificationSection}>
                <Spinner size="large" variant="bitcoin" />
                <Text variant="body" color="brand" align="center" weight="medium">
                  ブロックチェーン上の記録を検証中...
                </Text>
                <Text
                  variant="bodySmall"
                  color="secondary"
                  align="center"
                  className={styles.verificationNote}
                >
                  暗号学的な検証処理を実行しています
                </Text>
              </section>
            )}

            {/* Verification Success */}
            {verificationStatus === "success" && (
              <section className={styles.successSection}>
                <div className={styles.successIcon}>✅</div>
                <Text variant="h4" color="success" align="center" weight="semibold">
                  検証完了
                </Text>
                <Text
                  variant="body"
                  color="secondary"
                  align="center"
                  className={styles.successMessage}
                >
                  記録の改ざん不可能性と真正性が
                  <br />
                  数学的に証明されました
                </Text>
              </section>
            )}

            {/* External explorer link removed as per request */}
            {/* Action Buttons */}
            <section className={styles.actionSection}>
              {verificationStatus === "pending" && (
                <>
                  <Button
                    variant="primary"
                    size="large"
                    loading={isVerifying}
                    onClick={handleVerification}
                    icon="🔍"
                    className={
                      hasReviewedCertificate || verifyClickCount >= 2
                        ? styles.verifyButtonActive
                        : styles.verifyButtonInactive
                    }
                  >
                    {hasReviewedCertificate || verifyClickCount >= 2
                      ? "記録を検証する"
                      : "証明書を確認してから検証"}
                  </Button>
                  <Button
                    variant="secondary"
                    size="large"
                    icon={<ExternalLink size={18} />}
                    style={{ marginTop: 16 }}
                    onClick={() => {
                      const url = CONSTANTS.blockExplorer.tx.replace("xxx", verificationData.txid);
                      window.open(url, "_blank");
                    }}
                  >
                    エクスプローラで表示
                  </Button>
                </>
              )}

              {verificationStatus === "success" && (
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleContinue}
                  icon="🎉"
                  className={styles.continueButton}
                >
                  次へ
                </Button>
              )}

              {verificationStatus === "error" && (
                <>
                  <Button
                    variant="secondary"
                    size="large"
                    onClick={handleVerification}
                    icon="🔄"
                    className={styles.retryButton}
                  >
                    再試行
                  </Button>
                  <Button
                    variant="primary"
                    size="large"
                    onClick={handleContinue}
                    className={styles.skipButton}
                  >
                    スキップして続行
                  </Button>
                </>
              )}
            </section>
          </main>

          {/* Footer */}
          <footer className={styles.footer}>
            <div className={styles.footerContent}>
              <Text variant="caption" color="tertiary" align="center">
                ブロックチェーン技術による永続的な記録
              </Text>
              <Text variant="caption" color="brand" align="center" weight="medium">
                Powered by AokiApp Inc.
              </Text>
            </div>
          </footer>
        </Panel>

        {/* Certificate Details Modal */}
        <dialog
          ref={dialogRef}
          className={styles.modal}
          onClick={(e) => {
            if (e.target === dialogRef.current) {
              closeCertificateModal();
            }
          }}
        >
          {selectedCertificate && (
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <div className={styles.modalTitleSection}>
                  <Avatar size="medium" variant="success">
                    {selectedCertificate.role === "新婦" ? "👰" : "🤵"}
                  </Avatar>
                  <div>
                    <Text variant="h3" color="primary" weight="bold">
                      {selectedCertificate.name}
                    </Text>
                    <Text variant="body" color="secondary">
                      {selectedCertificate.role}の電子証明書
                    </Text>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="medium"
                  onClick={closeCertificateModal}
                  className={styles.closeButton}
                >
                  <X size={18} />
                </Button>
              </div>

              <div className={styles.modalBody}>
                {/* AokiApp認証セクション */}
                <div className={styles.certifierSection}>
                  <div className={styles.aokiAppLogo}>
                    <img src={AokiAppLogo} alt="AokiApp" className={styles.logoImage} />
                  </div>
                  <div className={styles.certifierInfo}>
                    <Text
                      variant="body"
                      color="secondary"
                      align="center"
                      style={{ lineHeight: "1.6" }}
                    >
                      この証明書は株式会社AokiAppが責任を持って認証しています。
                    </Text>
                  </div>
                </div>

                {/* 証明書の概要 */}
                <div className={styles.certificateOverview}>
                  <Text variant="h4" color="primary" weight="semibold">
                    <FileCheck size={16} />
                    証明書情報
                  </Text>

                  <div className={styles.certificateGrid}>
                    <div className={styles.certificateItem}>
                      <Text variant="label" color="secondary" weight="medium">
                        証明書所有者
                      </Text>
                      <Text variant="body" color="primary" weight="semibold">
                        {selectedCertificate.subject}
                      </Text>
                    </div>

                    <div className={styles.certificateItem}>
                      <Text variant="label" color="secondary" weight="medium">
                        証明書発行者
                      </Text>
                      <Text variant="body" color="primary" weight="semibold">
                        {selectedCertificate.issuer}
                      </Text>
                    </div>

                    <div className={styles.certificateItem}>
                      <Text variant="label" color="secondary" weight="medium">
                        認証機関
                      </Text>
                      <Text variant="body" color="brand" weight="bold">
                        <Award size={14} />
                        {selectedCertificate.certifier}
                      </Text>
                    </div>

                    <div className={styles.certificateItem}>
                      <Text variant="label" color="secondary" weight="medium">
                        有効期間
                      </Text>
                      <Text variant="body" color="primary">
                        {selectedCertificate.validity.notBefore} ～{" "}
                        {selectedCertificate.validity.notAfter}
                      </Text>
                    </div>

                    <div className={styles.certificateItem}>
                      <Text variant="label" color="secondary" weight="medium">
                        検証状態
                      </Text>
                      <Badge variant={selectedCertificate.isValid ? "success" : "error"}>
                        <Shield size={12} />
                        {selectedCertificate.isValid ? "検証済み" : "検証失敗"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* 相互署名の説明 */}
                <div className={styles.crossSigningSection}>
                  <Text variant="h4" color="primary" weight="semibold">
                    <Users size={16} />
                    相互署名システム
                  </Text>
                  <div className={styles.crossSigningExplanation}>
                    <Text variant="body" color="secondary" style={{ lineHeight: "1.6" }}>
                      この証明書は<strong>相互署名</strong>
                      により作成されています。
                      新郎と新婦がお互いの秘密鍵で相手の証明書に署名することで、
                      両者の合意と信頼関係を数学的に証明しています。
                    </Text>
                    <div className={styles.signingFlow}>
                      <div className={styles.signingStep}>
                        <Text variant="bodySmall" color="brand" weight="semibold">
                          1. {selectedCertificate.issuer}が署名
                        </Text>
                        <Text variant="bodySmall" color="secondary">
                          秘密鍵で{selectedCertificate.subject}の証明書を署名
                        </Text>
                      </div>
                      <div className={styles.signingStep}>
                        <Text variant="bodySmall" color="brand" weight="semibold">
                          2. 暗号学的検証
                        </Text>
                        <Text variant="bodySmall" color="secondary">
                          公開鍵で署名の真正性を数学的に検証
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 公開鍵情報 */}
                <div className={styles.publicKeySection}>
                  <Text variant="h4" color="primary" weight="semibold">
                    <Key size={16} />
                    公開鍵情報
                  </Text>
                  <div className={styles.keyInfo}>
                    <Text variant="label" color="secondary" weight="medium">
                      公開鍵（抜粋）
                    </Text>
                    <div className={styles.copyableItem}>
                      <Text variant="monoSmall" color="primary" className={styles.publicKey}>
                        {selectedCertificate.publicKey}
                      </Text>
                      <CopyButton
                        textToCopy={selectedCertificate.publicKey}
                        className={styles.copyButton}
                      />
                    </div>
                    <Text variant="caption" color="tertiary" style={{ marginTop: "0.5rem" }}>
                      ECDSA P-256 楕円曲線暗号を使用
                    </Text>
                  </div>
                </div>

                {/* 証明書生データ */}
                <div className={styles.rawDataSection}>
                  <Text variant="h4" color="primary" weight="semibold">
                    証明書生データ（Base64）
                  </Text>
                  <div className={styles.rawDataContainer}>
                    <Text variant="label" color="secondary" weight="medium">
                      X.509証明書（DER形式）
                    </Text>
                    <div className={styles.copyableItem}>
                      <Input
                        value={selectedCertificate.certificateData}
                        readOnly
                        className={styles.rawDataInput}
                      />
                      <CopyButton
                        textToCopy={selectedCertificate.certificateData}
                        className={styles.copyButton}
                      />
                    </div>
                    <Text variant="caption" color="tertiary" style={{ marginTop: "0.5rem" }}>
                      この生データが暗号学的に署名・検証されています
                    </Text>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <Button
                  variant="primary"
                  size="medium"
                  onClick={closeCertificateModal}
                  className={styles.modalCloseButton}
                >
                  閉じる
                </Button>
              </div>
            </div>
          )}
        </dialog>
      </div>
    </div>
  );
}
