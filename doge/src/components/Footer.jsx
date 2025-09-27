import { useOptions } from '../utils/optionsContext';
import Disc from './Discord';
import clsx from 'clsx';

const Footer = () => {
  const { options } = useOptions();
  return (
      <div className="w-full fixed bottom-0 flex items-end justify-between p-2">
        <div
          className={clsx(
            'flex gap-1 items-center cursor-pointer',
            'hover:-translate-y-0.5 duration-200',
          )}
          onClick={() => window.open('/ds', '_blank')}
        >
          <Disc className="w-4" fill={options.siteTextColor || "#a0b0c8"} />
          Discord
        </div>
        {options.donationBtn !== false && (
          <a href="https://www.buymeacoffee.com/dogubdev" target="_blank" rel="noopener noreferrer">
            <img
              src="https://img.buymeacoffee.com/button-api/?text=Support us&emoji=☕&slug=dogubdev&button_colour=40DCA5&font_colour=ffffff&font_family=Inter&outline_colour=000000&coffee_colour=FFDD00"
              alt="Support us"
              className="w-32 h-auto"
            />
          </a>
        )}
      </div>
  );
};

export default Footer;
