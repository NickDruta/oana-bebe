import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LocationIcon, PhoneIcon } from "shared/assets";
import { i18n } from "shared/providers";
import { Switcher } from "shared/ui";
import cls from "./StickyInfo.module.scss";
import { useNavigate } from "react-router-dom";

const StickyInfo = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const searchParams = useMemo(
    // eslint-disable-next-line no-restricted-globals
    () => new URLSearchParams(location.search),
    // eslint-disable-next-line no-restricted-globals
    [location.search],
  );
  const changeLanguage = (value: string) => {
    console.log(value);
    localStorage.setItem("I18N_LANGUAGE", value);
    i18n.changeLanguage(value);
    searchParams.set("limba", value);
    navigate({
      // eslint-disable-next-line no-restricted-globals
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  return (
    <div className={cls.stikyInfoWrapper}>
      <div className={cls.contentWrapper}>
        <div className={cls.itemWrapper}>
          <LocationIcon />
          <p>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.google.com/maps/place/Carucioare+Anex+in+Moldova+(Chisinau)/@47.0437225,28.8660977,17z/data=!4m6!3m5!1s0x40c97da0a31514db:0x2108b9770caaac24!8m2!3d47.0434229!4d28.8678753!16s%2Fg%2F11h3wtwzr9?entry=ttu"
            >
              {t("content:STREET")}
            </a>
          </p>
        </div>
        <div className={cls.itemWrapper}>
          <PhoneIcon />
          <p>
            <a href="tel:+37360-223-422">060-223-422</a>
          </p>
        </div>
        <div>
          <Switcher
            selectedOption={i18n.language}
            options={["ro", "ru"]}
            onChange={changeLanguage}
            className={cls.switcher}
          />
        </div>
      </div>
    </div>
  );
};

export default StickyInfo;
