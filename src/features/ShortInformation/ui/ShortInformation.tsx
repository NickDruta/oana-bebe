import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { fetchAboutData } from "entities/SeoData/utils/utils";
import { AboutData, Language } from "entities/SeoData/types/types";
import { Button } from "shared/ui";
import aboutIllustration from "shared/assets/images/about.jpg";
import cls from "./ShortInformation.module.scss";

interface ShortInformationProps {
  description: string;
  withButtons?: boolean;
}

const ShortInformation = ({
  description,
  withButtons,
}: ShortInformationProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const language = i18next.language;

  const [aboutData, setAboutData] = useState<AboutData | null>(null);

  const getData = async () => {
    const response = await fetchAboutData();

    setAboutData(response);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={cls.shortInformationWrapper}>
      <img className={cls.infoImage} src={aboutIllustration} alt="" />
      <div className={cls.infoWrapper}>
        <p
          className={cls.infoTitle}
          dangerouslySetInnerHTML={{
            __html: aboutData
              ? aboutData.title[language as keyof Language]
              : t("content:SHORT_INFORMATION_TITLE"),
          }}
        />
        <p
          className={cls.infoDescription}
          dangerouslySetInnerHTML={{
            __html: aboutData
              ? aboutData.description[language as keyof Language]
              : description,
          }}
        />
        {withButtons && (
          <div className={cls.buttonWrapper}>
            <Button
              type="secondary"
              text={t("content:MORE")}
              onClick={() => navigate("/despre")}
            />
            <Button
              type="primary"
              text={t("content:ALL_PRODUCTS")}
              onClick={() => navigate("/produse")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortInformation;
