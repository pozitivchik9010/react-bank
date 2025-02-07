class Notification {
  static #list = []
  static #count = 1

  constructor(email, message, type) {
    this.id = Notification.#count++
    this.email = email
    this.message = message
    this.type = type
    this.date = new Date()
  }

  static create(data) {
    const notification = new Notification(
      data.email,
      data.message,
      data.type,
    )
    this.#list.push(notification)
    return notification
  }

  static updateEmail(email, newEmail) {
    const notification = this.#list.filter(
      (notif) => notif.email === email,
    )
    if (notification.length > 0) {
      notification.forEach((notif) => {
        notif.email = newEmail
      })
      return notification
    }
    throw new Error(
      `Notification with email ${email} not found`,
    )
  }

  static getByEmail(email) {
    return this.#list.filter(
      (notif) => notif.email === email,
    )
  }
}

module.exports = { Notification }
