import type React from "react";

export type Action<T> = {
  label: string;
  variant?: "text" | "contained" | "outlined";
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  onClick: (item: T) => void;
  shouldRender?: (item: T) => boolean;
};

type DataTableProps<T> = {
  data: T[];
  columns: { key: keyof T; label: string }[];
  actions: Action<T>[];
  changedIds?: string[];
  renderCell?: (item: T, columnKey: keyof T) => React.ReactNode;
  onRowClick: (item: T) => void; // Changed from onItemClick to onRowClick
  showId?: boolean;
};

export const DataTable = <T extends { id: string | null }>({
  data,
  columns,
  actions,
  changedIds,
  renderCell,
  onRowClick,
  showId,
}: DataTableProps<T>) => {
  const filteredColumns = columns.filter((column) => {
    if (showId) return true;
    return column.key !== "id";
  });

  const defaultRenderCell = (item: T, columnKey: keyof T) => {
    const value = item[columnKey] as React.ReactNode;
    return value;
  };

  const renderCellContent = (
    item: T,
    column: { key: keyof T; label: string }
  ) => {
    return renderCell
      ? renderCell(item, column.key)
      : defaultRenderCell(item, column.key);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {filteredColumns.map((column) => (
              <th key={String(column.key)} scope="col" className="px-6 py-3">
                {column.label}
              </th>
            ))}
            {actions.length > 0 && (
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <tr
              key={String(item.id)}
              onClick={() => onRowClick(item)}
              className={`${
                changedIds?.includes(String(item.id))
                  ? "animate-pulse bg-yellow-100 dark:bg-yellow-900"
                  : "bg-white dark:bg-neutral-800"
              } border-b dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer`}
            >
              {filteredColumns.map((column) => (
                <td key={String(column.key)} className="px-6 py-4">
                  {renderCellContent(item, column)}
                </td>
              ))}
              {actions.length > 0 && (
                // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                <td
                  className="px-6 py-4 flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {actions.map(
                    (action, index) =>
                      (!action.shouldRender || action.shouldRender(item)) && (
                        <button
                          type="button"
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          key={index}
                          onClick={() => action.onClick(item)}
                          className={`px-3 py-2 text-xs font-medium text-center rounded-lg ${
                            action.variant === "outlined"
                              ? "border border-blue-700 text-blue-700 hover:bg-blue-800 hover:text-white dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600"
                              : action.variant === "text"
                              ? "text-blue-700 hover:underline dark:text-blue-500"
                              : "text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                          }`}
                        >
                          {action.label}
                        </button>
                      )
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
