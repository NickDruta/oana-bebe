import React from "react";
import { Map } from "widgets/Map";
import { LeafletMap } from "widgets/LeafletMap";
import { ShowConnections } from "widgets/ShowConnections";
import { StickyInfo } from "entities/StickyInfo";
import { Header } from "features/Header";
import { MobileHeader } from "features/MobileHeader";
import { Footer } from "features/Footer";
import cls from "./Contacts.module.scss";

const Contacts = () => {
  return (
    <>
      <StickyInfo />
      <Header />
      <MobileHeader />
      <div className={cls.contactsWrapper}>
        {/* <Map /> */}
        <LeafletMap />
        <ShowConnections />
      </div>
      <Footer />
    </>
  );
};

export default Contacts;
