import clsx from 'clsx';
import { useState, useMemo } from 'react';
import Nav from '../layouts/Nav';
import theme from '../styles/theming.module.css';
import { Search, HatGlasses, Palette, Globe, Wrench } from 'lucide-react';
import { useOptions } from '/src/utils/optionsContext';
import RenderSetting from '../components/Settings';
import { privacyConfig, customizeConfig, browsingConfig, advancedConfig } from '/src/data/settings';

const configs = [
  {
    name: 'Privacy',
    icon: HatGlasses,
    keywords: ['title', 'cloak', 'cloaking', 'tab cloak', 'about', 'about:blank', 'blank'],
    fn: privacyConfig,
  },
  {
    name: 'Customize',
    icon: Palette,
    keywords: [
      'theme',
      'color',
      'appearance',
      'ui',
      'interface',
      'games',
      'pages',
      'apps',
      'scale',
      'nav',
      'navigation bar',
      'nav bar',
      'navbar',
      'size',
      'donate',
      'donation',
      'tabs bar',
      'tab bar'
    ],
    fn: customizeConfig,
  },
  {
    name: 'Browsing',
    icon: Globe,
    keywords: ['tabs', 'tab', 'proxy engine', 'search engine', 'scramjet', 'ultraviolet'],
    fn: browsingConfig,
  },
  {
    name: 'Advanced',
    icon: Wrench,
    keywords: [
      'wisp',
      'proxy',
      'ultraviolet',
      'bare',
      'leave confirmation',
      'debug',
      'experimental',
      'inspect',
      'reset instance',
      'clear cache'
    ],
    fn: advancedConfig,
  },
];

const Settings = () => {
  const { options, updateOption } = useOptions();
  const [query, setQuery] = useState('');
  const [content, setContent] = useState('Privacy');

  const settings = useMemo(
    () =>
      configs.map(({ fn, ...rest }) => ({
        ...rest,
        items: Object.values(fn({ options, updateOption })).map(({ name, desc }) => ({ name, desc })),
      })),
    [options, updateOption],
  );

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return settings;
    return settings.filter(
      ({ name, keywords, items }) =>
        name.toLowerCase().includes(q) ||
        keywords.some((kw) => kw.toLowerCase().includes(q)) ||
        items.some((i) => i.name.toLowerCase().includes(q)),
    );
  }, [settings, q]);

  const matchedSettingsCount = useMemo(
    () =>
      settings.reduce(
        (count, { items }) =>
          count + items.filter((i) => i.name.toLowerCase().includes(q)).length,
        0,
      ),
    [settings, q],
  );

  const showKeywordTooltip =
    q &&
    filtered.length > 0 &&
    !filtered.some((s) => s.name.toLowerCase().includes(q)) &&
    filtered.some((s) => s.keywords.some((kw) => kw.toLowerCase().includes(q)));

  const showSettingMatches = q && matchedSettingsCount > 0;

  return (
    <div className="flex flex-col h-screen">
      <div className="shrink-0">
        <Nav />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={clsx(
            theme[`settings-panelColor`],
            theme[`theme-${options.theme || 'default'}`],
            'w-60 shrink-0 overflow-y-auto p-2 pt-3',
          )}
        >
          <div
            className="flex items-center max-w-52 h-7 rounded-lg mx-auto px-2"
            style={{ backgroundColor: options.settingsSearchBar || '#3c475a' }}
          >
            <Search className="w-4 mr-1.5" />
            <input
              type="text"
              placeholder="Filter settings"
              className="bg-transparent outline-hidden w-full text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {showKeywordTooltip && !showSettingMatches && (
            <div className="mt-2 text-xs text-gray-400 text-center px-2">
              May contain what you're looking for
            </div>
          )}

          {showSettingMatches && (
            <div className="mt-2 text-xs text-gray-400 text-center px-2">
              Found {matchedSettingsCount} matching settings
            </div>
          )}

          <div className="flex flex-col gap-3 mt-5">
            {filtered.map(({ name, icon: Icon, items }) => {
              const matchedItems = q
                ? items.filter((i) => i.name.toLowerCase().includes(q))
                : [];

              return (
                <div
                  key={name}
                  className={clsx(
                    'w-full flex flex-col rounded-xl duration-75 cursor-pointer px-5 py-2',
                    content !== name && 'bg-transparent hover:bg-[#ffffff23]',
                  )}
                  style={{
                    backgroundColor:
                      content === name
                        ? options.settingsPanelItemBackgroundColor || '#405a77'
                        : undefined,
                  }}
                  onClick={() => setContent((prev) => (prev === name ? '' : name))}
                >
                  <div className="flex items-center h-6">
                    <Icon className="w-5" />
                    <p className="mx-4">{name}</p>
                  </div>

                  {matchedItems.length > 0 && (
                    <p className="ml-9 text-xs text-gray-400 truncate">
                      {matchedItems.map((i) => i.name).join(', ')}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <RenderSetting setting={content} />
      </div>
    </div>
  );
};

export default Settings;
