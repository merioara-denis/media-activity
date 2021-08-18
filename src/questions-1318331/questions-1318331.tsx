import React, { useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import { useTable } from "react-table";

const data = [
  {
    col1: "Hello",
    col2: "World",
  },
  {
    col1: "react-table",
    col2: "rocks",
  },
  {
    col1: "whatever",
    col2: "you want",
  },
];

const columns = [
  {
    Header: "Column 1",
    accessor: "col1", // accessor is the "key" in the data
  },
  {
    Header: "Column 2",
    accessor: "col2",
  },
];

const getStateDropdown = (filter: string[]) =>
  columns
    .map((column) => column.accessor)
    .filter((column) => !filter.includes(column));

/* #region  */
interface DropdownProps {
  filter: string[];
  onApply: (filter: string[]) => () => void;
  onCancel: () => void;
}

const Dropdown = (props: DropdownProps) => {
  const { filter, onApply, onCancel } = props;
  const [state, setState] = useState(filter);
  const handleChange = (field: string, flag: boolean) => () => {
    if (flag) {
      const nextFilter = [...state, field];
      return setState(nextFilter);
    }

    if (!flag) {
      const nextFilter = state.filter((key) => key !== field);
      return setState(nextFilter);
    }
  };

  return (
    <Dropdown.Ul>
      <Dropdown.Li>filter: {JSON.stringify(state)}</Dropdown.Li>
      {columns.map((column) => {
        const isChecked = state.includes(column.accessor);
        return (
          <Dropdown.Li key={column.accessor}>
            <Dropdown.Label>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleChange(column.accessor, !isChecked)}
              />
              <span>{column.Header}</span>
            </Dropdown.Label>
          </Dropdown.Li>
        );
      })}
      <Dropdown.Li>
        <button onClick={onApply(state)}>Сохранить</button>
        <button onClick={onCancel}>Отмена</button>
      </Dropdown.Li>
    </Dropdown.Ul>
  );
};

Dropdown.Ul = styled.ul`
  display: block;
`;

Dropdown.Li = styled.li`
  display: block;
`;

Dropdown.Label = styled.label`
  display: flex;
  flex-direction: row;
  padding-left: 10px;
  gap: 10px;
`;
/* #endregion */

/* #region Пример из документаций */
interface TableProps {
  columns: typeof columns;
  data: typeof data;
}
const Table = ({ columns, data }: TableProps) => {
  // Use the state and functions returned from useTable to build your UI
  // @ts-ignore
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
/* #endregion */

/* #region Questions1318331 */

const useFilter = () => {
  const [filter, setFilter] = useState(getStateDropdown([]));
  const [isVisibleDropDown, setVisibleDropDown] = useState(false);
  const handleFilterUpdate = useCallback(
    (filter: string[]) => () => {
      setFilter(filter);
      setVisibleDropDown(false);
    },
    []
  );
  const handleToggleClick = () => setVisibleDropDown((prev) => !prev);

  return { filter, isVisibleDropDown, handleToggleClick, handleFilterUpdate };
};

const Questions1318331 = () => {
  const filterData = useFilter();
  const { filter, isVisibleDropDown } = filterData;
  const { handleToggleClick, handleFilterUpdate } = filterData;

  const listOfColumns = useMemo(() => {
    return columns.filter((column) => filter.includes(column.accessor));
  }, [filter]);

  return (
    <>
      <button onClick={handleToggleClick}>
        Edit filter - {JSON.stringify(filter)}
      </button>
      {isVisibleDropDown && (
        <Dropdown
          filter={filter}
          onApply={handleFilterUpdate}
          onCancel={handleToggleClick}
        />
      )}
      <Table columns={listOfColumns} data={data} />
    </>
  );
};

Questions1318331.Filter = styled.div`
  position: relative;

  ${Dropdown.Ul} {
    position: absolute;
    top: 100%;
    transform: translate(10px, 0);
  }
`;

export { Questions1318331 };
/* #endregion */
