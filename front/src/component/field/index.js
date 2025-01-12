import "./index.css";
import SpanError from "../span-error";

export default function Component({ label, name, type, placeholder, action }) {
  return (
    <div name={name} className="field  ">
      <label name={name} className={`field__label`}>
        {label}
      </label>
      <input
        type={type}
        className="field__input validation"
        name={name}
        placeholder={placeholder}
        onInput={(e) => action(e.target.name, e.target.value)}
      />
      <SpanError name={name} />
    </div>
  );
}
