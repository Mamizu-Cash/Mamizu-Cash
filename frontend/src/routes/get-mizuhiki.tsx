import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, User } from "lucide-react";

export const Route = createFileRoute("/get-mizuhiki")({
  component: GetMizuhikiScreen,
});

function GetMizuhikiScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "3rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100px",
              height: "100px",
              backgroundColor: "#3b82f6",
              borderRadius: "50%",
              marginBottom: "2rem",
            }}
          >
            <User size={50} color="white" />
          </div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#1e293b",
              marginBottom: "1rem",
            }}
          >
            Mizuhiki SBT取得
          </h1>
          <p
            style={{
              color: "#64748b",
              fontSize: "1.2rem",
              lineHeight: "1.6",
              marginBottom: "2rem",
            }}
          >
            個人向けKYC認証でプライベート送金に参加
          </p>
        </div>

        {/* Main Message */}
        <div
          style={{
            backgroundColor: "#eff6ff",
            padding: "2.5rem",
            borderRadius: "16px",
            marginBottom: "3rem",
            border: "2px solid #3b82f6",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "60px",
              height: "60px",
              backgroundColor: "#3b82f6",
              borderRadius: "50%",
              marginBottom: "1.5rem",
            }}
          >
            <ExternalLink size={30} color="white" />
          </div>
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: "#1e40af",
              marginBottom: "1rem",
            }}
          >
            外部サービス
          </h2>
          <p
            style={{
              fontSize: "1.3rem",
              color: "#1e40af",
              lineHeight: "1.6",
              fontWeight: "500",
            }}
          >
            Japan Smart ChainのMizuhiki Attestorが発行します。
          </p>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <a
            href="/"
            style={{
              padding: "1.2rem 2.5rem",
              backgroundColor: "#3b82f6",
              color: "white",
              textDecoration: "none",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "background-color 0.2s",
            }}
          >
            ホームに戻る
          </a>
        </div>
      </div>
    </div>
  );
}
