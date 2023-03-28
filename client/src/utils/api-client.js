// import { queryCache } from 'react-query';

import * as auth from '../utils/auth-provider';

// const apiURL = process.env.API_URL;

async function clientFetch(
  endpoint,
  { data, token, headers: customHeaders, ...customConfig } = {}
) {
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  };

  return window
    .fetch(`http://localhost:4000/api/${endpoint}`, config)
    .then(async (response) => {
      if (response.status === 401) {
        // queryCache.clear();
        await auth.logout();
        // refresh the page for them
        window.location.assign(window.location);
        return Promise.reject({ message: 'Please re-authenticate.' });
      }
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    });
}

export { clientFetch };
