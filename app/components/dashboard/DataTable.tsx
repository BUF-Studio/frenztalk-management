import type React from "react";
import { useState } from "react";
import styles from "@/styles/components/dashboard/DataTable.module.scss";
import Badge from "./Badge";

type DataTableProps<T> = {
  data: T[];
  columns: { key: keyof T; label: string }[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
};

export const DataTable = <T extends { id: string | null }>({
  data,
  columns,
  onEdit,
  onDelete,
}: DataTableProps<T>) => {
  const filteredColumns = columns.filter((column) => column.key !== "id");

  return (
    <div className={styles.tableContainer}>
      <div className={styles.scrollContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {filteredColumns.map((column) => (
                <th key={String(column.key)}>{column.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={String(item.id)}>
                {filteredColumns.map((column) => (
                  <td key={String(column.key)}>
                    {column.key === "status" ? (
                      <Badge status={item[column.key] as string} />
                    ) : (
                      item[column.key] as React.ReactNode
                    )}
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
    </div>
  );
};
