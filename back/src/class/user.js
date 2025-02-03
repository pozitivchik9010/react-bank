class User {
  static #list = []
  static #count = 1

  constructor({ email, password, isConfirm = false }) {
    this.id = User.#count++
    this.email = String(email).toLowerCase()
    this.password = String(password)
    this.isConfirm = isConfirm
  }

  static create(data) {
    const user = new User(data)

    this.#list.push(user)

    return user
  }

  static getByEmail(email) {
    return (
      this.#list.find(
        (user) =>
          user.email === String(email).toLowerCase(),
      ) || null
    )
  }

  static getById(id) {
    return (
      this.#list.find((user) => user.id === Number(id)) ||
      null
    )
  }
  static getList = () => this.#list
}

module.exports = { User }
