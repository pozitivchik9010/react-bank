import "./index.css";
import { useNavigate } from "react-router-dom";

export default function Component({
  className = "",
  url,
  iconButton,
  alt = "",
  height = "24px",
  width = "24",
}) {
  const navigate = useNavigate();
  const handle = () => {
    navigate(url);
  };
  return (
    <button className={`icon-button ${className}`} onClick={handle}>
      <img src={iconButton} alt={alt} height={height} width={width} />
    </button>
  );
}
