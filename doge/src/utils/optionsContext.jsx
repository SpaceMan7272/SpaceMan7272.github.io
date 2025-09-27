import { createContext, useContext, useState, useEffect } from "react";

const OptionsContext = createContext();

export const OptionsProvider = ({ children }) => {
  const [options, setOptions] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("options") || "{}");
    return { ...saved };
  });

  useEffect(() => {
    localStorage.setItem("options", JSON.stringify(options));
  }, [options]);

  /**
   * @param {Object} obj - options to merge
   * @param {boolean} immediate - if true, update state immediately; false = only localStorage
   */
  const updateOption = (obj, immediate = true) => {
    if (!obj || typeof obj !== "object") return;

    const current = JSON.parse(localStorage.getItem("options") || "{}");
    const updated = { ...current, ...obj };
    localStorage.setItem("options", JSON.stringify(updated));

    if (immediate) {
      setTimeout(() => {
        setOptions((prev) => ({ ...prev, ...obj }));
      }, 0);
    }
  };

  return (
    <OptionsContext.Provider value={{ options, updateOption }}>
      {children}
    </OptionsContext.Provider>
  );
};

export const useOptions = () => useContext(OptionsContext);
