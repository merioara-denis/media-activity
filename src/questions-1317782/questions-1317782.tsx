import React, { useState, useCallback, memo } from "react";
import cn from "classnames"

/* #region Btns Component */
interface BtnsProps {
  items?: string[];
  onClick: (
    buttonType: string
  ) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Btns = memo((props: BtnsProps) => {
  const { items, onClick } = props;

  if (!items) return null;

  return (
    <>
      {items.map((id) => (
        <button key={id} onClick={onClick(id)}>
          {id}
        </button>
      ))}
    </>
  );
});
/* #endregion */

/* #region Table Component */
interface TableProps {
  id: string;
  isActive?: boolean;
}

/** Компонент отрисовки данных */
const Table = memo((props: TableProps) => {
  const { id, isActive } = props;

  return (
    <table id={`table-${id}`} className={cn("bw", {"show": isActive})}>
      <tbody>
        <tr>
          <td>
            ... {id}: {isActive ? "bw show" : "bw"}
          </td>
        </tr>
      </tbody>
    </table>
  );
});
/* #endregion */

/* #region Calories Component */
interface CaloriesProps {
  /** Словарь кнопок */
  buttons?: string[];
}

/** Хук хранения данных и обработки событий */
const useDataCalories = (props: CaloriesProps) => {
  const { buttons } = props;

  /** Состояние компонента */
  const [activeButton, setActiveButton] = useState(buttons?.[0]);

  /**
   * Обработчик события click по кнопке
   * @remark useCallback нужен потому что обработчик прокидывается в дочерний компонент
   */
  const handleClick = useCallback(
    (buttonType: string) =>
      (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        if (buttonType === activeButton) return;
        setActiveButton(buttonType);
      },
    [activeButton]
  );

  return { buttons, activeButton, handleClick };
};

function Calories(props: CaloriesProps) {
  const { buttons, activeButton, handleClick } = useDataCalories(props);

  return (
    <section id="сalories">
      <Btns items={buttons} onClick={handleClick} />
      {buttons?.map((id) => (
        <Table key={id} id={id} isActive={id === activeButton} />
      ))}
    </section>
  );
}

Calories.defaultProps = {
  buttons: ["male", "female"],
};
/* #endregion */

export default Calories;
