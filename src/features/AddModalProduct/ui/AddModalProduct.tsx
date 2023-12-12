import React, { useState } from "react";
import { useGetCategoriesQuery } from "entities/CategoryData";
import { useCreateProductMutation } from "entities/ProductsData";
import { AddIcon } from "shared/assets";
import { companies } from "shared/config";
import { Modal, Input, Select, TextArea } from "shared/ui";
import cls from "./AddModalProduct.module.scss";
import clsx from "clsx";
import { translateText } from "shared/lib/translateText/translateText";

interface AddModalProductProps {
  handleClose: () => void;
}

const AddModalProduct = ({ handleClose }: AddModalProductProps) => {
  const { data: categories } = useGetCategoriesQuery();
  const [createProduct] = useCreateProductMutation();

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [colorsR, setColorsR] = useState<
    { image: string[]; price: string; colorName: string }[]
  >([
    {
      colorName: "#000000",
      image: [""],
      price: "",
    },
  ]);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [newSpecName, setNewSpecName] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [specifications, setSpecifications] = useState<Record<string, string>>(
    {}
  );

  const handleAddModalClose = () => {
    if (
      name ||
      description ||
      colorsR.filter((item) => item.price).length ||
      company ||
      categoryName
    ) {
      if (window.confirm("Sigur doresti sa inchizi?")) {
        handleClose();
      }
    }
  };

  const allSubcategories = categories
    ?.map((item) =>
      item.subCategoryResponse.map(
        (subcategory) =>
          `${item.categoryType.categoryTypeName}, ${subcategory.subCategoryName}`
      )
    )
    .flat();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target?.result as string;
        const fullImage = base64Image.split(",")[1];
        setColorsR((prevColorsR) => {
          const updatedColorsR = [...prevColorsR];
          updatedColorsR[selectedColorIndex].image[selectedImageIndex] =
            fullImage;

          return updatedColorsR;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePriceChange = (value: string) => {
    setColorsR((prevColorsR) => {
      const updatedColorsR = [...prevColorsR];
      updatedColorsR[selectedColorIndex].price = value;

      return updatedColorsR;
    });
  };

  const handleAddSpecification = () => {
    if (newSpecName && newSpecValue) {
      setSpecifications({ ...specifications, [newSpecName]: newSpecValue });
      setNewSpecName("");
      setNewSpecValue("");
    }
  };

  const handleSave = async () => {
    console.log("!");
    if (!name) {
      setError("Numele lipseste");
    }
    if (!description) {
      setError("Descrierea lipseste");
    }
    if (colorsR.filter((item) => !item.price).length) {
      setError("In careva culoare pretul lipseste");
    }
    if (!company) {
      setError("Compania lipseste");
    }
    if (!categoryName) {
      setError("Categoria lipseste");
    }

    if (!specifications) {
      setError("Specificatiile lipsesc");
    }

    if (
      !name ||
      !description ||
      colorsR.filter((item) => !item.price).length ||
      !company ||
      !categoryName ||
      !specifications ||
      isLoading
    )
      return;
    setIsLoading(true);

    let selectedId;

    const matchingCategory = categories?.find((categoryItem) =>
      categoryItem.subCategoryResponse.some(
        (subcategory) =>
          `${categoryItem.categoryType.categoryTypeName}, ${subcategory.subCategoryName}` ===
          categoryName
      )
    );

    if (matchingCategory) {
      const matchingSubCategory = matchingCategory.subCategoryResponse.find(
        (subcategory) =>
          `${matchingCategory.categoryType.categoryTypeName}, ${subcategory.subCategoryName}` ===
          categoryName
      );

      selectedId = matchingSubCategory?.subCategoryId;
    }

    if (selectedId) {
      const ruNameResponse = await translateText(name);
      const ruName = ruNameResponse.data.translations[0].translatedText;

      const ruDescriptionResponse = await translateText(description);
      const ruDescription =
        ruDescriptionResponse.data.translations[0].translatedText;

      createProduct({
        product_name: name,
        product_name_ru: ruName,
        description: description,
        description_ru: ruDescription,
        company_product: company,
        category: selectedId ?? "",
        specification: specifications,
        images: colorsR,
      }).then(() => {
        window.location.reload();
      });
    }
  };

  return (
    <Modal handleClickAway={handleAddModalClose}>
      <div className={cls.modalWrapper}>
        <p className={cls.title}>Adauga produs</p>
        <div className={cls.dataWrapper}>
          <div className={cls.imageWrapper}>
            {colorsR[selectedColorIndex].image[selectedImageIndex] ? (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setColorsR((prevColorsR) => {
                    const updatedColorsR = [...prevColorsR];
                    updatedColorsR[selectedColorIndex].image[
                      selectedImageIndex
                    ] = "";

                    return updatedColorsR;
                  });
                }}
              >
                <img
                  src={`data:image/png;base64,${colorsR[selectedColorIndex].image[selectedImageIndex]}`}
                  alt=""
                  className={cls.previewImage}
                />
              </div>
            ) : (
              <label className={cls.label}>
                <AddIcon />
                <span className={cls.title}>Adauga Imagine</span>
                <input type="file" onChange={handleImageChange} />
              </label>
            )}

            <div className={cls.imagesPreview}>
              {colorsR[selectedColorIndex].image.map((item, imageIndex) =>
                item ? (
                  <img
                    src={`data:image/png;base64,${item}`}
                    alt=""
                    className={cls.previewSmallImage}
                    onClick={() => setSelectedImageIndex(imageIndex)}
                  />
                ) : (
                  <div
                    className={cls.noImagePreview}
                    onClick={() => setSelectedImageIndex(imageIndex)}
                  ></div>
                )
              )}
              <div
                className={cls.noImagePreview}
                onClick={() => {
                  setColorsR((prevColorsR) => {
                    let updatedColorsR = [...prevColorsR];
                    updatedColorsR[selectedColorIndex].image = [
                      ...updatedColorsR[selectedColorIndex].image,
                      "",
                    ];

                    return updatedColorsR;
                  });
                }}
              >
                +
              </div>
            </div>

            <div className={cls.colorWrapper}>
              {colorsR.map(({ colorName }, index) => (
                <div
                  key={index}
                  className={clsx(
                    cls.color,
                    index === selectedColorIndex && cls.activeColor
                  )}
                  style={{ background: colorName }}
                  onClick={() => setSelectedColorIndex(index)}
                />
              ))}
            </div>
          </div>
          <div className={cls.detailsWrapper}>
            <Input
              placeholder="Nume"
              value={name}
              handleChange={(value) => setName(value)}
            />
            <TextArea
              placeholder="Descriere"
              value={description}
              handleChange={(value) => setDescription(value)}
            />
            <input
              className={cls.input}
              placeholder="Pret"
              value={colorsR[selectedColorIndex].price}
              onChange={(e) => handlePriceChange(e.target.value)}
            />
            <Select
              options={companies}
              value={company}
              placeholder="Companie"
              handleChange={(value) => setCompany(value)}
            />
            <Select
              options={allSubcategories ?? [""]}
              value={categoryName}
              handleChange={(value) => setCategoryName(value)}
              placeholder="Categorie"
            />

            <div className={cls.colorWrapper}>
              {colorsR.map(({ colorName }, index) => (
                <input
                  key={index}
                  type="color"
                  value={colorName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setColorsR((prevColorsR) => {
                      const updatedColorsR = [...prevColorsR];
                      updatedColorsR[index] = {
                        colorName: value,
                        image: updatedColorsR[index].image,
                        price: updatedColorsR[index].price,
                      };
                      return updatedColorsR;
                    });
                  }}
                />
              ))}
              <div
                className={cls.color}
                onClick={() => {
                  setColorsR((prevColorsR) => {
                    const updatedColorsR = [...prevColorsR];
                    updatedColorsR.push({
                      colorName: "#000000",
                      image: [""],
                      price: "",
                    });

                    return updatedColorsR;
                  });
                }}
              >
                <AddIcon />
              </div>
            </div>

            {error ? <div className={cls.error}>{error}</div> : ""}
            <div className={cls.saveButton} onClick={handleSave}>
              {isLoading ? "Se incarca" : "Adauga"}
            </div>
          </div>

          <div className={cls.detailsWrapper}>
            <div className={cls.specificationsWrapper}>
              <div className={cls.specificationItem}>
                <Input
                  placeholder="Specificati"
                  value={newSpecName}
                  handleChange={setNewSpecName}
                />
                <Input
                  placeholder="Valoare"
                  value={newSpecValue}
                  handleChange={setNewSpecValue}
                />
              </div>
              <div className={cls.saveButton} onClick={handleAddSpecification}>
                Adauga Specificatie
              </div>

              {Object.entries(specifications).map(([key, value], index) => (
                <div key={index} className={cls.specificationItem}>
                  <span>
                    {key}: {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddModalProduct;
