import type React from "react";
import styles from "@/styles/components/dashboard/DataTable.module.scss";
import Badge from "./Badge";

type DataTableProps<T> = {
  data: T[];
  columns: { key: keyof T; label: string }[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  changedIds: string[];
  renderCell?: (item: T, columnKey: keyof T) => React.ReactNode;
};

export const DataTable = <T extends { id: string | null }>({
  data,
  columns,
  onEdit,
  onDelete,
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
              {(onDelete || onEdit) && <th>Actions</th>}
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
                {(onDelete || onEdit) && (
                  <td>
                    {onEdit && (
                      <button
                        type="button"
                        className={styles.actionButton}
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        className={`${styles.actionButton} ${styles.delete}`}
                        onClick={() => onDelete(item)}
                      >
                        Delete
                      </button>
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
