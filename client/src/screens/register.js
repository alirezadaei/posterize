import { css } from '@emotion/css';
import { IoLogoDribbble } from 'react-icons/io';
import { useForm } from 'react-hook-form';

import { Button } from '../components/Lib/Button';
import { Input } from '../components/Lib/Input';
import { useAuth } from '../context/auth-context';
import { useAsync } from '../utils/hooks';

function RegisterScreeen() {
  const { register } = useAuth();
  const { isLoading, isError, error, run } = useAsync();

  const { handleSubmit, control, getValues } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onChange',
  });

  function handleFormSubmit() {
    const usernameValue = getValues('username');
    const passwordValue = getValues('password');

    run(
      register({
        username: usernameValue,
        password: passwordValue,
      })
    );
  }

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
        <div>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div
              className={css`
                padding-bottom: 15px;
              `}
            >
              <Input name="username" placeholder="username" control={control} />
            </div>
            <div
              className={css`
                padding-bottom: 15px;
              `}
            >
              <Input
                name="password"
                placeholder="password"
                type="password"
                control={control}
              />
            </div>
            <div>
              <Button type="submit" variant="accent">
                submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export { RegisterScreeen };
