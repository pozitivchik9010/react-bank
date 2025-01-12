class Balance {
  static #list = []

  constructor(email, amount = 0) {
    this.email = email
    this.amount = amount
  }

  static create(email, amount = 0) {
    const balance = new Balance(email, amount)
    this.#list.push(balance)
    console.log(`Created balance:`, balance)
    return balance
  }

  static get(email) {
    const balance =
      this.#list.find((bal) => bal.email === email) ||
      this.create(email)
    console.log(`Retrieved balance for ${email}:`, balance)
    return balance
  }

  static update(email, amount) {
    const balance = this.get(email)
    console.log(
      `Current balance before update for ${email}:`,
      balance.amount,
    )
    balance.amount += Number(amount) // Переконатися, що amount це число
    console.log(
      `Updated balance for ${email}:`,
      balance.amount,
    )
    return balance
  }
}

module.exports = { Balance }
