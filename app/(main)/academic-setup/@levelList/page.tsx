"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Save,
  X,
  Pencil,
  Circle,
  CircleMinus,
  XCircle,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { Level } from "@/lib/models/level";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";

interface CurrencyInputProps {
  currency: string;
  value: number;
  onChange: (value: string) => void;
  disabled: boolean;
  id: string;
  name: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  currency,
  value,
  onChange,
  disabled,
  id,
  name,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const isValid = /^(\d+(\.\d{0,2})?)?$/.test(inputValue);
    if (isValid) {
      onChange(inputValue);
    }
  };

  return (
    <div className="relative w-full rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span className="text-gray-500 dark:text-neutral-400 sm:text-sm">
          {currency}
        </span>
      </div>
      <input
        type="number"
        name={name}
        id={id}
        className={`block w-full rounded-md border-0 py-1.5 pl-16 text-gray-900 dark:text-neutral-100 
                    ring-1 ring-inset ring-gray-300 dark:ring-neutral-600 
                    placeholder:text-gray-400 dark:placeholder:text-neutral-500 
                    focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 
                    sm:text-sm sm:leading-6 
                    ${
                      disabled
                        ? "bg-gray-100 dark:bg-neutral-800"
                        : "bg-white dark:bg-neutral-700"
                    }
                    ${disabled ? "text-gray-500 dark:text-neutral-400" : ""}`}
        placeholder="0.00"
        value={String(value)}
        onChange={handleChange}
        disabled={disabled}
        step="0.01"
        min="0"
      />
    </div>
  );
};

