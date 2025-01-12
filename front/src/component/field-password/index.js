import "./index.css";
import SpanError from "../span-error";
import React from "react";

class FieldPassword {
  static toggle = (target) => {
    target.toggleAttribute("show");

    const input = target.previousElementSibling;
    const icon = target;
    const type = input.getAttribute("type");

    if (type === "password") {
      input.setAttribute("type", "text");
      icon.classList.add("field__icon--show");
    } else {
      input.setAttribute("type", "password");
      icon.classList.remove("field__icon--show");
    }
  };
}
export default function FieldPasswordComponent({
  label,
  name,
  placeholder,
  action = () => {},
}) {
  return (
    <div className="field field--password">
      <label name={name} className="field__label">
        {label}
      </label>
      <div className="field__wrapper">
        <input
          type="password"
          className="field__input validation"
          name={name}
          placeholder={placeholder}
          onInput={(e) => action && action(e.target.name, e.target.value)}
        />
        <span
          onClick={(e) => FieldPassword.toggle(e.target)}
          className="field__icon"
        ></span>
      </div>
      <SpanError name={name} />
    </div>
  );
}
