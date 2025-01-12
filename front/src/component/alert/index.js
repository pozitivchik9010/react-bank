import "./index.css";

export default function Component({ text, type }) {
  return (
    <span className={`alert alert--${type ? type : "disabled"}`}>
      <span className="alert-logo"></span>
      <p>{text}</p>
    </span>
  );
}
