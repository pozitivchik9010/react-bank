import "./index.css";
import Button from "../../component/button";
import Title from "../../component/title";
import Field from "../../component/field";
import Grid from "../../component/grid";
import Box from "../../component/box";
import IconButton from "../../component/icon-button";
import settingIcon from "./settingsIcon.svg";
import notificationsIcon from "./notificatinsIcon.svg";
import receiveIcon from "./receiceIcon.svg";
import sendIcon from "./sendIcon.svg";
import coinbaseIcon from "./coinbaseIcon.svg";
import stripeIcon from "./stripeIcon.svg";
import userIcon from "./userIcon.svg";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../App";

export default function Balance() {
  const { setAuth, currentAuth } = useContext(AuthContext);
  const [balance, setBalance] = useState(0);
  const [transaction, setTransaction] = useState([]);

  useEffect(() => {
    console.log("Current Auth:", currentAuth);
    const fetchBalance = async () => {
      try {
        const response = await fetch("http://localhost:4000/balance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: currentAuth.email }), // Використовуйте userId замість email
        });
        const data = await response.json();
        setBalance(data.balance.amount); // Оновлено для отримання amount
        console.log("Fetched balance:", data.balance.amount);
      } catch (error) {
        console.error("Помилка отримання балансу:", error);
      }
    };

    const fetchTransaction = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/transaction?email=${currentAuth.email}`
        );
        const data = await response.json();
        setTransaction(data.reverse());
        console.log("Fetched transaction:", data);
      } catch (error) {
        console.error("Помилка отримання транзакцій:", error);
      }
    };

    fetchBalance();
    fetchTransaction();

    // Додаємо інтервал для автоматичного оновлення балансу
    const intervalId = setInterval(() => {
      fetchBalance();
      fetchTransaction();
    }, 5000); // Оновлюємо кожні 5 секунд

    // Очищуємо інтервал при розмонтуванні компонента
    return () => clearInterval(intervalId);
  }, [currentAuth]);

  return (
    <Box className="contain">
      <Grid className="head">
        <IconButton url="/settings" iconButton={settingIcon} />
        <Grid>
          <Title className="head__title">Баланс</Title>
          <Title>$ {balance}</Title> {/* Оновлено для відображення балансу */}
          <Grid className="buttonCont">
            <div>
              <IconButton
                height="48"
                width="48"
                className="buton-op"
                iconButton={receiveIcon}
                url="/recive"
              />
            </div>
            <div>
              <IconButton
                height="48"
                width="48"
                className="buton-op"
                iconButton={sendIcon}
                url="/send"
              />
            </div>
          </Grid>
        </Grid>
        <IconButton url="/notifications" iconButton={notificationsIcon} />
      </Grid>

      <Grid>
        <ul className="transaction__list">
          {transaction.map((tx) => (
            <li key={tx.id}>
              <Link
                to={`/transaction/${tx.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Grid className="transaction__item">
                  <div className="transaction__item--right">
                    <img
                      style={{ display: "block" }}
                      src={
                        tx.senderEmail === "Stripe"
                          ? stripeIcon
                          : tx.senderEmail === "Coinbase"
                          ? coinbaseIcon
                          : userIcon
                      }
                    />
                    <div>
                      <Title className="tx-title">
                        {tx.type === "send"
                          ? `To: ${tx.recipientEmail}`
                          : `From: ${tx.senderEmail}`}
                      </Title>
                      <span className="tx-desc">
                        {new Date(tx.date).toLocaleString("uk-UA", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>{" "}
                      <span className="tx-desc">{tx.type}</span>
                    </div>
                  </div>
                  <span style={{ color: tx.type === "send" ? "red" : "green" }}>
                    {tx.type === "send"
                      ? `- $${Number(tx.amount)}`
                      : `+ $${tx.amount}`}
                  </span>
                </Grid>
              </Link>
            </li>
          ))}
        </ul>
      </Grid>
    </Box>
  );
}
