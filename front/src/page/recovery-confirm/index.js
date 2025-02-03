import "./index.css";
import Button from "../../component/button";
import Title from "../../component/title";
import Field from "../../component/field";
import FieldPassword from "../../component/field-password";
import Grid from "../../component/grid";
import BackButton from "../../component/back-button";
import Box from "../../component/box";
import Alert from "../../component/alert";
import { useNavigate, Link } from "react-router-dom";
import { Form, REG_EXP_PASSWORD } from "../../util/form";
import { useContext, useState } from "react";
import { AuthContext } from "../../App";

export default function Recovery() {
  const navigate = useNavigate();
  const { setAuth, currentAuth } = useContext(AuthContext);
  const [alertClass, setAlertClass] = useState("alert--disabled");
  const [alertText, setAlertText] = useState("");
  const form = new Form();
  form.FIELD_NAME = {
    CODE: "code",
    PASSWORD: "password",
    PASSWORD_AGAIN: "passwordAgain",
  };
  form.FIELD_ERROR = {
    IS_EMPTY: "Enter a value in the field",
    IS_BIG: "Very long value, remove the extra",
    PASSWORD:
      "The password must be at least 8 characters long, including at least one number, lowercase and uppercase letter.",
    PASSWORD_AGAIN: "Your second password does not match the first one.",
  };

  const validate = (name, value) => {
    if (String(value).length < 1) {
      return form.FIELD_ERROR.IS_EMPTY;
    }

    if (String(value).length > 30) {
      return form.FIELD_ERROR.IS_BIG;
    }

    if (name === form.FIELD_NAME.PASSWORD) {
      if (!REG_EXP_PASSWORD.test(String(value))) {
        return form.FIELD_ERROR.PASSWORD;
      }
    }

    if (name === form.FIELD_NAME.PASSWORD_AGAIN) {
      if (String(value) !== form.value[form.FIELD_NAME.PASSWORD]) {
        return form.FIELD_ERROR.PASSWORD_AGAIN;
      }
    }
  };

  const setError = (name, error) => {
    const span = document.querySelector(`.form__error[name="${name}"]`);
    const label = document.querySelector(`.field__label[name="${name}"]`);
    const field = document.querySelector(`.validation[name="${name}"]`);

    if (label) {
      label.classList.toggle("form__error--active", Boolean(error));
    }
    if (span) {
      span.classList.toggle("form__error--active", Boolean(error));
      span.innerText = error || "";
    }
    if (field) {
      field.classList.toggle("validation--active", Boolean(error));
    }
  };

  const change = (name, value) => {
    const error = validate(name, value);
    form.value[name] = value;
    if (error) {
      setError(name, error);
      form.error[name] = error;
    } else {
      setError(name, null);
      delete form.error[name];
    }
  };

  const setAlert = (status, text) => {
    if (status === "progress") {
      setAlertClass("alert--progress");
    } else if (status === "success") {
      setAlertClass("alert--success");
    } else if (status === "error") {
      setAlertClass("alert--error");
    } else {
      setAlertClass("alert--disabled");
    }

    if (text) setAlertText(text);
  };

  const validateAll = () => {
    let hasErrors = false;

    Object.values(form.FIELD_NAME).forEach((name) => {
      const value = form.value[name] || "";
      const error = validate(name, value);
      if (error) {
        form.error[name] = error;
        hasErrors = true;
      } else {
        delete form.error[name];
      }

      form.setError(name, error);
    });
    form.updateDisabledState();
    return hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateAll();
    if (error) {
      return;
    }

    setAlert("progress", "Loading... ");
    try {
      const res = await fetch("http://localhost:4000/recovery-confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: form.value.code,
          password: form.value.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAlert("success", data.message);

        navigate("/balance");
      } else {
        setAlert("error", data.message);
      }
    } catch (error) {
      setAlert("error", error.message);
    }
  };
  return (
    <Box>
      <BackButton />

      <Grid>
        <Title className="main-title">Recover password</Title>
        <Title className="main-sub-title">Write the code you received</Title>
      </Grid>
      <div className="main_container">
        <Field
          name="code"
          type="number"
          label="Code"
          placeholder="Enter your code"
          action={change}
        />
        <FieldPassword
          name="password"
          label="New password"
          type="password"
          placeholder="Enter your new password"
          action={change}
        />
        <FieldPassword
          name="passwordAgain"
          label="New password again"
          type="password "
          placeholder="Enter your new password again"
          action={change}
        />
        <Button onClick={handleSubmit}>Restore password</Button>
        <Alert className={alertClass} message={alertText} />
      </div>
    </Box>
  );
}
