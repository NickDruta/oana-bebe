import React from "react";
import mutsi from "shared/assets/images/mutsy.png";
import anex from "shared/assets/images/anex.png";
import tutis from "shared/assets/images/tutis.png";
import easygo from "shared/assets/images/easygo.png";
import verdi from "shared/assets/images/verdi.png";
import pegperego from "shared/assets/images/pegperego.png";
import nuna from "shared/assets/images/nuna.png";
import jole from "shared/assets/images/jole.png";
import cls from "./Companies.module.scss";

const Companies = () => {
  return (
    <div className={cls.companiesWrapper}>
      <img src={mutsi} alt="" />
      <img src={anex} alt="" />
      <img src={tutis} alt="" />
      <img src={easygo} alt="" />
      <img src={verdi} alt="" />
      <img src={pegperego} alt="" />
      <img src={nuna} alt="" />
      <img src={jole} alt="" />
    </div>
  );
};

export default Companies;
