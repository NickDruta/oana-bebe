import { Button, Input, LoadingSpinner, Modal, TextArea } from "shared/ui";
import cls from "./EditCategoryDataModal.module.scss";
import { useEffect, useState } from "react";
import {
  CategoryTextData,
  fetchCategoryTextData,
  updateCategoryTextData,
  Language,
} from "entities/SeoData";

interface Props {
  handleClose: () => void;
  name: string;
}

const EditCategoryDataModal = ({ handleClose, name }: Props) => {
  const [loading, setLoading] = useState(true);

  const [language, setLanguage] = useState<keyof Language>("ro");
  const [categoryData, setCategoryData] = useState<CategoryTextData | null>(
    null,
  );

  const handleInputChange = (field: keyof CategoryTextData, value: string) => {
    setCategoryData((prevData) => {
      const newData: CategoryTextData = {
        description: {
          ro: prevData?.description?.ro || "",
          ru: prevData?.description?.ru || "",
        },
        metaTitle: prevData?.metaTitle || "",
        metaDescription: prevData?.metaDescription || "",
      };

      if (field === "description") {
        return {
          ...newData,
          description: {
            ...newData.description,
            [language]: value,
          },
        };
      } else {
        return {
          ...newData,
          [field]: value,
        };
      }
    });
  };

  const getCategoryTextData = async () => {
    const response = await fetchCategoryTextData(name);

    setCategoryData(response);
    setLoading(false);
  };

  useEffect(() => {
    getCategoryTextData();
  }, []);

  const handleSave = async () => {
    if (categoryData) {
      await updateCategoryTextData(name, categoryData);
      handleClose();
    }
  };

  return (
    <Modal handleClickAway={handleClose}>
      <div className={cls.modalWrapper}>
        <p className={cls.title}>
          Modifica textul din <i>{name.replaceAll("—", " ")}</i>
        </p>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className={cls.dataWrapper}>
            <Input
              placeholder={"Tag Meta Titlu"}
              value={categoryData ? categoryData.metaTitle : ""}
              handleChange={(value) => handleInputChange("metaTitle", value)}
            />
            <TextArea
              placeholder={"Tag Meta Descriere"}
              value={categoryData ? categoryData.metaDescription : ""}
              handleChange={(value) =>
                handleInputChange("metaDescription", value)
              }
            />
            <div className={cls.selectLanguage}>
              <label>
                <input
                  checked={language === "ro"}
                  type="radio"
                  name="language"
                  value="ro"
                  onChange={() => setLanguage("ro")}
                />
                <span className={cls.radioCustom}></span>
                Romana
              </label>
              <label>
                <input
                  checked={language === "ru"}
                  type="radio"
                  name="language"
                  value="ru"
                  onChange={() => setLanguage("ru")}
                />
                <span className={cls.radioCustom}></span>
                Rusa
              </label>
            </div>
            <TextArea
              placeholder={"Descriere"}
              value={categoryData ? categoryData.description[language] : ""}
              handleChange={(value) => handleInputChange("description", value)}
            />
            <div className={cls.actionWrapper}>
              <Button type="secondary" text="Anuleaza" onClick={handleClose} />
              <Button type="primary" text="Aplică" onClick={handleSave} />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EditCategoryDataModal;
