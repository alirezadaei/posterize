import { useController } from 'react-hook-form';

function Input({ control, rules, name, type = 'text', placeholder = '' }) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: rules,
  });

  const inputClasses = {
    defaultClasses: `input input-bordered w-full max-w-xs ${
      error ? 'input-error' : ''
    }`,
  };

  return (
    <input
      type={type}
      name={field.name}
      onChange={field.onChange}
      onBlur={field.onBlur}
      placeholder={placeholder}
      className={inputClasses.defaultClasses}
    />
  );
}

export { Input };
