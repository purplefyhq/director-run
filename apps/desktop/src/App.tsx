import reactLogo from "./assets/react.svg";
import "./App.css";

export function App() {
  return (
    <main className="container">
      <h1>Welcome to Director</h1>

      <div className="row">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </div>
    </main>
  );
}
