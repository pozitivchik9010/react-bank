class Transaction {
  static #list = []
  static #count = 0

  constructor(
    email,
    amount,
    type,
    senderEmail,
    recipientEmail,
  ) {
    this.id = Transaction.#count++
    this.email = email
    this.amount = amount
    this.type = type
    this.senderEmail = senderEmail
    this.recipientEmail = recipientEmail
    this.date = new Date()
  }

  static create(data) {
    const transaction = new Transaction(
      data.email,
      data.amount,
      data.type,
      data.senderEmail,
      data.recipientEmail,
    )
    this.#list.push(transaction)
    return transaction
  }

  static updateEmail(oldEmail, newEmail) {
    this.#list.forEach((transaction) => {
      if (transaction.email === oldEmail) {
        transaction.email = newEmail
      }
      if (transaction.senderEmail === oldEmail) {
        transaction.senderEmail = newEmail
      }
      if (transaction.recipientEmail === oldEmail) {
        transaction.recipientEmail = newEmail
      }
    })
  }

  static getById(id) {
    return (
      this.#list.find(
        (transaction) => transaction.id === Number(id),
      ) || null
    )
  }

  static getByEmail(email) {
    return this.#list.filter((tx) => tx.email === email)
  }

  static getAll() {
    return this.#list
  }
}

module.exports = {
  Transaction,
}
