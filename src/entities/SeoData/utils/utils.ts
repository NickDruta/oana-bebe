import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "shared/providers";
import { AboutData, CategoryTextData } from "../types/types";

export const fetchAboutData = async (): Promise<AboutData | null> => {
  try {
    const docRef = doc(db, "homepage", "XUT7wK2iTPS2r76UGAGA");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as AboutData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching about data: ", error);
    return null;
  }
};

export const updateAboutData = async (
  updatedData: AboutData,
): Promise<void> => {
  try {
    const docRef = doc(db, "homepage", "XUT7wK2iTPS2r76UGAGA");
    await setDoc(docRef, updatedData, { merge: true });
  } catch (error) {
    console.error("Error updating about data: ", error);
  }
};

export const fetchCategoryTextData = async (
  category: string,
): Promise<CategoryTextData | null> => {
  try {
    const docRef = doc(db, "categories", category);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as CategoryTextData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching category text data: ", error);
    return null;
  }
};

export const updateCategoryTextData = async (
  category: string,
  updatedData: CategoryTextData,
): Promise<void> => {
  try {
    const docRef = doc(db, "categories", category);
    await setDoc(docRef, updatedData, { merge: true });
  } catch (error) {
    console.error("Error updating category text data: ", error);
  }
};
