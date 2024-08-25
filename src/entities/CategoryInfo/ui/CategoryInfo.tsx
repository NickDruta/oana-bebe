import clsx from "clsx";
import cls from "./CategoryInfo.module.scss";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  CategoryTextData,
  fetchCategoryTextData,
  Language,
} from "entities/SeoData";
import i18next from "i18next";

interface Props {
  subcategory: string | null;
}

const CategoryInfo = ({ subcategory }: Props) => {
  const language = i18next.language;

  const [isExpanded, setIsExpanded] = useState(false);
  const [categoryTextData, setCategoryTextData] =
    useState<CategoryTextData | null>(null);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getCategoryTextData = async () => {
    if (!subcategory) return;

    const response = await fetchCategoryTextData(
      subcategory.replaceAll(" ", "—").toLowerCase(),
    );

    setCategoryTextData(response);
  };

  useEffect(() => {
    setCategoryTextData(null);

    getCategoryTextData();

    return () => {
      document.title =
        "Oana Bebe: Produse pentru copiii de calitate superioară în Moldova";
      const metaDescription = document.querySelector(
        'meta[name="description"]',
      );
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          "Descoperă la Oana Bebe carucioare moderne, scaune auto și pături de cea mai bună calitate pentru copiii din Moldova.",
        );
      }
    };
  }, [subcategory]);

  if (!subcategory || !categoryTextData) return null;

  return (
    <>
      <Helmet>
        <title>{categoryTextData.metaTitle}</title>
        <meta name="description" content={categoryTextData.metaDescription} />
      </Helmet>
      <div className={cls.infoWrapper}>
        <div
          className={clsx(cls.info, isExpanded && cls.isExpanded)}
          dangerouslySetInnerHTML={{
            __html: categoryTextData
              ? categoryTextData.description[language as keyof Language]
              : "",
          }}
        />
        <button onClick={toggleExpanded} className={cls.infoButton}>
          {isExpanded ? "Vezi mai puțin" : "Vezi mai mult"}
        </button>
      </div>
    </>
  );
};

export default CategoryInfo;
