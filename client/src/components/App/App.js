import * as React from 'react';

import { useAuth } from '../../context/auth-context';
import { FullPageSpinner } from '../Lib/FullPageSpinner';

const AuthenticatedApp = React.lazy(() =>
  import(/* webpackPrefetch: true */ './AuthenticatedApp')
);
const UnauthenticatedApp = React.lazy(() => import('./UnAuthenticatedApp'));

function App() {
  const { user } = useAuth();
  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {user.user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  );
}

export { App };
