import React from 'react';
import {Button, Input} from "shared/ui";
import {companies} from "shared/config";
import {useTranslation} from "react-i18next";
import cls from './Filter.module.scss';

interface Props {
    search: string;
    handleSearch: (_: string) => void;
    companiesSelected: string[];
    handleCompaniesSelected: (_: string) => void;
    minPrice: string;
    handleMinPrice: (_: string) => void;
    maxPrice: string;
    handleMaxPrice: (_: string) => void;
    handleApply: () => void;
}

const Filter = ({
        search,
        handleSearch,
        companiesSelected,
        handleCompaniesSelected,
        minPrice,
        handleMinPrice,
        maxPrice,
        handleMaxPrice,
        handleApply
    }: Props) => {
    const {t} = useTranslation();

    return (
        <div className={cls.filtersWrapper}>
            <p className={cls.title}>{t("content:FILTERS")}</p>
            <Input
                placeholder={t("content:SEARCH_PRODUCT")}
                value={search}
                handleChange={(value) => handleSearch(value)}
            />
            <div className={cls.companiesWrapper}>
                {companies.map((item, index) => (
                    <div
                        key={index}
                        className={cls.company}
                        onClick={() => handleCompaniesSelected(item)}
                    >
                        <input
                            type="checkbox"
                            checked={companiesSelected.includes(item)}
                            readOnly
                        />
                        <p>{item}</p>
                    </div>
                ))}
            </div>
            <div className={cls.priceInputWrapper}>
                <p>{t("content:FROM")}</p>
                <Input
                    placeholder={t("content:PRICE")}
                    value={minPrice}
                    handleChange={(value) => handleMinPrice(value)}
                />
            </div>
            <div className={cls.priceInputWrapper}>
                <p>{t("content:TO")}</p>
                <Input
                    placeholder={t("content:PRICE")}
                    value={maxPrice}
                    handleChange={(value) => handleMaxPrice(value)}
                />
            </div>
            <Button
                type="primary"
                text={t("content:APPLY")}
                onClick={handleApply}
            />
        </div>
    )
}

export default Filter;