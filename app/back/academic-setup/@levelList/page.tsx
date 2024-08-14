"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Edit, Trash2, Save, X } from 'lucide-react';
import { useLevels } from "@/lib/context/collection/levelContext";
import { useLevelPage } from "@/lib/context/page/levelPageContext";
import { updateLevel } from "@/lib/firebase/avaSubject";
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
  return (
    <div className="relative w-full rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span className="text-gray-500 sm:text-sm">{currency}</span>
      </div>
      <input
        type="text"
        name={name}
        id={id}
        className={`block w-full rounded-md border-0 py-1.5 pl-16 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
          disabled ? "bg-gray-100" : ""
        }`}
        placeholder="0.00"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
};

const LevelList: React.FC = () => {
  const { levels } = useLevels();
  const [expandedLevel, setExpandedLevel] = useState<string[]>([]);
  const [editingLevel, setEditingLevel] = useState<string | null>(null);
  const [editedLevel, setEditedLevel] = useState<Partial<Level>>({});

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
      editedLevel.student_price_usd ?? 0,
      editedLevel.student_price_gbp ?? 0,
      editedLevel.student_price_myr ?? 0,
      editedLevel.tutor_price_usd ?? 0,
      editedLevel.tutor_price_gbp ?? 0,
      editedLevel.tutor_price_myr ?? 0
    );
    updateLevel(updatedLevel);
    setEditingLevel(null);
    setEditedLevel({});
    showSnackbar(`Level ${updatedLevel.name} updated successfully`, "success");
  };

  const handleCancel = () => {
    setEditingLevel(null);
    setEditedLevel({});
  };

  const handleDelete = (levelId: string) => {
    showSnackbar(`Subject ${levelId} deleted`, "success");
  };

  const renderPriceInputs = (level: Level, type: "student" | "tutor") => (
    <div className="flex w-full flex-col gap-2 items-center justify-between p-3 bg-gray-50">
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
            [`${type}_price_usd`]: Number(value),
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
            [`${type}_price_gbp`]: Number(value),
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
            [`${type}_price_myr`]: Number(value),
          })
        }
        disabled={editingLevel !== level.id}
      />
    </div>
  );

  const renderLevel = (level: Level) => (
    <div>
      <div className="mb-2 last:mb-0 border border-gray-200 rounded p-4">
        <div className="mb-2">Student Rate</div>
        {renderPriceInputs(level, "student")}
      </div>
      <div className="mb-2 last:mb-0 border border-gray-200 rounded p-4">
        <div className="mb-2">Tutor Rate</div>
        {renderPriceInputs(level, "tutor")}
      </div>
    </div>
  );

  const renderEducationLevel = (level: Level) => (
    <div
      key={level.id}
      className="mb-4 last:mb-0 border border-gray-300 rounded shadow"
    >
      <div className="flex flex-row w-full items-center justify-between p-4 bg-gray-100">
        <button
          type="button"
          className="flex flex-row items-center cursor-pointer hover:bg-gray-200"
          onClick={() => toggleLevel(level.id ?? "")}
        >
          {expandedLevel.includes(level.id ?? "") ? (
            <ChevronDown size={24} />
          ) : (
            <ChevronRight size={24} />
          )}
          {editingLevel === level.id ? (
            <input
              type="text"
              value={editedLevel.name ?? level.name}
              onChange={(e) => setEditedLevel({ ...editedLevel, name: e.target.value })}
              className="ml-2 font-semibold bg-white border rounded px-2 py-1"
            />
          ) : (
            <span className="flex-grow ml-2 font-semibold">{level.name}</span>
          )}
        </button>
        <div className="flex space-x-2">
          {editingLevel === level.id ? (
            <>
              <Save
                size={20}
                className="text-green-600 hover:text-green-800 cursor-pointer"
                onClick={() => handleSave(level.id ?? "")}
              />
              <X
                size={20}
                className="text-red-600 hover:text-red-800 cursor-pointer"
                onClick={handleCancel}
              />
            </>
          ) : (
            <>
              <Edit
                size={20}
                className="text-gray-600 hover:text-gray-800 cursor-pointer"
                onClick={() => handleEdit(level.id ?? "")}
              />
              <Trash2
                size={20}
                className="text-gray-600 hover:text-gray-800 cursor-pointer"
                onClick={() => handleDelete(level.id ?? "")}
              />
            </>
          )}
        </div>
      </div>
      {expandedLevel.includes(level.id ?? "") && (
        <div className="p-4">{renderLevel(level)}</div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex-1 mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Education Level</h2>
        <p className="text-gray-600">Manage your education levels here</p>
      </div>
      <div className="space-y-4">{levels.map(renderEducationLevel)}</div>
    </div>
  );
};

export default LevelList;