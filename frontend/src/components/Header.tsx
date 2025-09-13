import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      gap: '8px',
      backgroundColor: 'white',
      padding: '8px',
      color: 'black'
    }}>
      <nav style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ padding: '0 8px', fontWeight: 'bold' }}>
          <Link to="/">Home</Link>
        </div>

        <div style={{ padding: '0 8px', fontWeight: 'bold' }}>
          <Link to="/demo/store">Store</Link>
        </div>
      </nav>
    </header>
  );
}
