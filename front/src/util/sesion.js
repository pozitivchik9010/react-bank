export const SESSION_KEY = "sessionAuth";

export const saveSession = (session) => {
  try {
    window.session = session;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    window.session = null;
  }
};

export const loadSession = () => {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));

    if (session) {
      window.session = session;
    } else {
      window.session = null;
    }
  } catch (err) {
    window.session = null;
  }
};

export const getTokenSession = () => {
  try {
    const session = getSession();
    return session ? session.token : null;
  } catch (err) {
    return null;
  }
};

export const getSession = () => {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    return session || null;
  } catch (err) {
    return null;
  }
};
