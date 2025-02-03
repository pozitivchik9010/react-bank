class Balance {
  static #list = []

  constructor(email, amount = 0) {
    this.email = email
    this.amount = amount
  }

  static create(email, amount = 0) {
    const balance = new Balance(email, amount)
    this.#list.push(balance)
    return balance
  }

  static get(email) {
    const balance =
      this.#list.find((bal) => bal.email === email) ||
      this.create(email)
    return balance
  }

  static update(email, amount) {
    const balance = this.get(email)

    balance.amount += Number(amount)

    return balance
  }
}

module.exports = { Balance }
