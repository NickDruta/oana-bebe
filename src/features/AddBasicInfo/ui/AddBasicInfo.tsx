import React, {useState} from 'react';
import {useGetCategoriesQuery} from "entities/CategoryData";
import {ProductInterface} from "entities/ProductsData";
import {companies} from "shared/config";
import {Input, Select, TextArea} from "shared/ui";
import cls from './AddBasicInfo.module.scss';
import {translateText} from "../../../shared/lib/translateText/translateText";

interface Props {
    product: ProductInterface;
    handleChange: (key: keyof ProductInterface, value: string | number | boolean | object | null) => void;
    stepsNumber?: number | null;
    handleStepsNumber?: (value: number) => void;
    hasSteps?: boolean;
}

const AddBasicInfo = ({product, handleChange, stepsNumber, handleStepsNumber, hasSteps}: Props) => {
    const {data: categories} = useGetCategoriesQuery();

    /**
     * Transform categories data to an array with all subcategories name
     */
    const parseCategories = (): string[] => {
        return categories ? categories.flatMap(item =>
            item.categorySet.map(subcategory => subcategory.categoryName)
        ) : [];
    };
    const subcategories: string[] = parseCategories();

    /**
     * Get subcategory name based on categoryId of the product saved
     */
    const getSubcategoryNameBasedOnId = (): string => {
        return product.category.categoryId && categories
            ? (categories
                .flatMap(item => item.categorySet)
                .find(subcategory => subcategory.categoryId === product.category.categoryId)?.categoryName || "")
            : "";
    };

    /**
     * Get categoryId based on subcategory name of the product saved
     */
    const getIdBasedOnSubcategoryName = (value: string): number | null => {
        return categories
            ? (categories
                .flatMap(item => item.categorySet)
                .find(subcategory => subcategory.categoryName === value)?.categoryId || null)
            : null;
    };


    /**
     * Name of the new specification which will be added
     */
    const [specificationName, setSpecificationName] = useState("");
    /**
     * Value of the new specification which will be added
     */
    const [specificationValue, setSpecificationValue] = useState("");

    /**
     * Function to format all the specifications in an array
     */
    const parseSpecifications = (specificationsString: string) => {
        if (specificationsString === '{}') return [];

        return specificationsString.slice(1, -1).split(', ')
            .map(spec => {
                const [name, value] = spec.split('=');
                return { name, value };
            });
    };

    /**
     * Function to add the specification to the product
     */
    const handleAddSpecification = async () => {
        if (specificationName && specificationValue) {
            const specifications = product.specifications.replace('}', '').concat(
                `${product.specifications !== '{}' ? ', ': ''}${specificationName}=${specificationValue}}`
            )
            handleChange('specifications', specifications);
            setSpecificationName("");
            setSpecificationValue("");

            const specificationNameRuData = await translateText(specificationName);
            const specificationNameRu = specificationNameRuData.data.translations[0].translatedText;

            const specificationValueRuData = await translateText(specificationValue)
            const specificationValueRu = specificationValueRuData.data.translations[0].translatedText
            const specificationsRu = product.specificationsRu.replace('}', '').concat(
                `${product.specifications !== '{}' ? ', ': ''}${specificationNameRu}=${specificationValueRu}}`
            )
            handleChange('specificationsRu', specificationsRu);
        }
    }

    /**
     * Function to remove the specification on click
     */
    const handleRemoveSpecificationByIndex = async (indexToRemove: number) => {
        const specificationsArray = parseSpecifications(product.specifications);
        const specificationsRuArray = parseSpecifications(product.specificationsRu);

        if (indexToRemove >= 0 && indexToRemove < specificationsArray.length) {
            specificationsArray.splice(indexToRemove, 1);
        }
        if (indexToRemove >= 0 && indexToRemove < specificationsRuArray.length) {
            specificationsRuArray.splice(indexToRemove, 1);
        }

        const updatedSpecificationsString = `{${specificationsArray.map(spec => `${spec.name}=${spec.value}`).join(', ')}}`;
        const updatedSpecificationsRuString = `{${specificationsRuArray.map(spec => `${spec.name}=${spec.value}`).join(', ')}}`;

        handleChange('specifications', updatedSpecificationsString);
        handleChange('specificationsRu', updatedSpecificationsRuString);
    };

    return (
        <div className={cls.addBasicInfoWrapper}>
            <div className={cls.smallDataWrapper}>
                {hasSteps && handleStepsNumber ? (
                    <Input placeholder="Numarul de culori" value={!stepsNumber ? '' : String(stepsNumber - 2)} handleChange={(value) => handleStepsNumber(Number(value) + 2)} />
                ) : <></>}
                <Input placeholder="Numele" value={product.productName} handleChange={(value) => handleChange('productName', value)} />
                <TextArea placeholder="Descrierea" value={product.description} handleChange={(value) => handleChange('description', value)} />
                <Select placeholder="Compania" options={companies} value={product.companyName} handleChange={(value) => handleChange('companyName', value)} />
                <Select
                    placeholder="Categoria"
                    options={subcategories}
                    value={getSubcategoryNameBasedOnId()}
                    handleChange={(value) => handleChange('category', {
                        ...product.category,
                        categoryId: getIdBasedOnSubcategoryName(value)
                    })} />
            </div>
            <div className={cls.specificationsWrapper}>
                <div className={cls.inputsWrapper}>
                    <Input placeholder="Numele specificației" value={specificationName}
                           handleChange={setSpecificationName}/>
                    <Input placeholder="Valoarea specificației" value={specificationValue}
                           handleChange={setSpecificationValue}/>
                </div>
                <button
                    className={cls.actionButton}
                    onClick={handleAddSpecification}
                    disabled={!specificationName || !specificationValue}
                >
                    Salvează specificația
                </button>
                <div className={cls.specificationsPreview}>
                    {parseSpecifications(product.specifications).map((spec, index) => (
                        <div key={index} className={cls.specificationItem}>
                            <span>{spec.name}: {spec.value}</span>
                            <button onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveSpecificationByIndex(index)}
                            }>X</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default React.memo(AddBasicInfo);