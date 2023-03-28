import { Link } from 'react-router-dom';

function Button({ children, type, variant, isLink, linkTo, isLoading }) {
  const buttonClasses = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    accent: 'btn btn-accent',
    loading: isLoading ? 'btn loading' : null,
  };

  const content = isLink ? (
    <Link to={linkTo}>
      <button
        type={type ? type : 'button'}
        className={`${buttonClasses[variant]}`}
      >
        {children}
      </button>
    </Link>
  ) : isLoading ? (
    <button
      type={type ? type : 'button'}
      className={`${buttonClasses[variant]}`}
    >
      {children}
    </button>
  ) : (
    <button
      type={type ? type : 'button'}
      className={`${buttonClasses[variant]}`}
    >
      {children}
    </button>
  );

  return content;
}

export { Button };
