import "./index.css";

import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../App";
import Card from "../../component/card";
import Grid from "../../component/grid";
import Title from "../../component/title";
import Field from "../../component/field";
import BackButton from "../../component/back-button";
import Box from "../../component/box";
import FieldPassword from "../../component/field-password";
import Alert from "../../component/alert";
import Divider from "../../component/divider";

export default function TransactionDetails() {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState([]);

  const { setAuth, currentAuth } = useContext(AuthContext);
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/transaction/${transactionId}?email=${currentAuth.email}`
        );
        const data = await response.json();
        setTransaction(data); // Очікуємо одну транзакцію
        console.log("Fetched transaction:", data);
      } catch (error) {
        console.error("Помилка отримання транзакції:", error);
      }
    };

    fetchTransaction();

    // Додаємо інтервал для автоматичного оновлення балансу
    const intervalId = setInterval(() => {
      fetchTransaction();
    }, 5000); // Оновлюємо кожні 5 секунд

    // Очищуємо інтервал при розмонтуванні компонента
    return () => clearInterval(intervalId);
  }, [currentAuth]);
  if (!transaction) {
    return <div>Завантаження...</div>;
  }

  return (
    <Box>
      <BackButton />
      <Grid>
        <Title className="main-title">Transaction</Title>
        <Title
          style={{ color: transaction.type === "send" ? "red" : "#24B277" }}
        >
          {transaction.type === "send"
            ? `- $${Number(transaction.amount)}`
            : `+ $${transaction.amount}`}
        </Title>
        <Card>
          <div className="transaction__item">
            Date:{" "}
            <p>
              {new Date(transaction.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
              })}
              ,{" "}
              {new Date(transaction.date).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="transaction__item">
            Adress:{" "}
            <p>
              {transaction.type === "send"
                ? transaction.recipientEmail
                : transaction.senderEmail}
            </p>
          </div>
          <div className="transaction__item">
            Тип:
            <p> {transaction.type}</p>
          </div>
        </Card>
      </Grid>
    </Box>
  );
}
