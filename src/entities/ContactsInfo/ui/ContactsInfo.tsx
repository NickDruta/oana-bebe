import React from "react";
import { useTranslation } from "react-i18next";
import cls from "./ContactsInfo.module.scss";

const ContactsInfo = () => {
  const { t } = useTranslation();

  return (
    <div className={cls.contactsInfoWrapper}>
      <p className={cls.title}>{t("content:CONTACTS")}</p>
      <div className={cls.itemWrapper}>
        <p className={cls.itemTitle}>{t("content:PHONE")}:</p>
        <div className={cls.dataWrapper}>
          <p className={cls.dataItem}>
            <a href="tel:+37360223422">060-223-422</a>
          </p>
        </div>
      </div>
      <div className={cls.itemWrapper}>
        <p className={cls.itemTitle}>{t("content:ADDRESS")}:</p>
        <div className={cls.dataWrapper}>
          <p className={cls.dataItem}>{t("content:STREET")}</p>
        </div>
      </div>
      <div className={cls.itemWrapper}>
        <p className={cls.itemTitle}>{t("content:WORK_HOURS")}:</p>
        <div className={cls.dataWrapper}>
          <p className={cls.dataItem}>{t("content:WORK_DAYS")}</p>
          <p className={cls.dataItem}>{t("content:WEEK_DAYS")}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactsInfo;
