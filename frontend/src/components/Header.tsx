import { Link } from "@tanstack/react-router";
import { ConnectButton } from "./ConnectButton";

export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "8px",
        backgroundColor: "white",
        padding: "8px",
        color: "black",
      }}
    >
      <nav style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ padding: "0 8px", fontWeight: "bold" }}>
          <Link to="/">Home</Link>
        </div>

        <div style={{ padding: "0 8px", fontWeight: "bold" }}>
          <Link to="/deposit">Deposit</Link>
        </div>
        <div style={{ padding: "0 8px", fontWeight: "bold" }}>
          <Link to="/withdraw">Withdraw</Link>
        </div>
        <div style={{ padding: "0 8px", fontWeight: "bold" }}>
          <Link to="/profile">Profile</Link>
        </div>
      </nav>

      <div style={{ display: "flex", alignItems: "center" }}>
        <ConnectButton />
      </div>
    </header>
  );
}
