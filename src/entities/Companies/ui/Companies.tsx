import React from "react";
import anex from "shared/assets/images/anex.png";
import cybex from "shared/assets/images/cybex.png";
import mutsi from "shared/assets/images/mutsy.png";
import tutis from "shared/assets/images/tutis.png";
import cavoe from "shared/assets/images/cavoe.png";
import pegperego from "shared/assets/images/pegperego.png";
import cls from "./Companies.module.scss";

const Companies = () => {
  return (
      <div className={cls.companiesWrapper}>
          <img src={anex} alt=""/>
          <img src={cybex} alt=""/>
          <img src={mutsi} alt=""/>
          <img src={tutis} alt=""/>
          <img src={cavoe} alt=""/>
          <img src={pegperego} alt=""/>
          {/*<img src={verdi} alt=""/>*/}
          {/*<img src={nuna} alt=""/>*/}
          {/*<img src={jole} alt=""/>*/}
      </div>
  );
};

export default Companies;
