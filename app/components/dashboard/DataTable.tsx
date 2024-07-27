import type React from "react";
import styles from "@/styles/components/dashboard/DataTable.module.scss";
import { Button } from "@mui/material";

export type Action<T> = {
  label: string;
  variant?: "text" | "contained" | "outlined";
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
  onClick: (item: T) => void;
  shouldRender?: (item: T) => boolean;
};

type DataTableProps<T> = {
  data: T[];
  columns: { key: keyof T; label: string }[];
  actions: Action<T>[];
  changedIds?: string[];
  renderCell?: (item: T, columnKey: keyof T) => React.ReactNode;
};

export const DataTable = <T extends { id: string | null }>({
  data,
  columns,
  actions,
  changedIds,
  renderCell,
}: DataTableProps<T>) => {
  const filteredColumns = columns.filter((column) => column.key !== "id");

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
    <div className={styles.tableContainer}>
      <div className={styles.scrollContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {filteredColumns.map((column) => (
                <th key={String(column.key)}>{column.label}</th>
              ))}
              {actions.length > 0 && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={String(item.id)}
                className={
                  changedIds?.includes(String(item.id)) ? styles.blink : ""
                }
              >
                {filteredColumns.map((column) => (
                  <td key={String(column.key)}>
                    {renderCellContent(item, column)}
                  </td>
                ))}
                {actions.length > 0  && (
                  <td className={styles.actions}>
                    {actions.map(
                      (action, index) =>
                        (!action.shouldRender || action.shouldRender(item)) && (
                          <Button
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            key={index}
                            variant={action.variant || "contained"}
                            color={action.color || "primary"}
                            onClick={() => action.onClick(item)}
                            className={styles.actionButton}
                          >
                            {action.label}
                          </Button>
                        )
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
