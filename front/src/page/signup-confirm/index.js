import React, { useState, useContext, useEffect } from "react";
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

export default function SignupConfirm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const validate = (value) => {
    if (value.length < 1) {
      return "Введіть значення в поле";
    }
    if (value.length > 20) {
      return "Дуже довге значення, приберіть зайве";
    }
    return null;
  };
  const setAlert = (status, text) => {
    const el = document.querySelector(`.alert`);
    if (status === "progress") {
      el.className = "alert alert--progress";
    } else if (status === "success") {
      el.className = "alert alert--success";
    } else if (status === "error") {
      el.className = "alert alert--error";
    } else {
      el.className = "alert alert--disabled";
    }

    if (text) el.innerText = text;
  };
  const { setAuth, currentAuth } = useContext(AuthContext);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!code) {
      setAlert("error", "Введіть код");
      return;
    }
    setAlert("progress", "Завантаження... ");

    try {
      const res = await fetch("http://localhost:4000/signup-confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          token: currentAuth.token,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setAuth((prevAuth) => ({
          ...prevAuth,
          confirm: data.session.user.isConfirm,
        }));
        localStorage.setItem(
          "auth",
          JSON.stringify({
            email: data.session.user.email,
            token: data.session.token,
            confirm: data.session.user.isConfirm,
          })
        );

        setAlert("success", data.message);

        // saveSession(data.session);
        navigate("/balance");
      } else {
        setAlert("error", data.message);
      }
    } catch (error) {
      setAlert("error", error.message);
    }
  };

  const change = (name, value) => {
    const error = validate(value);
    setCode(value);
    console.log("value", value);
    if (error) {
      setAlert("error", error);
    } else {
      setError(null);
    }
  };
  const handleRenewClick = async (e) => {
    e.preventDefault();
    const email = currentAuth.email;
    setAlert("progress", "Відправлення нового коду...");

    try {
      console.log("2345");
      const res = await fetch("http://localhost:4000/signup-confirm-renew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      console.log("successss");
      if (res.ok) {
        setAlert("success", data.message);
      }
    } catch (error) {
      console.log("error");
      setAlert("error", error.message);
    }
  };

  return (
    <Box>
      <BackButton />
      <Grid>
        <Title className="main-title">Confirm account</Title>
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
        {error && <Alert type="error" message={error} />}

        <span className="link__prefix">
          Загубили код?
          <a onClick={handleRenewClick} className="link" id="renew">
            Відправити код, ще раз
          </a>
        </span>
        <Button onClick={handleSubmit}>Confirm</Button>
        <Alert />
      </div>
    </Box>
  );
}
