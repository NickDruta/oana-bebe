import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input, TextArea } from "shared/ui";
import cls from "./ContactForum.module.scss";

const ContactForum = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className={cls.contactForumWrapper}>
      <p className={cls.title}>{t("content:SEND_A_MESSAGE")}</p>
      <div className={cls.inputsWrapper}>
        <div className={cls.inputsRow}>
          <Input
            value={name}
            handleChange={(value) => setName(value)}
            placeholder={t("content:NAME")}
          />
          <Input
            value={email}
            handleChange={(value) => setEmail(value)}
            placeholder={t("content:EMAIL")}
          />
        </div>
        <Input
          value={title}
          handleChange={(value) => setTitle(value)}
          placeholder={t("content:TITLE_MESSAGE")}
        />
        <TextArea
          placeholder={t("content:MESSAGE")}
          value={message}
          handleChange={(value) => setMessage(value)}
        ></TextArea>
      </div>
      <Button type="primary" text={t("content:SEND")} onClick={() => {}} />
    </div>
  );
};

export default ContactForum;
