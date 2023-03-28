import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { UsersListScreen } from '../../screens/usersList';
import { NotFoundScreen } from '../../screens/notFound';

function AuthenticatedAppContent() {
  return 'authenticated app';
}

function AuthenticatedApp() {
  return (
    <Routes>
      <Route path="/users" element={<UsersListScreen />} />
      <Route path="/login" element={<Navigate to="/" />} />
      <Route path="/register" element={<Navigate to="/" />} />
      <Route path="/" element={<AuthenticatedAppContent />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
}

export default AuthenticatedApp;
