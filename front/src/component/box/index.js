import "./index.css";
export default function Component({ children, className = "" }) {
  return <div className={`box ${className}`}>{children}</div>;
}
