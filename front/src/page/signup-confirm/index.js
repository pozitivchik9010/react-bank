import { useState, useContext } from "react";
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
  const [alertClass, setAlertClass] = useState("alert--disabled");
  const [alertText, setAlertText] = useState("");
  const navigate = useNavigate();
  const { setAuth, currentAuth } = useContext(AuthContext);

  const validate = (value) => {
    if (value.length < 1) {
      return "Enter a value in the field";
    }
    if (value.length > 20) {
      return "Very long value, remove the extra";
    }
    return null;
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

  const handleSubmit = async () => {
    if (!code) {
      setAlert("error", "Enter the code");
      return;
    }
    setAlert("progress", "Loading... ");

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
    if (error) {
      setAlert("error", error);
    } else {
      setError(null);
    }
  };
  const handleRenewClick = async (e) => {
    e.preventDefault();
    const email = currentAuth.email;
    setAlert("progress", "Sending a new code...");

    try {
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

        <span className="link__prefix">
          Lost code?
          <a onClick={handleRenewClick} className="link" id="renew">
            Send code again
          </a>
        </span>
        <Button onClick={handleSubmit}>Confirm</Button>
        <Alert className={alertClass} message={alertText} />
      </div>
    </Box>
  );
}
