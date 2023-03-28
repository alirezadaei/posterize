import React from 'react';
import { queryCache } from 'react-query';

import * as auth from '../utils/auth-provider';
import { clientFetch } from '../utils/api-client';
import { useAsync } from '../utils/hooks';
import { FullPageSpinner } from '../components/Lib/FullPageSpinner';

const AuthContext = React.createContext();
AuthContext.displayName = 'AuthContext';

async function bootstrapAppData() {
  let user = null;
  let accessToken = null;

  const oldAccessToken = await auth.getAccessToken();
  if (oldAccessToken) {
    let token = oldAccessToken;
    const data = await clientFetch('auth/refresh', {
      token,
      credentials: 'include',
    });
    // queryCache.setQueryData('list-items', data.listItems, {
    //   staleTime: 5000,
    // });
    // for (const listItem of data.listItems) {
    //   setQueryDataForBook(listItem.book);
    // }
    user = data.user;
    accessToken = data.accessToken;
    auth.setAccessToken(accessToken);
    auth.setUser(JSON.stringify(user));
  }
  return { user, accessToken };
}

// below we define auth functions and set user data and state, after that we return authProvider
function AuthProvider(props) {
  const {
    data: user,
    status,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync();

  React.useEffect(() => {
    const appDataPromise = bootstrapAppData();
    run(appDataPromise);
  }, [run]);

  const login = React.useCallback(
    (form) => auth.login(form).then((user) => setData(user)),
    [setData]
  );
  const register = React.useCallback(
    (form) => auth.register(form).then((user) => setData(user)),
    [setData]
  );
  const logout = React.useCallback(() => {
    auth.logout();
    queryCache.clear();
    setData(null);
  }, [setData]);

  const value = React.useMemo(
    () => ({ user, login, logout, register }),
    [login, logout, register, user]
  );

  if (isLoading || isIdle) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return { error };
  }

  if (isSuccess) {
    return <AuthContext.Provider value={value} {...props} />;
  }

  throw new Error(`Unhandled status: ${status}`);
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}

function useClient() {
  const { user } = useAuth();
  const token = user?.token;
  return React.useCallback(
    (endpoint, config) => clientFetch(endpoint, { ...config, token }),
    [token]
  );
}

export { AuthProvider, useAuth, useClient };
