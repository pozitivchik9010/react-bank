import "./index.css";
export default function Component({ children, className = "" }) {
  document.body.classList.add("payment-active");

  return <div className={`card ${className}`}>{children}</div>;
}
