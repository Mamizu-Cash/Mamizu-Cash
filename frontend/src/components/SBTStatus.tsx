import { useMizuhikiSBT } from "../hooks/useMizuhikiSBT";

export function SBTStatus() {
  const { hasSBT, isLoading, error } = useMizuhikiSBT();

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <div
          style={{
            width: "16px",
            height: "16px",
            border: "2px solid #e2e8f0",
            borderTop: "2px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <span style={{ color: "#64748b", fontSize: "0.875rem" }}>SBT確認中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "#dc2626",
          fontSize: "0.875rem",
        }}
      >
        ⚠️ SBT確認エラー
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "0.875rem",
      }}
    >
      {hasSBT ? (
        <>
          <span style={{ color: "#059669" }}>✅</span>
          <span style={{ color: "#065f46", fontWeight: "500" }}>Mizuhiki Verified SBT保有済み</span>
        </>
      ) : (
        <>
          <span style={{ color: "#dc2626" }}>❌</span>
          <span style={{ color: "#991b1b" }}>SBTを保有していません</span>
        </>
      )}
    </div>
  );
}
