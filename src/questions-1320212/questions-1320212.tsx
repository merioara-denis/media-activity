import React, { memo, useState, useCallback, useRef, useEffect } from "react";

/* #region types.ts */

type TLang = { id: string; caption: string };

/* #endregion */

/* #region constants.ts */
const LANGS: TLang[] = [
  { id: "en", caption: "English" },
  { id: "ua", caption: "Українська" },
];

const URL_HASH_PARAMETER_LANG = "lang";
/* #endregion */

/* #region utils.ts */
const prepareUrl = (nextLang: string) => {
  const urlObject = new URL(window.location.toString());
  const { hash } = urlObject;

  if (!hash.startsWith("#")) {
    urlObject.hash = `#${URL_HASH_PARAMETER_LANG}=${nextLang}`;
    return urlObject.toString();
  }

  const params = new URLSearchParams(hash.substring(1));
  params.set(URL_HASH_PARAMETER_LANG, nextLang);
  urlObject.hash = `#${params.toString()}`;

  return urlObject.toString();
};

const setUrlOnChange = (lang: string) => {
  const nextUrl = prepareUrl(lang);
  window.history.pushState(null, document.title, nextUrl);
};

const readLangFromUrl = () => {
  const urlObject = new URL(window.location.toString());
  let { hash } = urlObject;

  if (hash.startsWith("#")) hash = hash.substring(1);

  const params = new URLSearchParams(hash);

  return params.get(URL_HASH_PARAMETER_LANG);
};
/* #endregion */

/* #region Switcher Component */
type SelectSwitcherOnChange = (
  event: React.ChangeEvent<HTMLSelectElement>
) => void;

interface SelectSwitcherProps {
  id: string;
  title: string;
  value: string;
  langs: TLang[];
  onChange?: SelectSwitcherOnChange;
}

const SelectSwitcher = memo((props: SelectSwitcherProps) => {
  const { title, id } = props;
  const { langs, value, onChange } = props;

  return (
    <>
      <label htmlFor={id}>{title}</label>&nbsp;
      <select id={id} value={value} onChange={onChange}>
        {langs.map(({ id, caption }) => {
          return (
            <option key={id} value={id}>
              {caption}
            </option>
          );
        })}
      </select>
    </>
  );
});
/* #endregion */

/* #region Switcher Component */
type RadioInputSwitcherOnChange = (
  id: string
) => (event: React.ChangeEvent<HTMLInputElement>) => void;

interface RadioInputSwitcherProps {
  id: string;
  title: string;
  value: string;
  langs: TLang[];
  onChange: RadioInputSwitcherOnChange;
}

const RadioInputSwitcher = memo((props: RadioInputSwitcherProps) => {
  const { title, id: name } = props;
  const { langs, value, onChange } = props;

  return (
    <>
      <h4>{title}</h4>
      {langs.map(({ id, caption }) => {
        const nodeId = `${name}_${id}`;
        return (
          <p key={nodeId}>
            <input
              type="radio"
              id={nodeId}
              value={id}
              name={name}
              checked={id === value}
              onChange={onChange(id)}
            />
            <label htmlFor={nodeId}>{caption}</label>
          </p>
        );
      })}
    </>
  );
});
/* #endregion */

/* #region hooks.ts */
const getState = (props: Questions1320212Props) => () => {
  const urlValue = readLangFromUrl();
  return urlValue ?? props.langs[0].id;
};

const useUrlState = (props: Questions1320212Props) => {
  const isInitState = useRef(false);
  let [lang, setLang] = useState(getState(props));

  /** Обработчик при выборе в Select */
  const handleSelectChange: SelectSwitcherOnChange = useCallback((event) => {
    const value = event.target.value;
    setLang(value);
  }, []);

  /** Обработчик при выборе в Штзге */
  const handleRadioInputChange: RadioInputSwitcherOnChange = useCallback(
    (id) => () => setLang(id),
    []
  );

  useEffect(() => {
    // Блокируем обновление при монтирование
    if (!isInitState.current) {
      isInitState.current = true;
      return;
    }

    // изменяем URL страницы
    setUrlOnChange(lang);
  }, [lang, isInitState]);

  return { lang, handleSelectChange, handleRadioInputChange };
};
/* #endregion */

/* #region Demo Component */
interface Questions1320212Props {
  langs: TLang[];
}

const Questions1320212 = (props: Questions1320212Props) => {
  const { langs } = props;
  const { lang, handleSelectChange, handleRadioInputChange } =
    useUrlState(props);

  return (
    <section id="setting">
      <SelectSwitcher
        id="lang-select"
        title="Language"
        langs={langs}
        value={lang}
        onChange={handleSelectChange}
      />
      <hr />
      <RadioInputSwitcher
        id="lang-select"
        title="Language"
        langs={langs}
        value={lang}
        onChange={handleRadioInputChange}
      />
    </section>
  );
};

Questions1320212.defaultProps = {
  langs: LANGS,
};

export { Questions1320212 };
/* #endregion */
