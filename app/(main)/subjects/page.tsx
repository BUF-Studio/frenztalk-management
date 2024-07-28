"use client";

import { educationLevelStream } from "@/lib/firebase/educationLevel";
import { pricingStream } from "@/lib/firebase/pricing";
import { subjectsStream } from "@/lib/firebase/subject";
import type { EducationLevel } from "@/lib/models/educationLevel";
import type { Pricing } from "@/lib/models/pricing";
import type { Subject } from "@/lib/models/subject";
import styles from "@/styles/main/subjects/Page.module.scss";
import { useEffect, useState } from "react";

type ItemType = Subject | EducationLevel | Pricing;

const SubjectPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [educationLevels, setEducationLevels] = useState<EducationLevel[]>([]);
  const [pricing, setPricing] = useState<Pricing[]>([]);

  useEffect(() => {
    // Set up the real-time listener for users
    const unsubscribeEducationLevels = educationLevelStream(
      (updatedEducationLevels) => {
        setEducationLevels(updatedEducationLevels);
      }
    );

    const unsubscribeSubjects = subjectsStream((updatedSubjects) => {
      setSubjects(updatedSubjects);
    });

    const unsubscribePricing = pricingStream((updatedPricing) => {
      setPricing(updatedPricing);
    });

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      unsubscribeEducationLevels();
      unsubscribeSubjects();
      unsubscribePricing();
    };
  }, []);

  const renderSection = <T extends ItemType>(
    title: string,
    items: T[],
    collectionName: string
  ) => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>{title}</h2>
        <p>Manage your {title.toLowerCase()} here</p>
      </div>
      <div className={styles.cardContent}>
        {items.map((item) => (
          <div key={item.id} className={styles.inputGroup}>
            <input
              type="text"
              placeholder={`${title} name`}
              value={item.name}
              onChange={(e) =>
                updateItem(collectionName, item.id, "name", e.target.value)
              }
            />
            {/* {collectionName === "pricing" && (
              <input
                type="text"
                placeholder="Price"
                value={item.price}
                onChange={(e) =>
                  updateItem(collectionName, item.id, "price", e.target.value)
                }
              />
            )} */}
            <button
              type="button"
              onClick={() => deleteItem(collectionName, item.id)}
              className={[styles.btnDelete, styles.btn].join(" ")}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className={styles.cardFooter}>
        <button
          type="button"
          onClick={() => addItem(collectionName)}
          className={[styles.btnAdd, styles.btn].join(" ")}
        >
          Add {title}
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentContainer}>
        {renderSection<Subject>("Subjects", subjects, "subjects")}
        {renderSection<EducationLevel>(
          "Education Levels",
          educationLevels,
          "educationLevels"
        )}
        {renderSection<Pricing>("Pricing", pricing, "pricing")}
      </div>
    </div>
  );
};

export default SubjectPage;
function updateItem(
  collectionName: string,
  id: string | null,
  arg2: string,
  value: string
): void {
  throw new Error("Function not implemented.");
}

function deleteItem(collectionName: string, id: string | null): void {
  throw new Error("Function not implemented.");
}

function addItem(collectionName: string): void {
  throw new Error("Function not implemented.");
}
