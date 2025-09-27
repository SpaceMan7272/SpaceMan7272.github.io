import clsx from 'clsx';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LucideSearch, Earth } from 'lucide-react';
import { GlowWrapper } from '../utils/Glow';
import { useOptions } from '../utils/optionsContext';
import Logo from '../components/Logo';
import theme from '../styles/theming.module.css';
import 'movement.css';

export default function SearchContainer({ logo = true, cls, nav = true }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const debounceTimeoutRef = useRef(null);
  const latestQueryRef = useRef('');
  const navigate = useNavigate();
  const { options } = useOptions();

  const fetchResults = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    latestQueryRef.current = searchQuery;

    try {
      const response = await fetch('/return?q=' + encodeURIComponent(searchQuery));

      if (!response.ok) {
        if (latestQueryRef.current === searchQuery) {
          setResults([]);
          setShowResults(false);
        }
        return;
      }

      const data = await response.json();

      if (latestQueryRef.current === searchQuery) {
        const validResults = Array.isArray(data)
          ? data.filter((item) => item.phrase).slice(0, 4)
          : [];

        setResults(validResults);
        setShowResults(validResults.length > 0);
      }
    } catch {
      if (latestQueryRef.current === searchQuery) {
        setResults([]);
        setShowResults(false);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (!newQuery.trim()) {
      setResults([]);
      latestQueryRef.current = '';
      setShowResults(false);
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
      return;
    }
    debounceTimeoutRef.current && clearTimeout(debounceTimeoutRef.current);

    debounceTimeoutRef.current = setTimeout(() => {
      fetchResults(newQuery);
    }, 300);
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      const trimmed = query.trim();
      if (trimmed && nav) {
        sessionStorage.setItem('query', trimmed);
        navigate('/indev');
      } else if (trimmed) {
        window.parent.tabManager.navigate(trimmed);
      }
    }
  };

  const handleResultClick = (phrase) => {
    if (nav) {
      sessionStorage.setItem('query', phrase);
      navigate('/indev');
    } else {
      window.parent.tabManager.navigate(phrase);
    }
  };

  // on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  const placeholder = `Search ${options.engineName || 'Google'} or type URL`;
  const iconSrc =
    options.engineIcon === undefined
      ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/120px-Google_Favicon_2025.svg.png'
      : options.engineIcon;

  return (
    <div
      className={clsx(
        !cls ? 'absolute w-full px-20 py-4 flex flex-col items-center mt-8 z-50' : cls,
      )}
      data-m={!cls && 'bounce-up'}
      data-m-duration={!cls && '0.8'}
    >
      {logo && <Logo options="w-[15rem] h-30" />}
      <GlowWrapper
        glowOptions={{ color: options.glowWrapperColor || '255, 255, 255', size: 70, opacity: 0.2 }}
      >
        <div className="w-[40.625rem]">
          <div
            id="search-div"
            className={clsx(
              'flex items-center gap-3 shadow-xl pl-4 pr-4 w-full h-[3.41rem]',
              showResults ? 'rounded-t-[14px] rounded-b-none' : 'rounded-[14px]',
              theme[`searchBarColor`],
              theme[`theme-${options.theme || 'default'}`],
            )}
          >
            {iconSrc ? (
              <img src={iconSrc} className="w-5 h-5 shrink-0" alt="Search icon" />
            ) : (
              <Earth size={22} />
            )}

            <input
              type="text"
              placeholder={placeholder}
              className="flex-1 bg-transparent outline-hidden text-[16.5px] leading-[20px] placeholder:font-[Inter] placeholder:font-medium"
              autoComplete="off"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />

            <LucideSearch className="w-[1.08rem] h-[1.08rem] shrink-0" />
          </div>

          {showResults && results.length > 0 && (
            <div
              className={clsx(
                'shadow-xl mt-0 p-2 text-[14px] w-full rounded-b-[14px] space-y-1',
                theme[`searchResultStyle`],
                theme[`theme-${options.theme || 'default'}`],
              )}
            >
              {results.map((result, index) => (
                <div
                  key={index}
                  className="rounded-[9px] w-full h-11 hover:bg-[#d4d4d418] cursor-pointer duration-100 ease-in px-3 pl-2.5 flex items-center"
                  onClick={() => handleResultClick(result.phrase)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginRight: '12px' }}
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                  <span className="text-[15px]">{result.phrase}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </GlowWrapper>
    </div>
  );
}
