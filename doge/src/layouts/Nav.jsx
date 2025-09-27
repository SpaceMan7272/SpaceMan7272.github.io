import { useNavigate } from 'react-router-dom';
import NavItem from '../components/NavItem';
import { LayoutGrid, Gamepad2, Cog } from 'lucide-react';
import { useOptions } from '/src/utils/optionsContext';
import pkg from '../../package.json';
import nav from '../styles/nav.module.css';
import theme from '../styles/theming.module.css';
import clsx from 'clsx';
import Logo from '../components/Logo';

const version = pkg.version;
const itemSize = 16;

const navItems = [
  { name: 'Apps',id: 'btn-a', type: LayoutGrid, route: '/materials' },
  { name: 'Games',id: 'btn-g', type: Gamepad2,   route: '/docs' },
  { name: 'Settings',id: 'btn-s', type: Cog,  route: '/settings' },
];

const Nav = () => {
  const navigate = useNavigate();
  const { options } = useOptions();
  const scale = Number(options.navScale || 1);
  const navHeight = Math.round(69 * scale);
  const logoWidth = Math.round(122 * scale);
  const logoHeight = Math.round(41 * scale);
  const versionWidth = Math.max(24, 40 * scale);
  const versionFont = Math.round(9 * scale);
  const versionMargin = Math.round(-10 * scale); 

  const items = navItems.map((item) => ({
    ...item,
    size: itemSize,
    onClick: () => navigate(item.route),
  }));

  return (
    <div
      className={clsx(
        nav.nav,
        theme['nav-backgroundColor'],
        theme[`theme-${options.theme || 'default'}`],
        'backdrop-blur-xs w-full shadow-x1/20 flex items-center pl-6 pr-5 gap-5 z-50',
      )}
      style={{ height: `${navHeight}px` }}
    >
      <Logo
        width={logoWidth}
        height={logoHeight}
        action={() => navigate('/')}
      />
      <div
        className="border rounded-full text-center"
        style={{
          width: `${versionWidth}px`,
          fontSize: `${versionFont}px`,
          marginLeft: `${versionMargin}px`,
        }}
      >
        v{version}
      </div>
      <div
        className="flex items-center gap-5 ml-auto"
        style={{ height: 'calc(100% - 0.5rem)' }}
      >
        <NavItem items={items} />
      </div>
    </div>
  );
};

export default Nav;
