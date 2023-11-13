import React from "react";
import { ContactForum } from "features/ContactForum";
import { ContactsInfo } from "entities/ContactsInfo";
import cls from "./ShowConnections.module.scss";

const ShowConnections = () => {
  return (
    <div className={cls.showConnectionsWrapper}>
      <ContactForum />
      <ContactsInfo />
    </div>
  );
};

export default ShowConnections;
