import { Button, Input, LoadingSpinner, Modal, TextArea } from "shared/ui";
import cls from "./EditAboutDataModal.module.scss";
import { useEffect, useState } from "react";
import {
  AboutData,
  Language,
  fetchAboutData,
  updateAboutData,
} from "entities/SeoData";

interface Props {
  handleClose: () => void;
}

const EditAboutDataModal = ({ handleClose }: Props) => {
  const [loading, setLoading] = useState(true);

  const [language, setLanguage] = useState<keyof Language>("ro");
  const [aboutData, setAboutData] = useState<AboutData | null>(null);

  const getData = async () => {
    setLoading(true);
    const response = await fetchAboutData();

    setAboutData(response);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleInputChange = (field: keyof AboutData, value: string) => {
    if (aboutData) {
      setAboutData({
        ...aboutData,
        [field]: {
          ...aboutData[field],
          [language]: value,
        },
      });
    }
  };

  const handleSubmit = async () => {
    if (aboutData) {
      await updateAboutData(aboutData);
      handleClose();
    }
  };

  return (
    <Modal handleClickAway={handleClose}>
      <div className={cls.modalWrapper}>
        <p className={cls.title}>Modifica textul din Despre</p>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
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
            <div className={cls.dataWrapper}>
              <Input
                placeholder={"Titlu Despre"}
                value={aboutData ? aboutData.title[language] : ""}
                handleChange={(value) => handleInputChange("title", value)}
              />
              <TextArea
                placeholder={"Descriere Despre"}
                value={aboutData ? aboutData.description[language] : ""}
                handleChange={(value) =>
                  handleInputChange("description", value)
                }
              />
            </div>
            <div className={cls.actionWrapper}>
              <Button type="secondary" text="Anuleaza" onClick={handleClose} />
              <Button type="primary" text="Aplică" onClick={handleSubmit} />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default EditAboutDataModal;
