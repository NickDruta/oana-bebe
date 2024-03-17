import React, { useState } from "react";
import { useGetCategoriesQuery } from "entities/CategoryData";
import {
  ImageShortInferface,
  ProductInterface,
  useDeleteProductMutation,
  useGetProductDetailsQuery,
} from "entities/ProductsData";
import { AddIcon } from "shared/assets";
import { companies } from "shared/config";
import { Modal, Input, Select, TextArea } from "shared/ui";
import cls from "./AddModalProduct.module.scss";
import clsx from "clsx";
import { translateText } from "shared/lib/translateText/translateText";

interface AddModalProductProps {
  productSelected: ProductInterface | null;
  handleClose: () => void;
}

const AddModalProduct = ({
  productSelected,
  handleClose,
}: AddModalProductProps) => {
  // const { data: categories } = useGetCategoriesQuery();
  // const { data: productData } = useGetProductDetailsQuery(
  //   productSelected?.productId,
  //   {
  //     skip: !productSelected
  //   }
  // );
  // const [deleteProduct] = useDeleteProductMutation();
  //
  // const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  // const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  // const [colorsR, setColorsR] = useState<ImageShortInferface[]>(
  //     productData
  //     ? (productData.image as ImageShortInferface[])
  //     [
  //         {
  //           colorName: "#000000",
  //           image: [""],
  //           price: "",
  //         },
  //       ]
  // );
  //
  // const [name, setName] = useState<string>(productData ? productData.productName : "");
  // const [description, setDescription] = useState<string>(
  //     productData ? productData.description : ""
  // );
  // const [company, setCompany] = useState<string>(
  //     productData ? productData.companyName : ""
  // );
  // const [categoryName, setCategoryName] = useState<string>(
  //     productData && productData.categoryName ? productData.categoryName : ""
  // );
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");
  // const [newSpecName, setNewSpecName] = useState("");
  // const [newSpecValue, setNewSpecValue] = useState("");
  //
  // const parseSpecifications = (specificationsString: string) => {
  //   if (specificationsString === "{}") return {};
  //
  //   const specsObject: Record<string, string> = {};
  //
  //   const specsArray = specificationsString.replace(/[{}]/g, "").split(", ");
  //   specsArray.forEach((spec) => {
  //     const [key, value] = spec.split("=");
  //     if (key && value) {
  //       specsObject[key.trim()] = value.trim();
  //     }
  //   });
  //
  //   return specsObject;
  // };
  //
  // const [specifications, setSpecifications] = useState<Record<string, string>>(
  //   productData && productData.specifications
  //     ? (parseSpecifications(productData?.specifications) as Record<
  //         string,
  //         string
  //       >)
  //     : {}
  // );
  // const [specificationsRu, setSpecificationsRu] = useState<
  //   Record<string, string>
  // >(
  //   productData && productData.specificationsRu
  //     ? (parseSpecifications(productData.specificationsRu) as Record<
  //         string,
  //         string
  //       >)
  //     : {}
  // );
  //
  // const handleAddModalClose = () => {
  //   if (
  //     name ||
  //     description ||
  //     colorsR.filter((item) => item.price).length ||
  //     company ||
  //     categoryName
  //   ) {
  //     if (window.confirm("Sigur doresti sa inchizi?")) {
  //       handleClose();
  //     }
  //   } else {
  //     handleClose();
  //   }
  // };
  //
  // const allSubcategories = categories
  //   ?.map((item) =>
  //     item.categorySet.map(
  //       (subcategory) =>
  //         `${item.categoryType}, ${subcategory.categoryName}`
  //     )
  //   )
  //   .flat();
  //
  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       const img = new Image();
  //       img.onload = () => {
  //         const canvas = document.createElement("canvas");
  //         canvas.width = img.width;
  //         canvas.height = img.height;
  //         const ctx = canvas.getContext("2d");
  //         ctx?.drawImage(img, 0, 0);
  //         const jpegDataUrl = canvas.toDataURL("image/jpeg");
  //         const base64Image = jpegDataUrl.split(",")[1];
  //
  //         setColorsR((prevColorsR) => {
  //           const updatedColorsR = [...prevColorsR];
  //           updatedColorsR[selectedColorIndex].image[selectedImageIndex] =
  //             base64Image;
  //           return updatedColorsR;
  //         });
  //       };
  //       img.src = event.target?.result as string;
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  //
  // const handlePriceChange = (value: string) => {
  //   setColorsR((prevColorsR) => {
  //     // Create a new array with all previous objects
  //     const updatedColorsR = [...prevColorsR];
  //
  //     // Replace the object at the selected index with a new object
  //     // that has the updated price property
  //     updatedColorsR[selectedColorIndex] = {
  //       ...updatedColorsR[selectedColorIndex],
  //       price: value,
  //     };
  //
  //     return updatedColorsR;
  //   });
  // };
  //
  // const handleColorClear = (index: number) => {
  //   if (colorsR.length === 1) return;
  //   if (window.confirm("Sigur vrei sa stergi imaginile si pretul culorii?")) {
  //     let newColorsR = [...colorsR];
  //     newColorsR.splice(index, 1);
  //     setColorsR(newColorsR);
  //   }
  // };
  //
  // const handleAddSpecification = async () => {
  //   if (newSpecName && newSpecValue) {
  //     const ruKeyTranslated = await translateText(newSpecName);
  //     const ruKeyText = ruKeyTranslated.data.translations[0].translatedText;
  //     const ruValueTranslated = await translateText(newSpecValue);
  //     const ruValueText = ruValueTranslated.data.translations[0].translatedText;
  //
  //     setSpecifications({ ...specifications, [newSpecName]: newSpecValue });
  //     setSpecificationsRu({ ...specificationsRu, [ruKeyText]: ruValueText });
  //     setNewSpecName("");
  //     setNewSpecValue("");
  //   }
  // };
  //
  // function isEmptyObject(obj: Record<string, string>) {
  //   return Object.keys(obj).length === 0 && obj.constructor === Object;
  // }
  //
  // const getCircularReplacer = () => {
  //   const seen = new WeakSet();
  //   return (key: any, value: any) => {
  //     if (typeof value === "object" && value !== null) {
  //       if (seen.has(value)) {
  //         return;
  //       }
  //       seen.add(value);
  //     }
  //     return value;
  //   };
  // };
  //
  // function isCircular(obj: any) {
  //   const seenObjects = new WeakSet();
  //
  //   function detect(obj: any) {
  //     if (obj && typeof obj === 'object') {
  //       if (seenObjects.has(obj)) {
  //         return true;
  //       }
  //       seenObjects.add(obj);
  //
  //       for (const key in obj) {
  //         if (obj.hasOwnProperty(key) && detect(obj[key])) {
  //           return true;
  //         }
  //       }
  //     }
  //     return false;
  //   }
  //
  //   return detect(obj);
  // }
  //
  //
  // const handleSave = async () => {
  //   if (!name) {
  //     setError("Numele lipseste");
  //   }
  //   if (!description) {
  //     setError("Descrierea lipseste");
  //   }
  //   if (colorsR.filter((item) => !item.price).length) {
  //     setError("In careva culoare pretul lipseste");
  //   }
  //   if (!company) {
  //     setError("Compania lipseste");
  //   }
  //   if (!categoryName) {
  //     setError("Categoria lipseste");
  //   }
  //
  //
  //   if (
  //     !name ||
  //     !description ||
  //     colorsR.filter((item) => !item.price).length ||
  //     !company ||
  //     !categoryName ||
  //     isLoading
  //   )
  //     return;
  //   setIsLoading(true);
  //
  //   let selectedId;
  //
  //   const matchingCategory = categories?.find((categoryItem) =>
  //     categoryItem.categorySet.some(
  //       (subcategory) =>
  //         productSelected
  //             ? subcategory.categoryName === categoryName
  //             : `${categoryItem.categoryType}, ${subcategory.categoryName}` === categoryName
  //     )
  //   );
  //
  //   if (matchingCategory) {
  //     const matchingSubCategory = matchingCategory.categorySet.find(
  //       (subcategory) =>
  //           productSelected
  //               ? subcategory.categoryName === categoryName
  //               : `${matchingCategory.categoryType}, ${subcategory.categoryName}` === categoryName
  //     );
  //
  //     selectedId = matchingSubCategory?.categoryId;
  //   }
  //
  //   if (selectedId) {
  //     const ruNameResponse = await translateText(name);
  //     const ruName = ruNameResponse.data.translations[0].translatedText;
  //
  //     const ruDescriptionResponse = await translateText(description);
  //     const ruDescription =
  //       ruDescriptionResponse.data.translations[0].translatedText;
  //
  //     const data = {
  //       product_name: name,
  //       product_name_ru: ruName,
  //       description: description,
  //       description_ru: ruDescription,
  //       company_product: company,
  //       category: selectedId ?? "",
  //       specification: isEmptyObject(specifications) || isCircular(specifications) ? {} : specifications,
  //       specificationRu: isEmptyObject(specificationsRu) || isCircular(specificationsRu) ? {} : specificationsRu,
  //       images: colorsR,
  //     }
  //
  //     fetch(`${process.env.REACT_APP_API_URL}product/add`, {
  //       method: "POST",
  //       body: JSON.stringify(data, getCircularReplacer()),
  //       headers: {
  //         Authorization: sessionStorage.getItem("admin") || "",
  //         "Content-Type": "application/json",
  //       },
  //     }).then((res: any) => {
  //       if (productSelected && res.ok) {
  //         deleteProduct(productSelected.productId).then(() =>
  //             window.location.reload()
  //         );
  //       }
  //       !productSelected && window.location.reload()
  //     });
  //   }
  // };
  //
  // return (
  //   <Modal handleClickAway={handleAddModalClose}>
  //     <div className={cls.modalWrapper}>
  //       <p className={cls.title}>
  //         {productSelected ? "Editeaza produs" : "Adauga produs"}
  //       </p>
  //       <div className={cls.dataWrapper}>
  //         <div className={cls.imageWrapper}>
  //           {colorsR[selectedColorIndex].image[selectedImageIndex] ? (
  //             <div
  //               onClick={(e) => {
  //                 e.stopPropagation();
  //                 setColorsR((prevColorsR) => {
  //                   const updatedColorsR = [...prevColorsR];
  //                   updatedColorsR[selectedColorIndex].image[
  //                     selectedImageIndex
  //                   ] = "";
  //
  //                   return updatedColorsR;
  //                 });
  //               }}
  //             >
  //               <img
  //                 src={`data:image/png;base64,${colorsR[selectedColorIndex].image[selectedImageIndex]}`}
  //                 alt=""
  //                 className={cls.previewImage}
  //               />
  //             </div>
  //           ) : (
  //             <label className={cls.label}>
  //               <AddIcon />
  //               <span className={cls.title}>Adauga Imagine</span>
  //               <input type="file" onChange={handleImageChange} />
  //             </label>
  //           )}
  //
  //           <div className={cls.imagesPreview}>
  //             {colorsR[selectedColorIndex].image.map((item, imageIndex) =>
  //               item ? (
  //                 <img
  //                   src={`data:image/png;base64,${item}`}
  //                   alt=""
  //                   className={cls.previewSmallImage}
  //                   onClick={() => setSelectedImageIndex(imageIndex)}
  //                 />
  //               ) : (
  //                 <div
  //                   className={cls.noImagePreview}
  //                   onClick={() => setSelectedImageIndex(imageIndex)}
  //                 ></div>
  //               )
  //             )}
  //             <div
  //               className={cls.noImagePreview}
  //               onClick={() => {
  //                 setColorsR((prevColorsR) => {
  //                   let updatedColorsR = [...prevColorsR];
  //                   updatedColorsR[selectedColorIndex].image = [
  //                     ...updatedColorsR[selectedColorIndex].image,
  //                     "",
  //                   ];
  //
  //                   return updatedColorsR;
  //                 });
  //               }}
  //             >
  //               +
  //             </div>
  //           </div>
  //
  //           <div className={cls.colorWrapper}>
  //             {colorsR.map(({ colorName }, index) => (
  //               <div className={cls.colorRelative}>
  //                 <div
  //                   className={cls.colorClear}
  //                   onClick={() => handleColorClear(index)}
  //                 >
  //                   x
  //                 </div>
  //                 <div
  //                   key={index}
  //                   className={clsx(
  //                     cls.color,
  //                     index === selectedColorIndex && cls.activeColor
  //                   )}
  //                   style={{ background: colorName }}
  //                   onClick={() => {
  //                     setSelectedImageIndex(0);
  //                     setSelectedColorIndex(index);
  //                   }}
  //                 />
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //         <div className={cls.detailsWrapper}>
  //           <Input
  //             placeholder="Nume"
  //             value={name}
  //             handleChange={(value) => setName(value)}
  //           />
  //           <TextArea
  //             placeholder="Descriere"
  //             value={description}
  //             handleChange={(value) => setDescription(value)}
  //           />
  //           <input
  //             className={cls.input}
  //             placeholder="Pret"
  //             value={colorsR[selectedColorIndex].price}
  //             onChange={(e) => handlePriceChange(e.target.value)}
  //           />
  //           <Select
  //             options={companies}
  //             value={company}
  //             placeholder="Companie"
  //             handleChange={(value) => setCompany(value)}
  //           />
  //           <Select
  //             options={allSubcategories ?? [""]}
  //             value={categoryName}
  //             handleChange={(value) => setCategoryName(value)}
  //             placeholder="Categorie"
  //           />
  //
  //           <div className={cls.colorWrapper}>
  //             {colorsR.map(({ colorName }, index) => (
  //               <input
  //                 key={index}
  //                 type="color"
  //                 value={colorName}
  //                 onChange={(e) => {
  //                   const value = e.target.value;
  //                   setColorsR((prevColorsR) => {
  //                     const updatedColorsR = [...prevColorsR];
  //                     updatedColorsR[index] = {
  //                       colorName: value,
  //                       image: updatedColorsR[index].image,
  //                       price: updatedColorsR[index].price,
  //                     };
  //                     return updatedColorsR;
  //                   });
  //                 }}
  //               />
  //             ))}
  //             <div
  //               className={cls.color}
  //               onClick={() => {
  //                 setColorsR((prevColorsR) => {
  //                   const updatedColorsR = [...prevColorsR];
  //                   updatedColorsR.push({
  //                     colorName: "#000000",
  //                     image: [""],
  //                     price: "",
  //                   });
  //
  //                   return updatedColorsR;
  //                 });
  //               }}
  //             >
  //               <AddIcon />
  //             </div>
  //           </div>
  //
  //           {error ? <div className={cls.error}>{error}</div> : ""}
  //           <div className={cls.saveButton} onClick={handleSave}>
  //             {isLoading ? "Se incarca" : "Adauga"}
  //           </div>
  //         </div>
  //
  //         <div className={cls.detailsWrapper}>
  //           <div className={cls.specificationsWrapper}>
  //             <div className={cls.specificationItem}>
  //               <Input
  //                 placeholder="Specificati"
  //                 value={newSpecName}
  //                 handleChange={(value) => setNewSpecName(value)}
  //               />
  //               <Input
  //                 placeholder="Valoare"
  //                 value={newSpecValue}
  //                 handleChange={(value) => setNewSpecValue(value)}
  //               />
  //             </div>
  //             <div className={cls.saveButton} onClick={handleAddSpecification}>
  //               Adauga Specificatie
  //             </div>
  //
  //             {!isEmptyObject(specifications) ? Object.entries(specifications).map(([key, value], index) => (
  //               <div key={index} className={cls.specificationItem}>
  //                 <span>
  //                   {key}: {value}
  //                 </span>
  //               </div>
  //             )) : <></>}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </Modal>
  return (
      <></>
  );
};

export default AddModalProduct;
