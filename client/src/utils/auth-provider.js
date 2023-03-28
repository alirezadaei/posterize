const accessTokenLocalStorageKey = '__ac_token__';
const userLocalStorageKey = '__user__';

async function getAccessToken() {
  return window.localStorage.getItem(accessTokenLocalStorageKey);
}

async function setAccessToken(accessToken) {
  return window.localStorage.setItem(accessTokenLocalStorageKey, accessToken);
}

async function getUser() {
  return window.localStorage.getItem(userLocalStorageKey);
}

async function setUser(user) {
  return window.localStorage.setItem(userLocalStorageKey, user);
}

function handleUserResponse({ user, accessToken }) {
  window.localStorage.setItem(accessTokenLocalStorageKey, accessToken);
  window.localStorage.setItem(userLocalStorageKey, JSON.stringify(user));
  return user;
}

function login({ username, password }) {
  return clientFetch('auth/login', { username, password }).then(
    handleUserResponse
  );
}

function register({ username, password }) {
  return clientFetch('auth/register', { username, password }).then(
    handleUserResponse
  );
}

async function logout() {
  window.localStorage.removeItem(accessTokenLocalStorageKey);
  window.localStorage.removeItem(userLocalStorageKey);
}

// const apiUrl = process.env.API_URL;

async function clientFetch(endpoint, data) {
  const config = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  };

  return window
    .fetch(`http://localhost:4000/api/${endpoint}`, config)
    .then(async (response) => {
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    });
}

export {
  getAccessToken,
  setAccessToken,
  getUser,
  setUser,
  login,
  register,
  logout,
};
