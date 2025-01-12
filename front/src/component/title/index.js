import "./index.css";
export default function Component({ children, className, style }) {
  return (
    <h1 style={style} className={`title ${className || ""}`}>
      {children}
    </h1>
  );
}
