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

  const [selectedImage, setSelectedImage] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [prices, setPrices] = useState<string[]>([""]);
  const [company, setCompany] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");
  const [colors, setColors] = useState<string[]>(["#000000"]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
        setImages((prevImages) => {
          const updatedImages = [...prevImages];
          updatedImages[selectedImage] = fullImage;
          return updatedImages;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePriceChange = (value: string) => {
    let newPrices = [...prices];
    newPrices[selectedImage] = value;
    setPrices(newPrices);
  };

  const handleSave = async () => {
    if (!name) {
      setError("Numele lipseste");
    }
    if (!description) {
      setError("Descrierea lipseste");
    }
    if (prices.length < colors.length) {
      setError("In careva culoare pretul lipseste");
    }
    if (!company) {
      setError("Compania lipseste");
    }
    if (!categoryName) {
      setError("Categoria lipseste");
    }

    if (
      !name ||
      !description ||
      !prices ||
      !company ||
      !categoryName 
      // isLoading
    )
      return;
    setIsLoading(true);

    let selectedId;

    const matchingCategory = categories?.find(categoryItem =>
      categoryItem.subCategoryResponse.some(subcategory =>
        `${categoryItem.categoryType.categoryTypeName}, ${subcategory.subCategoryName}` === categoryName
      )
    );
    
    if (matchingCategory) {
      const matchingSubCategory = matchingCategory.subCategoryResponse.find(subcategory =>
        `${matchingCategory.categoryType.categoryTypeName}, ${subcategory.subCategoryName}` === categoryName
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
        images: colors.map((color, index) => {
          return {
            image: images[index],
            price: prices[index],
            colorName: color,
          };
        }),
      }).then(() => {
        // window.location.reload();
        console.log("!")
      });
    }
  };

  return (
    <Modal handleClickAway={handleClose}>
      <div className={cls.modalWrapper}>
        <p className={cls.title}>Adauga produs</p>
        <div className={cls.dataWrapper}>
          <div className={cls.imageWrapper}>
            {images.length && images[selectedImage] ? (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setImages((prevImages) => {
                    const updatedImages = [...prevImages];
                    updatedImages[selectedImage] = "";
                    return updatedImages;
                  });
                }}
              >
                <img
                  src={`data:image/png;base64,${images[selectedImage]}`}
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
            <div className={cls.colorWrapper}>
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={clsx(
                    cls.color,
                    index === selectedImage && cls.activeColor
                  )}
                  style={{ background: color }}
                  onClick={() => setSelectedImage(index)}
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
              value={prices[selectedImage]}
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
              {colors.map((color, index) => (
                <input
                  key={index}
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const value = e.target.value;
                    setColors((prevColors) => {
                      const updatedColors = [...prevColors];
                      updatedColors[index] = value;
                      return updatedColors;
                    });
                  }}
                />
              ))}
              <div
                className={cls.color}
                onClick={() => {
                  setColors([...colors, "#000000"]);
                  setImages([...images, ""]);
                  setPrices([...prices, ""]);
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
        </div>
      </div>
    </Modal>
  );
};

export default AddModalProduct;
