export const REG_EXP_EMAIL = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/);

export const REG_EXP_PASSWORD = new RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
);

export class Form {
  FIELD_NAME = {};
  FIELD_ERROR = {};

  value = {};
  error = {};
  disabled = true;

  change = (name, value) => {
    const error = this.validate(name, value);
    this.value[name] = value;

    if (error) {
      this.setError(name, error);
      this.error[name] = error;
    } else {
      this.setError(name, null);
      delete this.error[name];
    }

    this.updateDisabledState();
  };

  setError = (name, error) => {
    const span = document.querySelector(`.form__error[name="${name}"]`);
    const field = document.querySelector(`.validation[name="${name}"]`);

    if (span) {
      span.classList.toggle("form__error--active", Boolean(error));
      span.innerText = error || "";
    }

    if (field) {
      field.classList.toggle("validation--active", Boolean(error));
    }
  };

  updateDisabledState = () => {
    const hasErrors = Object.values(this.FIELD_NAME).some(
      (name) => this.error[name] || !this.value[name]
    );

    this.disabled = hasErrors;

    const button = document.querySelector(`.button`);
    if (button) {
      button.classList.toggle("button--disabled", hasErrors);
      button.disabled = hasErrors;
    }
  };

  validateAll = () => {
    let hasErrors = false;

    Object.values(this.FIELD_NAME).forEach((name) => {
      const value = this.value[name] || "";
      const error = this.validate(name, value);
      if (error) {
        this.error[name] = error;
        hasErrors = true;
      } else {
        delete this.error[name];
      }

      this.setError(name, error);
    });
    this.updateDisabledState();
    return hasErrors;
  };

  setAlert = (status, text) => {
    const alert = document.querySelector(`.alert`);
    if (!alert) return;

    alert.className = `alert alert--${status}`;
    alert.innerText = text || "";
  };
}
