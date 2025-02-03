import { useContext, useState } from "react";
import "./index.css";
import Button from "../../component/button";
import Title from "../../component/title";
import Field from "../../component/field";
import Grid from "../../component/grid";
import BackButton from "../../component/back-button";
import Box from "../../component/box";
import Alert from "../../component/alert";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import { Form, REG_EXP_EMAIL } from "../../util/form";

export default function Recovery() {
  const navigate = useNavigate();
  const { currentAuth } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [alertClass, setAlertClass] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const form = new Form();

  form.FIELD_NAME = {
    EMAIL: "email",
  };
  form.FIELD_ERROR = {
    IS_EMPTY: "Введіть значення в поле",
    IS_BIG: "Дуже довге значення, приберіть зайве",
    EMAIL: "Введіть коректне значення e-mail адреси",
  };
  const validateEmail = (value) => {
    if (String(value).length < 1) {
      return form.FIELD_ERROR.IS_EMPTY;
    }

    if (String(value).length > 30) {
      return form.FIELD_ERROR.IS_BIG;
    }

    if (!REG_EXP_EMAIL.test(String(value))) {
      return form.FIELD_ERROR.EMAIL;
    }
  };

  const setError = (error) => {
    const span = document.querySelector(`.form__error `);
    const label = document.querySelector(`.field__label `);
    const field = document.querySelector(`.validation`);

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

  const handleChange = (name, value) => {
    setEmail(value);

    let error = validateEmail(email);
    if (error) {
      setError(error);
    } else {
      setError(null);
    }
    // setAlertClass(error ? "alert--error" : "alert--disabled");
    // setAlertMessage(error || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateEmail(email);
    if (error) {
      setAlertClass("alert--error");
      setAlertMessage(error);
      return;
    }

    setAlertClass("alert--progress");
    setAlertMessage("Завантаження...");

    try {
      const res = await fetch("http://localhost:4000/recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setAlertClass("alert--success");
        setAlertMessage(data.message);
        navigate("/recovery-confirm");
      } else {
        setAlertClass("alert--error");
        setAlertMessage(data.message);
      }
    } catch (error) {
      setAlertClass("alert--error");
      setAlertMessage("Помилка сервера: " + error.message);
    }
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
          placeholder="Enter your email"
          action={handleChange}
        />
        <Button onClick={handleSubmit}>Send code</Button>
        <Alert className={alertClass} message={alertMessage} />
      </div>
    </Box>
  );
}
