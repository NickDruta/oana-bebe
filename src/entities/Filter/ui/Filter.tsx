import React from "react";
import { Input } from "shared/ui";
import { useTranslation } from "react-i18next";
import cls from "./Filter.module.scss";
import { Company, useGetCompaniesQuery } from "../../CompaniesData";

interface Props {
  search: string;
  handleSearch: (value: string) => void;
  companiesSelected: string[];
  handleCompaniesSelected: (companies: string[]) => void;
  minPrice: string;
  handleMinPrice: (value: string) => void;
  maxPrice: string;
  handleMaxPrice: (value: string) => void;
}

const Filter: React.FC<Props> = ({
  search,
  handleSearch,
  companiesSelected,
  handleCompaniesSelected,
  minPrice,
  handleMinPrice,
  maxPrice,
  handleMaxPrice,
}) => {
  const { t } = useTranslation();
  const { data: companies } = useGetCompaniesQuery();

  const toggleCompanySelection = (company: string) => {
    if (companiesSelected.includes(company)) {
      handleCompaniesSelected(companiesSelected.filter((c) => c !== company));
    } else {
      handleCompaniesSelected([...companiesSelected, company]);
    }
  };

  return (
    <div className={cls.filtersWrapper}>
      <p className={cls.title}>{t("content:FILTERS")}</p>
      <Input
        placeholder={t("content:SEARCH_PRODUCT")}
        value={search}
        handleChange={handleSearch}
      />
      <div className={cls.companiesWrapper}>
        {companies &&
          companies.data &&
          companies.data.map((company: Company, index: number) => (
            <div
              key={index}
              className={cls.company}
              onClick={() => toggleCompanySelection(company.companyName)}
            >
              <input
                type="checkbox"
                checked={companiesSelected.includes(company.companyName)}
                onChange={() => toggleCompanySelection(company.companyName)}
                readOnly
              />
              <p>{company.companyName}</p>
            </div>
          ))}
      </div>
      <div className={cls.priceInputWrapper}>
        <p>{t("content:FROM")}</p>
        <Input
          placeholder={t("content:PRICE")}
          value={minPrice}
          handleChange={handleMinPrice}
        />
      </div>
      <div className={cls.priceInputWrapper}>
        <p>{t("content:TO")}</p>
        <Input
          placeholder={t("content:PRICE")}
          value={maxPrice}
          handleChange={handleMaxPrice}
        />
      </div>
    </div>
  );
};

export default Filter;
