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
  isConfirm: true,
})
User.create({
  email: 'developer@mail.com',
  password: 234,
})

router.post('/signup', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: 'Error. Required fields are missing!!',
    })
  }
  try {
    const user = User.getByEmail(email)

    if (user) {
      return res.status(400).json({
        message:
          'Error. A user with this email already exists!',
      })
    }

    const newUser = User.create({ email, password })
    const session = Session.create(newUser)
    const balance = Balance.create(email)
    Confirm.create(newUser.email)
    res.status(200).json({
      message: 'User successfully registered!',
      session,
      balance,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Error creating user!',
    })
  }
})
// ================================================================

router.post('/signin', function (req, res) {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      message: 'Error: Required fields are missing!!',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message:
          'Error: User with this email address not found!',
      })
    }
    if (password !== user.password) {
      return res.status(400).json({
        message: 'Error: Incorrect password.!',
      })
    }

    const session = Session.create(user)
    Notification.create({
      email,
      message: `Account logged in!`,
      type: 'Warning',
    })
    return res.status(200).json({
      message: 'You are logged in.',
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
    return res.status(400).json({
      message: 'The required email parameter is missing!',
    })
  }

  try {
    const user = await User.getByEmail(email)
    if (!user) {
      return res.status(400).json({
        message: 'No user found with this email address.',
      })
    }

    Confirm.create(email)
    res.status(200).json({
      message: 'Confirmation code resent.',
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error: Internal server error!' })
  }
})

router.post('/signup-confirm', (req, res) => {
  const { code, token } = req.body

  if (!code) {
    return res.status(400).json({
      message: 'Error: Required fields are missing!!',
    })
  }

  try {
    const session = Session.get(token)
    if (!token) {
      return res.status(400).json({
        message: 'Error: You are not logged in!',
      })
    }

    const email = Confirm.getData(Number(code))
    if (!email) {
      return res.status(400).json({
        message: 'Error: Code does not exist!',
      })
    }
    if (email !== session.user.email) {
      return res.status(400).json({
        message: 'Error: The code is not valid!',
      })
    }

    const user = User.getByEmail(session.user.email)
    user.isConfirm = true
    session.user.isConfirm = true

    return res.status(200).json({
      message: 'You have successfully verified your email!',
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

router.post('/recovery', (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({
      message: 'Error: Required fields are missing!!',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message:
          'Error: User with this email address not found!',
      })
    }

    Confirm.create(email)

    return res.status(200).json({
      message: 'Password recovery code sent successfully!',
    })
  } catch (err) {
    return res.status(500).json({
      message: 'Error: Internal server error!',
    })
  }
})

// ======================
router.post('/recovery-confirm', (req, res) => {
  const { code, password } = req.body
  if (!password || !code) {
    return res.status(400).json({
      message: 'Error: Required fields are missing!!',
    })
  }

  try {
    const email = Confirm.getData(Number(code))
    if (!email) {
      return res.status(400).json({
        message: 'Error: Code does not exist',
      })
    }
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message:
          'Error: User with this email does not exist!',
      })
    }
    Notification.create({
      email,
      message: `Password recovery request sent.`,
      type: 'Warning',
    })

    user.password = password

    Notification.create({
      email,
      message: `Your password has been changedrequest password recovery`,
      type: 'Warning',
    })

    return res.status(200).json({
      message: 'Password changed',
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})
// ================================================================
router.post('/settings-email', (req, res) => {
  const { newEmail, email, password, token } = req.body

  if (!newEmail || !password) {
    return res.status(400).json({
      message: 'Error: Required fields are missing!!',
    })
  }

  try {
    if (User.getByEmail(newEmail)) {
      return res.status(400).json({
        message:
          'Error: A user with this email already exists!',
      })
    }

    const user = User.getByEmail(email)

    if (password !== user.password) {
      return res.status(400).json({
        message: 'Error: The password is incorrect.!',
      })
    }

    const emailBalance = Balance.get(email)
    const emailNotification = Notification.getByEmail(email)

    user.email = newEmail
    let newemail = user.email

    emailBalance.email = newemail

    Transaction.updateEmail(email, newemail)
    Notification.updateEmail(email, newEmail)

    Notification.create({
      email: newemail,
      message: `Your email has been changed!`,
      type: 'Warning',
    })
    return res.status(200).json({
      message: 'Your email has been changed!',
      newemail,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})
// ============================================================
router.post('/settings-password', (req, res) => {
  const { oldPassword, email, newPassword } = req.body

  if (!oldPassword || !newPassword || !email) {
    return res.status(400).json({
      message: 'Error: Required fields are missing!!',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (oldPassword !== user.password) {
      return res.status(400).json({
        message: 'Error: The old password is incorrect!',
      })
    }

    user.password = newPassword
    let newepassword = user.password
    Notification.create({
      email,
      message: `Your password has been changed!`,
      type: 'Warning',
    })
    return res.status(200).json({
      message: 'Your password has been changed!',
      newPassword,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

// =================================================
router.post('/top-up', (req, res) => {
  const { email, amount, paymentMethod } = req.body
  if (!email || !amount || !paymentMethod) {
    return res.status(400).json({
      message: 'Error: Required fields are missing!!',
    })
  }
  try {
    const transaction = Transaction.create({
      email,
      amount,
      type: 'Receive',
      senderEmail: paymentMethod,
    })
    const balance = Balance.update(email, amount)
    const notification = Notification.create({
      email,
      message: `Balance replenished by ${amount}`,
    })

    res.status(200).json({
      message: 'Balance replenished',
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
      message: 'Error: Required fields are missing!!',
    })
  }

  try {
    const toUser = User.getByEmail(recipientEmail)
    const fromUser = User.getByEmail(senderEmail)

    if (!toUser) {
      return res.status(400).json({
        message: 'No user found with this email address!',
      })
    }

    let fromBalance = Balance.get(senderEmail)

    if (fromBalance.amount < amount) {
      return res.status(400).json({
        message: 'Insufficient funds in the account!',
      })
    }

    Transaction.create({
      email: senderEmail,
      amount: amount,
      type: 'send',
      senderEmail: senderEmail,
      recipientEmail: recipientEmail,
    })

    Transaction.create({
      email: recipientEmail,
      amount: amount,
      type: 'receive',
      senderEmail: senderEmail,
      recipientEmail: recipientEmail,
    })

    Balance.update(senderEmail, -amount)
    Balance.update(recipientEmail, amount)

    Notification.create({
      email: senderEmail,
      message: `You have sen ${amount} $ to ${recipientEmail}
	`,
    })

    Notification.create({
      email: recipientEmail,
      message: `You have sen ${amount} $ to ${recipientEmail}`,
    })

    const updatedSenderBalance = Balance.get(senderEmail)
    const updatedRecipientBalance =
      Balance.get(recipientEmail)

    return res.status(200).json({
      message: 'Funds sent successfully',
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
    res
      .status(200)
      .json({ message: 'Balance received', balance })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

router.get('/transaction', (req, res) => {
  const { email } = req.query

  if (!email) {
    return res.status(400).json({
      message: 'Error. Required email field is missing!',
    })
  }
  try {
    const transactions = Transaction.getByEmail(email)
    res.status(200).json(transactions)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

router.get('/notification', (req, res) => {
  const { email } = req.query

  if (!email) {
    return res.status(400).json({
      message: 'Error. Required email field is missing!',
    })
  }
  try {
    const notifications = Notification.getByEmail(email)
    res.status(200).json(notifications)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

router.get('/transaction/:id', (req, res) => {
  const { id } = req.params
  const { email } = req.query

  if (!id || !email) {
    return res.status(400).json({
      message: 'Error: Required fields are missing!!',
    })
  }

  try {
    const transaction = Transaction.getById(id)

    if (!transaction || transaction.email !== email) {
      return res.status(404).json({
        message: 'Transaction not found!',
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
