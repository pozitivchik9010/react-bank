import "./index.css";
import Button from "../../component/button";
import Title from "../../component/title";
import Field from "../../component/field";
import Grid from "../../component/grid";
import BackButton from "../../component/back-button";
import Box from "../../component/box";
import Alert from "../../component/alert";
import { useNavigate, Link } from "react-router-dom";
import { Form, REG_EXP_EMAIL, REG_EXP_PASSWORD } from "../../util/form";
import { useContext } from "react";
import { AuthContext } from "../../App";

export default function Recovery() {
  const navigate = useNavigate();
  const { setAuth, currentAuth } = useContext(AuthContext);
  const form = new Form();
  form.FIELD_NAME = {
    EMAIL: "email",
  };
  form.FIELD_ERROR = {
    IS_EMPTY: "Введіть значення в поле",
    IS_BIG: "Дуже довге значення, приберіть зайве",
    EMAIL: "Введіть коректне значення e-mail адреси",
  };

  const validate = (name, value) => {
    if (String(value).length < 1) {
      return form.FIELD_ERROR.IS_EMPTY;
    }

    if (String(value).length > 30) {
      return form.FIELD_ERROR.IS_BIG;
    }

    if (name === form.FIELD_NAME.EMAIL) {
      if (!REG_EXP_EMAIL.test(String(value))) {
        return form.FIELD_ERROR.EMAIL;
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    // form.validateAll();
    form.setAlert("progress", "Завантаження... ");
    try {
      const res = await fetch("http://localhost:4000/recovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.value.email,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        form.setAlert("success", data.message);
        navigate("/recovery-confirm");
      } else {
        form.setAlert("error", data.message);
      }
    } catch (error) {
      form.setAlert("error", error.message);
    }

    console.log("currentAuth", currentAuth);
  };
  return (
    <Box>
      <BackButton />

      <Grid>
        <Title className="main-title">Recover password</Title>
        <Title className="main-sub-title">Choose a recovery method</Title>
      </Grid>
      <div className="main_container">
        <Field
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your name"
          action={change}
        />
        <Button onClick={handleSubmit}>Send code</Button>
        <Alert />
      </div>
    </Box>
  );
}
