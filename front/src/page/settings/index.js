import "./index.css";
import Change from "../../component/change";
import "./index.css";
import Button from "../../component/button";
import Title from "../../component/title";
import Field from "../../component/field";
import Grid from "../../component/grid";
import BackButton from "../../component/back-button";
import Box from "../../component/box";
import FieldPassword from "../../component/field-password";
import Alert from "../../component/alert";
import Divider from "../../component/divider";
import { useNavigate, Link } from "react-router-dom";
///////
import { useContext } from "react";
import { AuthContext } from "../../App";
import { Form, REG_EXP_EMAIL, REG_EXP_PASSWORD } from "../../util/form";
///////

class SignupForm extends Form {
  FIELD_NAME = {
    EMAIL: "email",
    PASSWORD: "password",
    PASSWORD_AGAIN: "passwordAgain",
  };
  FIELD_ERROR = {
    IS_EMPTY: "Введіть значення в поле",
    IS_BIG: "Дуже довге значення, приберіть зайве",
    EMAIL: "Введіть коректне значення e-mail адреси",
    PASSWORD:
      "Пароль повинен складатися не менше ніж 8 символів, включаючи хоча б одну цифру, малу та велику літеру",
    PASSWORD_AGAIN: "Ваш другий пароль не збігається з першим",
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
}

export default function Settings() {
  const navigate = useNavigate();
  const signupForm = new SignupForm();
  const { setAuth, currentAuth } = useContext(AuthContext);

  const change = (name, value) => {
    const error = signupForm.validate(name, value);
    signupForm.value[name] = value;
    console.log("value", signupForm.value);
    if (error) {
      signupForm.setError(name, error);
      signupForm.error[name] = error;
    } else {
      signupForm.setError(name, null);
      delete signupForm.error[name];
    }
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    signupForm.validateAll();
    signupForm.setAlert("progress", "Завантаження... ");
    try {
      const res = await fetch("http://localhost:4000/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newEmail: signupForm.value.email,
          password: signupForm.value.password,
          email: currentAuth.email,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAuth((prevAuth) => ({
          ...prevAuth,
          email: data.newemail,
        }));
        signupForm.setAlert("success", data.message);
        console.log("data", data);
      } else {
        signupForm.setAlert("error", data.message);
      }
    } catch (error) {
      signupForm.setAlert("error", error.message);
    }
  };
  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    signupForm.setAlert("progress", "Завантаження... ");
    try {
      const res = await fetch("http://localhost:4000/settings-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: signupForm.value.oldPassword,
          newPassword: signupForm.value.newPassword,
          email: currentAuth.email,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAuth((prevAuth) => ({ ...prevAuth, password: data.newPassword }));
        signupForm.setAlert("success", data.message);
        console.log("data", data);
      } else {
        signupForm.setAlert("error", data.message);
      }
    } catch (error) {
      signupForm.setAlert("error", error.message);
    }
  };
  const submitLogout = async (e) => {
    e.preventDefault();

    setAuth({
      token: null,
    });
  };
  return (
    <Box>
      <BackButton />

      <Grid>
        <Title className="main-title">Settings</Title>
      </Grid>
      <form onSubmit={handleSubmitEmail} className="main_container">
        <Title className="main-title"> Change email</Title>
        <Field
          name="email"
          type="email"
          label="New email"
          placeholder="Enter your new email"
          action={change}
        />

        <FieldPassword
          name="password"
          label="Old password"
          type="password"
          placeholder="Enter your old password"
          action={change}
        />
        <Button className="secondary">Contine</Button>
        <Divider />

        <Alert />
      </form>
      <form onSubmit={handleSubmitPassword} className="main_container">
        <Title className="main-title">Change password</Title>
        <FieldPassword
          name="oldPassword"
          label="Old password"
          type="password"
          placeholder="Enter your old password"
          action={change}
        />

        <FieldPassword
          name="newPassword"
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
        <Button className="secondary">Save password</Button>
        <Divider />

        <Alert />
      </form>
      {/* <form className="main_container">
        <Title className="main-title"> Change email</Title>
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
        <Button className="secondary" onClick={handleSubmit}>
          Contine
        </Button>
        <Alert />
        <Divider />
      </form> */}
      <div className="main_container">
        <Button className="error" onClick={submitLogout}>
          Log out
        </Button>
      </div>
    </Box>
  );
}
