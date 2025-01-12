import "./index.css";
export default function Component({ children, onClick, className }) {
  return (
    <button onClick={onClick} className={`btn ${className || ""}`}>
      {children}
    </button>
  );
}
