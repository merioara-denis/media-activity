import React, { useState } from "react";

/** Словарь возможных значений */
const langs = Object.freeze([
  {
    id: "ru",
    name: "Русский",
  },
  {
    id: "en",
    name: "English",
  },
]);

/** 
 * Название поля в localStorage
 * @remark Уникальный ключ рекомендуется привязывать к домену
 */
const NAME__OF__LANG__IN__LOCAL_STORAGE = "lang";

/** Получение значения из localStorage */
const getFromLocalStorage = () => {
  return localStorage.getItem(NAME__OF__LANG__IN__LOCAL_STORAGE) ?? langs[0].id;
};

/** Обновление значения в localStorage */
const setFromLocalStorage = (value: string) => {
  return localStorage.setItem(NAME__OF__LANG__IN__LOCAL_STORAGE, value);
};

/** Хук обработки и хранения данных */
const useData = () => {
  // Состояние в компоненте
  const [state, setState] = useState(getFromLocalStorage);

  /**
   * Обработчик выбора значения в select
   * @remark не используем useCallback потому что кидаем обработчик в нативный тэг
   * @param event {React.ChangeEvent<HTMLSelectElement>} событие
   */
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFromLocalStorage(value);
    setState(value);
  };

  return { state, handleChange };
};

/** Компонент рендера */
export const Questions1273361 = () => {
  const { state, handleChange } = useData();

  return (
    <select onChange={handleChange} value={state}>
      {langs.map(({ id, name }) => (
        <option key={id} value={id}>
          {name}
        </option>
      ))}
    </select>
  );
};
