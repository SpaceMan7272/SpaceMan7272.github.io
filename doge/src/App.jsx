import Routing from './Routing';
import ReactGA from "react-ga4";
import Loader from './pages/Loader';
import lazyLoad from './lazyWrapper';
import NotFound from './pages/NotFound';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { OptionsProvider, useOptions } from './utils/optionsContext';
import { initPreload } from './utils/preload';
import './index.css';
import 'nprogress/nprogress.css';

const importHome = () => import('./pages/Home');
const importApps = () => import('./pages/Apps');
const importGames = () => import('./pages/Games');
const importSettings = () => import('./pages/Settings');

const Home = lazyLoad(importHome);
const Apps = lazyLoad(importApps);
const Games = lazyLoad(importGames);
const Settings = lazyLoad(importSettings);
const New = lazyLoad(() => import ('./pages/New'));

initPreload('/materials', importApps);
initPreload('/docs', importGames);
initPreload('/settings', importSettings);
initPreload('/', importHome);

function useTracking() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);
}

const ThemedApp = () => {
  const { options } = useOptions();
  useTracking();

  const pages = [
    { path: '/', element: <Home /> },
    { path: '/materials', element: <Apps /> },
    { path: '/docs', element: <Games /> },
    { path: '/indev', element: <Loader /> },
    { path: '/settings', element: <Settings /> },
    { path: '/new', element: <New /> },
    { path: '*', element: <NotFound /> },
  ];

  return (
    <>
      <Routing pages={pages} />
      <style>{`
        body { 
          color: ${options.siteTextColor || '#a0b0c8'};
          background-image: radial-gradient(circle, rgba(${
            options.bgDesignColor || '66, 69, 73'
          }, 0.212) 3px, transparent 1px);
          background-color: ${options.bgColor || '#111827'};
        }
      `}</style>
    </>
  );
};

const App = () => (
  <OptionsProvider>
    <ThemedApp />
  </OptionsProvider>
);

export default App;
