import "./index.css";
import "./index.css";
import Button from "../../component/button";
import Title from "../../component/title";
import Field from "../../component/field";
import Grid from "../../component/grid";
import BackButton from "../../component/back-button";
import Box from "../../component/box";
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
    // console.log("value", signupForm.value);
    if (error) {
      signupForm.setError(name, error);
      signupForm.error[name] = error;
    } else {
      signupForm.setError(name, null);
      delete signupForm.error[name];
    }
  };
  document.body.classList.add("payment-active"); // Додає клас до body

  const handleSend = async (e) => {
    console.log(
      signupForm.value.email,
      signupForm.value.amount,
      currentAuth.email
    );
    e.preventDefault();
    // signupForm.validateAll();
    signupForm.setAlert("progress", "Завантаження... ");
    console.log(`поповнено на ${signupForm.value.amount}`);
    try {
      const res = await fetch("http://localhost:4000/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientEmail: signupForm.value.email,
          amount: signupForm.value.amount,
          senderEmail: currentAuth.email,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAuth((prevAuth) => ({
          ...prevAuth,
          transaction: data.transaction,
          notification: data.notification,
          balance: data.balance,
        }));
        console.log(data.transaction);
        signupForm.setAlert("success", data.message);
        // console.log("data", data);
        console.log("поповнено");
      } else {
        signupForm.setAlert("error", data.message);
      }
    } catch (error) {
      signupForm.setAlert("error", error.message);
    }
  };
  return (
    <Box className="payment">
      <BackButton />

      <Grid>
        <Title className="main-title">Send</Title>
      </Grid>
      <form className="main_container">
        <Field
          name="email"
          type="email"
          label="Email"
          placeholder="Enter email for send"
          action={change}
        />{" "}
        <Field
          name="amount"
          type="number"
          label="Sum"
          placeholder="Enter amount"
          action={change}
        />
        <Button onClick={handleSend}>Send</Button>
        <Alert />
      </form>
    </Box>
  );
}
