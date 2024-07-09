import type React from "react";
import { useState } from "react";
import styles from "@/styles/components/dashboard/DataTable.module.scss";

type DataTableProps<T> = {
  data: T[];
  columns: { key: keyof T; label: string }[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
};

export const DataTable = <T extends { id: string | number }>({
  data,
  columns,
  onEdit,
  onDelete,
}: DataTableProps<T>) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)}>{column.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={String(item.id)}>
              {columns.map((column) => (
                <td key={String(column.key)}>
                  {item[column.key] as React.ReactNode}
                </td>
              ))}
              <td>
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={() => onEdit(item)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={`${styles.actionButton} ${styles.delete}`}
                  onClick={() => onDelete(item)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
