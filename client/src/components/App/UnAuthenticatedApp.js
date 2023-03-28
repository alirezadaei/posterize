import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { css } from '@emotion/css';
import { IoLogoDribbble } from 'react-icons/io';

import { Button } from '../Lib/Button';
import { LoginScreeen } from '../../screens/login';
import { RegisterScreeen } from '../../screens/register';
import { NotFoundScreen } from '../../screens/notFound';

function UnAuthenticatedAppContent() {
  return (
    <main
      className={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100vh;
      `}
    >
      <div>
        <div
          className={css`
            text-align: center;
          `}
        >
          <IoLogoDribbble
            size={150}
            className={css`
              display: unset;
            `}
          />
        </div>
        <div
          className={css`
            display: flex;
          `}
        >
          <div
            className={css`
              padding-right: 10px;
            `}
          >
            <Button variant="primary" isLink={true} linkTo="/login">
              login
            </Button>
          </div>
          <div
            className={css`
              padding-left: 10px;
            `}
          >
            <Button variant="secondary" isLink={true} linkTo="/register">
              register
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

function UnAuthenticatedApp() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreeen />} />
      <Route path="/register" element={<RegisterScreeen />} />
      <Route path="/" element={<UnAuthenticatedAppContent />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
}

export default UnAuthenticatedApp;
