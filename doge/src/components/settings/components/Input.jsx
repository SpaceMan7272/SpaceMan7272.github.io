import clsx from 'clsx';
import { useOptions } from '/src/utils/optionsContext';

const TextInput = ({ defValue, onChange, placeholder = 'Enter text', maxW = 40 }) => {
  const { options } = useOptions();

  return (
    <div
      className={clsx('relative w-full', 'rounded-xl border')}
      style={{
        backgroundColor: options.settingsDropdownColor || '#1a2a42',
        maxWidth: `${maxW}rem`,
      }}
    >
      <div className={clsx('flex w-full h-10', 'p-2.5 pl-5')}>
        <input
          type="text"
          defaultValue={defValue}
          placeholder={placeholder}
          spellCheck="false"
          onBlur={(e) => onChange?.(e.target.value)}
          className="flex-1 min-w-0 text-[0.9rem] truncate bg-transparent outline-none"
        />
      </div>
    </div>
  );
};

export default TextInput;
