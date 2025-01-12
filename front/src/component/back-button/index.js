import "./index.css";
import backIcon from "./back-button.svg";

class BackButton {
  static back() {
    return window.history.back();
  }
}

export default function Component({ className = "" }) {
  return (
    <button className={`back-button ${className}`} onClick={BackButton.back}>
      <img src={backIcon} alt="<" height="24" width="24" />
    </button>
  );
}
window.BackButton = BackButton;
