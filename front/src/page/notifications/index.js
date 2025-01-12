import "./index.css";

import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../App";
import Card from "../../component/card";
import Grid from "../../component/grid";
import Title from "../../component/title";
import BackButton from "../../component/back-button";
import Box from "../../component/box";
import warningIcon from "./warningIcon.svg";
import announcementIcon from "./announcementIcon.svg";

export default function Notifications() {
  const { setAuth, currentAuth } = useContext(AuthContext);
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/notification?email=${currentAuth.email}`
        );
        const data = await response.json();
        setNotification(data.reverse());
        console.log("Fetched notification:", data);
      } catch (error) {
        console.error("Помилка отримання транзакцій:", error);
      }
    };

    fetchNotification();

    // Додаємо інтервал для автоматичного оновлення балансу
    const intervalId = setInterval(() => {
      fetchNotification();
    }, 5000); // Оновлюємо кожні 5 секунд

    // Очищуємо інтервал при розмонтуванні компонента
    return () => clearInterval(intervalId);
  }, [currentAuth]);
  return (
    <Box>
      <BackButton />
      <Grid>
        <Title className="main-title">Notifications</Title>

        <ul className="transaction__list">
          {notification.map((tx) => (
            <li key={tx.id}>
              <Card className="notification__item">
                <img
                  src={tx.type === "Warning" ? warningIcon : announcementIcon}
                />
                <div>
                  <Title className="tx-title">{tx.message}</Title>
                  <span className="tx-desc">
                    {new Date(tx.date).toLocaleString("uk-UA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>{" "}
                  <span className="tx-desc">{tx.type}</span>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </Grid>
    </Box>
  );
}
