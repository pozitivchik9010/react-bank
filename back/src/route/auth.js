const express = require('express')
const router = express.Router()

const { User } = require('../class/user')
const { Session } = require('../class/session')
const { Confirm } = require('../class/confirm')
const { Balance } = require('../class/balance')
const { Transaction } = require('../class/transaction')
const { Notification } = require('../class/notification')

User.create({
  email: 'user@mail.com',
  password: 234,
  isConfirm: true,
})
User.create({
  email: 'admin@mail.com',
  password: 234,
})
User.create({
  email: 'developer@mail.com',
  password: 234,
})

router.post('/signup', (req, res) => {
  const { email, password } = req.body

  console.log('========', email, password)
  if (!email || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні!",
    })
  }
  try {
    const user = User.getByEmail(email)

    if (user) {
      return res.status(400).json({
        message: 'Користувач з таким e-mail, вже існує!',
      })
    }

    const newUser = User.create({ email, password })
    const session = Session.create(newUser)
    const balance = Balance.create(email)
    // console.log('SESION', session)
    Confirm.create(newUser.email)
    res.status(200).json({
      message: 'Користувач успішно зареєстрований!',
      session,
      balance,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Помилка створення користувача!',
    })
  }
})
// ================================================================

router.post('/signin', function (req, res) {
  const { email, password } = req.body
  //   console.log(email, password)
  if (!email || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні!",
    })
  }

  //   console.log(email, password)

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message:
          'Помилка. Користувача за таким e-mail не знайдено!',
      })
    }
    if (password !== user.password) {
      return res.status(400).json({
        message: 'Помилка. Невірний пароль!',
      })
    }

    const session = Session.create(user)
    Notification.create({
      email,
      message: `Здійснено вхід у акаунт`,
      type: 'Warning',
    })
    return res.status(200).json({
      message: 'Ви увійшли в акаунт',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ====================================================
router.post('/signup-confirm-renew', async (req, res) => {
  const { email } = req.body

  if (!email) {
    console.log("Обов'язковий параметр email відсутній.")
    return res.status(400).json({
      message: "Обов'язковий параметр email відсутній.",
    })
  }

  try {
    console.log(
      `Створення коду підтвердження для: ${email}`,
    )

    const user = await User.getByEmail(email)
    if (!user) {
      console.log(
        'Користувача за таким e-mail не знайдено.',
      )
      return res.status(400).json({
        message: 'Користувача за таким e-mail не знайдено!',
      })
    }

    Confirm.create(email)
    console.log('Код підтвердження повторно відправлено.')
    res.status(200).json({
      message: 'Код підтвердження повторно відправлено.',
    })
  } catch (error) {
    console.error('Помилка сервера:', error)
    res
      .status(500)
      .json({ message: 'Внутрішня помилка сервера' })
  }
})

router.post('/signup-confirm', (req, res) => {
  const { code, token } = req.body
  console.log('code', code, 'token', token)

  if (!code) {
    return res.status(400).json(
      {
        message: "Помилка. Обов'язкові поля відсутні!",
      },
      console.log('error empty'),
    )
  }

  try {
    const session = Session.get(token)
    if (!token) {
      return res.status(400).json(
        {
          message: 'Помилка. Ви не увійшли в аккаунт!',
        },
        console.log('login error'),
      )
    }

    const email = Confirm.getData(Number(code))
    if (!email) {
      return res.status(400).json({
        message: 'Код не існує!',
      })
    }
    if (email !== session.user.email) {
      return res.status(400).json({
        message: 'Код не дійсний!',
      })
    }

    const user = User.getByEmail(session.user.email)
    user.isConfirm = true
    session.user.isConfirm = true

    return res.status(200).json({
      message: 'Ви успішно підтвердили свою пошту',
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

router.post('/recovery', (req, res) => {
  console.log('=== Запит на відновлення паролю ===')
  const { email } = req.body

  if (!email) {
    console.error('Помилка: email відсутній')
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні!",
    })
  }

  try {
    console.log('Пошук користувача за email:', email)
    const user = User.getByEmail(email)

    if (!user) {
      console.error(
        'Помилка: Користувача з таким email не знайдено',
      )
      return res.status(400).json({
        message: 'Користувача з таким email не існує!',
      })
    }

    console.log(
      'Створення коду підтвердження для email:',
      email,
    )
    Confirm.create(email)

    console.log(
      'Успіх: Код для відновлення паролю відправлено',
    )
    return res.status(200).json({
      message:
        'Код для відновлення паролю успішно відправлено!',
    })
  } catch (err) {
    console.error('Внутрішня помилка сервера:', err)
    return res.status(500).json({
      message: 'Внутрішня помилка сервера',
    })
  }
})

// ======================
router.post('/recovery-confirm', (req, res) => {
  const { code, password } = req.body
  if (!password || !code) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні!",
    })
  }

  try {
    const email = Confirm.getData(Number(code))
    if (!email) {
      return res.status(400).json({
        message: 'Код не існує',
      })
    }
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'Користувач з таким email не існує!',
      })
    }
    Notification.create({
      email,
      message: `Відправлено запит на відновлення паролю`,
      type: 'Warning',
    })

    user.password = password

    Notification.create({
      email,
      message: `Ваш пароль було змінено`,
      type: 'Warning',
    })

    return res.status(200).json({
      message: 'Пароль змінено',
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})
// ================================================================
router.post('/settings', (req, res) => {
  const { newEmail, email, password, token } = req.body
  //   console.log(newEmail, email, password, token)

  if (!newEmail || !password) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні!",
    })
  }

  try {
    if (User.getByEmail(newEmail)) {
      return res.status(400).json({
        message: 'Користувач з таким email вже існує!',
      })
    }

    const user = User.getByEmail(email)
    console.log('user', user)

    console.log('password', password)
    console.log('userPassword', user.password)
    if (password !== user.password) {
      return res.status(400).json({
        message: 'Пароль не вірний!',
      })
    }
    console.log('==========', user.email)

    const emailBalance = Balance.get(email)
    const emailNotification = Notification.getByEmail(email)

    console.log(emailBalance)
    console.log('==========')
    console.log(emailNotification)
    console.log('==========')

    user.email = newEmail
    let newemail = user.email

    emailBalance.email = newemail
    emailNotification.email = newemail
    Transaction.updateEmail(email, newemail)
    Notification.updateEmail(email, newEmail)

    console.log('==========', newemail)
    Notification.create({
      email,
      message: `Ваш email було змінено!`,
      type: 'Warning',
    })
    return res.status(200).json({
      message: 'Ваш емайл успішно змінено',
      newemail,
    })

    //
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
  //
})
// ============================================================
router.post('/settings-password', (req, res) => {
  const { oldPassword, email, newPassword } = req.body
  //   console.log(newEmail, email, password, token)

  if (!oldPassword || !newPassword || !email) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні!",
    })
  }

  try {
    const user = User.getByEmail(email)
    console.log('user', user)

    console.log('userPassword', user.password)
    if (oldPassword !== user.password) {
      return res.status(400).json({
        message: 'Старий пароль не вірний!',
      })
    }
    console.log('==========', user.email)

    user.password = newPassword
    let newepassword = user.password
    Notification.create({
      email,
      message: `Ваш пароль було змінено!`,
      type: 'Warning',
    })
    return res.status(200).json({
      message: 'Ваш пароль успішно змінено!',
      newPassword,
    })

    //
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
  //
})

