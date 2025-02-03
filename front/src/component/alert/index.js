import "./index.css";
import logo from "./logo-error.svg";

export default function Alert({ message, className }) {
  return (
    <div className={`alert ${className}`}>
      {className === "alert--error" && (
        <>
          <img src={logo} className="alert-logo" alt="Error logo" />
          <span>{message}</span>
        </>
      )}
      {className !== "alert--error" && <span>{message}</span>}
    </div>
  );
}
