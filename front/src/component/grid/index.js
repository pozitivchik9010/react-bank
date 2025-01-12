import "./index.css";
export default function Component({ children, className = "" }) {
  return <div className={`grid ${className}`}>{children}</div>;
}
