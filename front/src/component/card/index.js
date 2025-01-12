import "./index.css";
export default function Component({ children, className = "" }) {
  document.body.classList.add("payment-active"); // Додає клас до body

  return <div className={`card ${className}`}>{children}</div>;
}