// =================================================
router.post('/top-up', (req, res) => {
  const { email, amount, paymentMethod } = req.body
  if (!email || !amount || !paymentMethod) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні!",
    })
  }
  try {
    console.log(
      `Received top-up request for ${email} with amount ${amount}`,
    )
    const transaction = Transaction.create({
      email,
      amount,
      type: 'Receive',
      senderEmail: paymentMethod,
    })
    const balance = Balance.update(email, amount)
    const notification = Notification.create({
      email,
      message: `Баланс поповнено на ${amount}`,
    })
    console.log('Transaction:', transaction)
    console.log('Notification:', notification)
    console.log('Updated balance:', balance)
    res.status(200).json({
      message: 'Баланс поповнено',
      transaction,
      notification,
      balance,
    })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

router.post('/send', (req, res) => {
  const { senderEmail, recipientEmail, amount } = req.body

  if (!senderEmail || !recipientEmail || !amount) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні!",
    })
  }

  try {
    console.log(
      `Received send request from ${senderEmail} to ${recipientEmail} with amount ${amount}`,
    )

    const toUser = User.getByEmail(recipientEmail)
    const fromUser = User.getByEmail(senderEmail)

    if (!toUser) {
      return res.status(400).json({
        message: 'Користувача за таким e-mail не знайдено!',
      })
    }

    let fromBalance = Balance.get(senderEmail)
    console.log(
      `Sender balance before transaction: ${fromBalance.amount}`,
    )

    if (fromBalance.amount < amount) {
      return res
        .status(400)
        .json({ message: 'Недостатньо коштів на рахунку!' })
    }

    // Створення транзакції відправника (тип "send")
    Transaction.create({
      email: senderEmail,
      amount: amount,
      type: 'send', // Тип транзакції
      senderEmail: senderEmail,
      recipientEmail: recipientEmail,
    })

    // Створення транзакції отримувача (тип "receive")
    Transaction.create({
      email: recipientEmail,
      amount: amount,
      type: 'receive', // Тип транзакції
      senderEmail: senderEmail,
      recipientEmail: recipientEmail,
    })

    // Оновлення балансу обох користувачів
    Balance.update(senderEmail, -amount)
    Balance.update(recipientEmail, amount)

    // Створення сповіщень
    Notification.create({
      email: senderEmail,
      message: `Ви відправили ${amount} грн користувачу ${recipientEmail}`,
    })

    Notification.create({
      email: recipientEmail,
      message: `Ви отримали ${amount} грн від користувача ${senderEmail}`,
    })

    const updatedSenderBalance = Balance.get(senderEmail)
    const updatedRecipientBalance =
      Balance.get(recipientEmail)

    console.log(
      `Sender balance after transaction: ${updatedSenderBalance.amount}`,
    )
    console.log(
      `Recipient balance after transaction: ${updatedRecipientBalance.amount}`,
    )

    return res.status(200).json({
      message: 'Кошти успішно відправлено',
      senderBalance: updatedSenderBalance,
      recipientBalance: updatedRecipientBalance,
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

router.post('/balance', (req, res) => {
  const { email } = req.body
  try {
    const balance = Balance.get(email)
    console.log(`Balance for ${email}:`, balance)
    res
      .status(200)
      .json({ message: 'Баланс отримано', balance })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

router.get('/transaction', (req, res) => {
  const { email } = req.query

  if (!email) {
    return res.status(400).json({
      message: "Помилка. Обов'язкове поле email відсутнє!",
    })
  }
  try {
    const transactions = Transaction.getByEmail(email)
    res.status(200).json(transactions) // Перевірте, чи повертає correct transactions
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

router.get('/notification', (req, res) => {
  const { email } = req.query

  if (!email) {
    return res.status(400).json({
      message: "Помилка. Обов'язкове поле email відсутнє!",
    })
  }
  try {
    const notifications = Notification.getByEmail(email)
    res.status(200).json(notifications) // Перевірте, чи повертає correct transactions
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

router.get('/transaction/:id', (req, res) => {
  const { id } = req.params
  const { email } = req.query

  if (!id || !email) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні!",
    })
  }

  try {
    const transaction = Transaction.getById(id)

    if (!transaction || transaction.email !== email) {
      return res.status(404).json({
        message: 'Транзакцію не знайдено!',
      })
    }

    res.status(200).json(transaction)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

// ===================================================================
router.post('/auth-route', (req, res) => {})
module.exports = router
