import clsx from 'clsx';
import { useOptions } from '/src/utils/optionsContext';

export default function Logo({ options, action, width, height }) {
  const { options: op } = useOptions();
  const lightAdj = op.type == 'light' ? { filter: 'invert(80%)' } : null;

  return (
    <img
      src="/logo.svg"
      className={clsx(options, action && 'cursor-pointer duration-300 ease-out scale-[1.12] hover:scale-[1.15]', 'select-none')}
      id="btn-logo"
      draggable="false"
      alt="logo"
      onClick={action && action}
      style={{
        ...lightAdj,
        ...(width ? { width: width } : null),
        ...(height ? { height: height } : null),
      }}
    />
  );
}
