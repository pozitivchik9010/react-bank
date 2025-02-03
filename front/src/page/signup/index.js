import "./index.css";
import Button from "../../component/button";
import Title from "../../component/title";
import Field from "../../component/field";
import Grid from "../../component/grid";
import BackButton from "../../component/back-button";
import Box from "../../component/box";
import FieldPassword from "../../component/field-password";
import Alert from "../../component/alert";
import { useNavigate, Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../App";
import { Form, REG_EXP_EMAIL, REG_EXP_PASSWORD } from "../../util/form";

class SignupForm extends Form {
  FIELD_NAME = {
    EMAIL: "email",
    PASSWORD: "password",
    PASSWORD_AGAIN: "passwordAgain",
  };
  FIELD_ERROR = {
    IS_EMPTY: "Enter a value in the field",
    IS_BIG: "Very long value, remove the extra",
    EMAIL: "Please enter a valid email address.",
    PASSWORD:
      "The password must be at least 8 characters long, including at least one number, lowercase and uppercase letter.",
    PASSWORD_AGAIN: "Your second password does not match the first one.",
  };

  checkDisabled = () => {
    let disabled = false;

    Object.values(this.FIELD_NAME).forEach((name) => {
      if (this.error[name] || this.value[name] === undefined) {
        disabled = true;
      }
    });

    const el = document.querySelector(`.btn`);

    if (el) {
      el.classList.toggle("btn--disabled", Boolean(disabled));
    }

    this.disabled = disabled;
  };

  validate(name, value) {
    if (String(value).length < 1) {
      return this.FIELD_ERROR.IS_EMPTY;
    }

    if (String(value).length > 30) {
      return this.FIELD_ERROR.IS_BIG;
    }

    if (name === this.FIELD_NAME.EMAIL) {
      if (!REG_EXP_EMAIL.test(String(value))) {
        return this.FIELD_ERROR.EMAIL;
      }
    }

    if (name === this.FIELD_NAME.PASSWORD) {
      if (!REG_EXP_PASSWORD.test(String(value))) {
        console.log("password", this.FIELD_ERROR.PASSWORD);
        return this.FIELD_ERROR.PASSWORD;
      }
    }

    if (name === this.FIELD_NAME.PASSWORD_AGAIN) {
      if (String(value) !== this.value[this.FIELD_NAME.PASSWORD]) {
        console.log(this.FIELD_ERROR.PASSWORD_AGAIN);

        return this.FIELD_ERROR.PASSWORD_AGAIN;
      }
    }
  }

  setError = (name, error) => {
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

  convertData = () => {
    return JSON.stringify({
      [this.FIELD_NAME.EMAIL]: this.value[this.FIELD_NAME.EMAIL],
      [this.FIELD_NAME.PASSWORD]: this.value[this.FIELD_NAME.PASSWORD],
    });
  };
}

export default function Signup() {
  const navigate = useNavigate();
  const signupForm = new SignupForm();
  const { setAuth } = useContext(AuthContext);
  const [alertClass, setAlertClass] = useState("alert--disabled");
  const [alertText, setAlertText] = useState("");

  const change = (name, value) => {
    const error = signupForm.validate(name, value);
    signupForm.value[name] = value;
    if (error) {
      signupForm.setError(name, error);
      signupForm.error[name] = error;
    } else {
      signupForm.setError(name, null);
      delete signupForm.error[name];
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (signupForm.disabled) {
      signupForm.validateAll();
      return;
    }

    setAlert("progress", "Loading... ");
    try {
      const res = await fetch("http://localhost:4000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signupForm.value.email,
          password: signupForm.value.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAuth((prevAuth) => ({
          ...prevAuth,
          email: data.session.user.email,
          token: data.session.token,
        }));
        setAlert("success", data.message);
        navigate("/signup-confirm");
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
        <Title className="main-title">Sign Up</Title>
        <Title className="main-sub-title">Choose a registration method</Title>
      </Grid>
      <div className="main_container">
        <Field
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your name"
          action={change}
        />

        <FieldPassword
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          action={change}
        />
        <FieldPassword
          name="passwordAgain"
          label="Password again"
          type="password "
          placeholder="Enter your password again"
          action={change}
        />

        <span className="link__prefix">
          Already have an account?
          <Link to="/signin" className="link">
            Sign In
          </Link>
        </span>
        <Button onClick={handleSubmit}>Contine</Button>
        <Alert className={alertClass} message={alertText} />
      </div>
    </Box>
  );
}
