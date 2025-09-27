import styles from '/src/styles/settings.module.css';
import ComboBox from './Combobox';
import Switch from './Switch';
import Input from './Input';
import Button from './Button';
import clsx from 'clsx';
import { useOptions } from '/src/utils/optionsContext';

const SettingsContainerItem = ({
  config,
  action,
  name,
  type,
  children,
  value,
  disabled = false,
}) => {
  const { options } = useOptions();

  return (
    <div
      className={clsx(
        'flex items-center justify-between w-full min-h-[5rem] rounded-[1rem] pl-5 p-3 duration-150 transition-all',
        disabled && 'opacity-60 pointer-events-none',
      )}
      style={{ backgroundColor: options.settingsContainerColor || '#1f324e' }}
    >
      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="text-[1rem] font-[SFProText] truncate">{name}</p>
        <p className={`${styles.desc} truncate`}>{children}</p>
      </div>

      {!disabled && (
        <div className="flex-shrink-0 ml-4">
          {type === 'select' && (
            <ComboBox config={config} action={action} selectedValue={value} maxW={13} />
          )}
          {type === 'switch' && <Switch action={action} value={value} />}
          {type === 'input' && <Input onChange={action} defValue={value} />}
          {type === 'button' && <Button action={action} value={value} />}
        </div>
      )}
    </div>
  );
};

export default SettingsContainerItem;
