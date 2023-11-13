import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "shared/ui";
import aboutIllustration from "shared/assets/images/about_illustration.png";
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

  return (
    <div className={cls.shortInformationWrapper}>
      <img src={aboutIllustration} alt="" />
      <div className={cls.infoWrapper}>
        <p
          className={cls.infoTitle}
          dangerouslySetInnerHTML={{
            __html: t("content:SHORT_INFORMATION_TITLE"),
          }}
        />
        <p
          className={cls.infoDescription}
          dangerouslySetInnerHTML={{
            __html: description,
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
