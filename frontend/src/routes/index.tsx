import { createFileRoute } from "@tanstack/react-router";
import logo from "../logo.svg";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div style={{ textAlign: 'center' }}>
      <header style={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#282c34',
        fontSize: 'calc(10px + 2vmin)',
        color: 'white'
      }}>
        <img
          src={logo}
          style={{
            pointerEvents: 'none',
            height: '40vmin',
            animation: 'spin 20s linear infinite'
          }}
          alt="logo"
        />
        <p>
          Edit <code>src/routes/index.tsx</code> and save to reload.
        </p>
        <a
          style={{
            color: '#61dafb',
            textDecoration: 'none'
          }}
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
          onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
        >
          Learn React
        </a>
        <a
          style={{
            color: '#61dafb',
            textDecoration: 'none',
            marginTop: '10px'
          }}
          href="https://tanstack.com"
          target="_blank"
          rel="noopener noreferrer"
          onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
          onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
        >
          Learn TanStack
        </a>
      </header>
    </div>
  );
}