const LevelList: React.FC = () => {
  // const { levels } = useLevels();
  const [expandedLevel, setExpandedLevel] = useState<string[]>([]);
  const [editingLevel, setEditingLevel] = useState<string | null>(null);
  const [editedLevel, setEditedLevel] = useState<Partial<Level>>({});
  const [newLevel, setNewLevel] = useState<Level | null>(null);

  const { showSnackbar } = useSnackbar();

  const toggleLevel = (levelId: string) => {
    setExpandedLevel((prev) =>
      prev.includes(levelId)
        ? prev.filter((id) => id !== levelId)
        : [...prev, levelId]
    );
  };

  const handleEdit = (levelId: string) => {
    if (editingLevel === null) {
      setEditingLevel(levelId);
      const level = levels.find((l) => l.id === levelId);
      if (level) {
        setEditedLevel({
          name: level.name,
          student_price_usd: level.student_price_usd,
          student_price_gbp: level.student_price_gbp,
          student_price_myr: level.student_price_myr,
          tutor_price_usd: level.tutor_price_usd,
          tutor_price_gbp: level.tutor_price_gbp,
          tutor_price_myr: level.tutor_price_myr,
        });
      }
    }
  };

  const handleSave = (levelId: string) => {
    const updatedLevel = new Level(
      levelId,
      editedLevel.name ?? "",
      editedLevel.student_price_myr ?? 0,
      editedLevel.student_price_usd ?? 0,
      editedLevel.student_price_gbp ?? 0,
      editedLevel.tutor_price_myr ?? 0,
      editedLevel.tutor_price_usd ?? 0,
      editedLevel.tutor_price_gbp ?? 0
    );

    if (levelId === "new") {
      addLevel(updatedLevel);
      showSnackbar("Level added successfully", "success");
      setNewLevel(null);
    } else {
      updateLevel(updatedLevel);
    }

    setEditingLevel(null);
    setEditedLevel({});
    showSnackbar(
      `Level ${updatedLevel.name} ${
        levelId === "new" ? "added" : "updated"
      } successfully`,
      "success"
    );
  };

  const handleCancel = () => {
    setEditingLevel(null);
    setEditedLevel({});
    if (newLevel) {
      setNewLevel(null);
    }
  };

  const handleDelete = (levelId: string) => {
    showSnackbar("Level deleted", "success");
  };

  const handleAddLevel = () => {
    const blankLevel = new Level("new", "", 0, 0, 0, 0, 0, 0);
    setNewLevel(blankLevel);
    setEditingLevel("new");
    setEditedLevel({});
    setExpandedLevel(["new", ...expandedLevel]);
  };

  const renderPriceInputs = (level: Level, type: "student" | "tutor") => (
    <div className="flex w-full flex-col gap-2 items-center justify-between">
      <CurrencyInput
        currency="USD"
        id={`usd-price-${type}`}
        name={`usd-price-${type}`}
        value={
          editingLevel === level.id
            ? editedLevel[`${type}_price_usd`] ?? level[`${type}_price_usd`]
            : level[`${type}_price_usd`]
        }
        onChange={(value) =>
          setEditedLevel({
            ...editedLevel,
            [`${type}_price_usd`]: Number.parseFloat(value),
          })
        }
        disabled={editingLevel !== level.id}
      />
      <CurrencyInput
        currency="GBP"
        id={`gbp-price-${type}`}
        name={`gbp-price-${type}`}
        value={
          editingLevel === level.id
            ? editedLevel[`${type}_price_gbp`] ?? level[`${type}_price_gbp`]
            : level[`${type}_price_gbp`]
        }
        onChange={(value) =>
          setEditedLevel({
            ...editedLevel,
            [`${type}_price_gbp`]: Number.parseFloat(value),
          })
        }
        disabled={editingLevel !== level.id}
      />
      <CurrencyInput
        currency="MYR"
        id={`myr-price-${type}`}
        name={`myr-price-${type}`}
        value={
          editingLevel === level.id
            ? editedLevel[`${type}_price_myr`] ?? level[`${type}_price_myr`]
            : level[`${type}_price_myr`]
        }
        onChange={(value) =>
          setEditedLevel({
            ...editedLevel,
            [`${type}_price_myr`]: Number.parseFloat(value),
          })
        }
        disabled={editingLevel !== level.id}
      />
    </div>
  );

  const renderLevel = (level: Level) => (
    <div>
      <div className="mb-2 last:mb-0 border border-gray-200 dark:border-neutral-700 rounded p-4">
        <div className="mb-2 dark:text-neutral-300">Student Rate</div>
        {renderPriceInputs(level, "student")}
      </div>
      <div className="mb-2 last:mb-0 border border-gray-200 dark:border-neutral-700 rounded p-4">
        <div className="mb-2 dark:text-neutral-300">Tutor Rate</div>
        {renderPriceInputs(level, "tutor")}
      </div>
    </div>
  );

  const renderEducationLevel = (level: Level) => (
    <div
      key={level.id}
      className="mb-4 last:mb-0 border border-gray-300 dark:border-neutral-600 rounded"
    >
      <button
        type="button"
        className="flex flex-row w-full items-center justify-between p-4 bg-gray-100 dark:bg-neutral-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-t"
        onClick={() => toggleLevel(level.id ?? "")}
      >
        <div className="flex flex-row items-center">
          {expandedLevel.includes(level.id ?? "") ? (
            <ChevronDown
              size={24}
              className="text-gray-600 dark:text-neutral-400"
            />
          ) : (
            <ChevronRight
              size={24}
              className="text-gray-600 dark:text-neutral-400"
            />
          )}
          {editingLevel === level.id ? (
            <input
              type="text"
              value={editedLevel.name ?? level.name}
              onChange={(e) =>
                setEditedLevel({ ...editedLevel, name: e.target.value })
              }
              className="ml-2 font-semibold bg-white dark:bg-neutral-700 border rounded px-2 py-1 dark:text-neutral-200"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="flex-grow ml-2 font-semibold dark:text-neutral-200">
              {level.name || "New Level"}
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          {editingLevel === level.id ? (
            <div className="flex space-x-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                <XCircle className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave(level.id ?? "");
                }}
                className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex space-x-1">
              <button
                type="button"
                className="p-2 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-md hover:bg-gray-300 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(level.id ?? "");
                }}
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-2 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-md hover:bg-gray-300 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(level.id ?? "");
                }}
              >
                <CircleMinus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </button>
      {expandedLevel.includes(level.id ?? "") && (
        <div className="p-4 dark:bg-neutral-800">{renderLevel(level)}</div>
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6 flex flex-col h-full mx-auto flex-1">
      <div className="flex flex-row justify-between mb-4">
        <div className="flex-shrink-0">
          <h2 className="text-2xl font-bold mb-2 dark:text-neutral-200">
            Education Level
          </h2>
          <p className="text-gray-600 dark:text-neutral-400">
            Manage your levels here
          </p>
        </div>
        <button
          className="flex flex-row h-fit items-center px-4 py-2 bg-red-800 text-white text-sm rounded-md font-semibold hover:bg-red-800/[0.8] hover:shadow-lg"
          type="button"
          onClick={handleAddLevel}
        >
          <Plus size={16} strokeWidth={3} className="mr-1" />
          Add Level
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4">
        {newLevel && renderEducationLevel(newLevel)}
        {levels.length === 0 && !newLevel && (
          <p className="text-center text-gray-600 dark:text-neutral-400 italic">
            No level available.
          </p>
        )}
        {levels.map(renderEducationLevel)}
      </div>
    </div>
  );
};

export default LevelList;
