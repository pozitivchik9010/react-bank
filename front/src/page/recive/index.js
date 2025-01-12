import "./index.css";
import Change from "../../component/change";
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
import paymentIcon1 from "./paymentIcon.svg";
import paymentIcon2 from "./paymentIcon2.svg";
import logoPaySystem1 from "./logoPaySystem1.svg";
import logoPaySystem2 from "./logoPaySystem2.svg";
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
  document.body.classList.add("payment-active"); // Додає клас до body

  const handlePayment = async (paymentMethod, e) => {
    console.log(signupForm.value.amount);
    e.preventDefault();
    // signupForm.validateAll();
    signupForm.setAlert("progress", "Завантаження... ");
    console.log(`поповнено на ${signupForm.value.amount}`);
    try {
      const res = await fetch("http://localhost:4000/top-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: signupForm.value.amount,
          email: currentAuth.email,
          paymentMethod: paymentMethod,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAuth((prevAuth) => ({
          ...prevAuth,
          transaction: data.transaction,
          balance: data.balance,
        }));
        console.log(data.transaction);
        console.log(data.balance);
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
        <Title className="main-title">Receive</Title>
      </Grid>
      <form className="main_container">
        <Field
          name="amount"
          type="number"
          label="Receive amount"
          placeholder="Enter amount"
          action={change}
        />
        <Divider />
        <Title className="main-title">Payment system</Title>

        <Button
          className="payment-btn"
          onClick={(e) => handlePayment("Stripe", e)}
        >
          <div>
            <img src={logoPaySystem1} />
            <p>Stripe</p>
          </div>
          <img src={paymentIcon1}></img>
        </Button>
        <Button
          className="payment-btn"
          onClick={(e) => handlePayment("Coinbase", e)}
        >
          <div>
            <img src={logoPaySystem2} />
            <p>Coinbase</p>
          </div>
          <img src={paymentIcon2}></img>
        </Button>

        <Alert />
      </form>
    </Box>
  );
}
