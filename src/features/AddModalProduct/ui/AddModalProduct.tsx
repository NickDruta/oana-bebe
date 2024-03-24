import React, {useCallback, useState} from "react";
import { AddBasicInfo } from "features/AddBasicInfo";
import { ColorInfo } from "features/ColorInfo";
import {
  ProductInterface, useAddImagesMutation, useCreateBasicInfoProductMutation,
} from "entities/ProductsData";
import {emptyProduct} from "shared/config";
import {Modal, Button} from "shared/ui";
import {translateText} from "shared/lib/translateText/translateText";
import cls from "./AddModalProduct.module.scss";

interface FileWithPreview extends File {
  preview: string;
}

interface AddModalProductProps {
  productSelected: ProductInterface | null;
  handleClose: () => void;
}

const AddModalProduct = ({
  productSelected,
  handleClose,
}: AddModalProductProps) => {
  const [triggerCreateBasicInfo] = useCreateBasicInfoProductMutation();
  const [triggerAddImages] = useAddImagesMutation();

  /**
   * Loading of API between steps
   */
  const [loading, setLoading] = useState(false);

  /**
   * Step of the modal which the user is
   */
  const [step, setStep] = useState(1);
  /**
   * Number of steps for the modal
   */
  const [stepsNumber, setStepsNumber] = useState<number | null>(null);

  /**
   * Product Data
   */
  const [product, setProduct] = useState<ProductInterface>(productSelected ?? emptyProduct);
  console.log(product)

  /**
   * Color of the product
   */
  const [color, setColor] = useState<string>('#ffffff');

  /**
   * Color of the product
   */
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  /**
   * Function to change some value from the product
   * @param key
   * @param value
   */

  const handleChange = useCallback((key: keyof ProductInterface, value: string | number | boolean | object | null) => {
    setProduct((currentProduct) => ({ ...currentProduct, [key]: value }));
  }, []);

  /**
   * Handling closing the modal with confirming
   */
  const handleConfirmedClose = () => {
    if (product) {
      window.confirm("Sigur vrei sa inchizi?") && handleClose();
    } else {
      handleClose();
    }
  }

  /**
   * Handling content on step modification
   */
  const getContentByStep = () => {
    switch (step) {
      case 1:
        return (
            <AddBasicInfo
                product={product}
                stepsNumber={stepsNumber}
                handleChange={handleChange}
                handleStepsNumber={(value) => setStepsNumber(value)}
            />
        );
      default:
        return (
            <ColorInfo
                color={color}
                setColor={setColor}
                files={files}
                setFiles={setFiles}
            />
        )
    }
  }

  /**
   * Handling next step
   */
  const goNext = () => {
    if (step === 1) {
      // setStep(step + 1)
      saveBasicInfo();
    } else {
      saveColor();
    }
  }

  /**
   * Function to save the basic info from first step
   */
  const saveBasicInfo = async () => {
    setLoading(true);

    const productNameRuData = await translateText(product.productName);
    const productNameRu = productNameRuData.data.translations[0].translatedText;

    const descriptionRuData = await translateText(product.description);
    const descriptionRu = descriptionRuData.data.translations[0].translatedText;

    triggerCreateBasicInfo({
      productName: product.productName,
      productNameRu: productNameRu,
      description: product.description,
      descriptionRu: descriptionRu,
      companyName: product.companyName,
      categoryId: product.category.categoryId,
      specifications: product.specifications,
      specificationsRu: product.specificationsRu
    }).then((res: any) => {
      if ('data' in res) {
        setProduct({
          ...res.data?.data
        })
        setStep(step + 1);
        setLoading(false);
      }
    })
  }

  /**
   * Function to save the color and her images
   */
  const saveColor = async () => {
    try {
      const result = await triggerAddImages({
        bucketName: product.bucketName,
        color: color,
        files: files
      }).unwrap();
      setStep(step + 1);
      console.log("Images uploaded successfully", result);
    } catch (error) {
      // Handle error
      console.error("Failed to upload images", error);
    }
  };

  return (
    <Modal handleClickAway={handleConfirmedClose}>
      <div className={cls.modalWrapper}>
        <p className={cls.title}>
          {productSelected ? "Editează produs" : "Adaugă produs"}
        </p>
        <p className={cls.description}>Adăugarea unui produs constă din mai mulți pași, adaugă până la sfârșit pentru a adăuga produsul!</p>
        <div className={cls.dataWrapper}>
          {getContentByStep()}
          <div className={cls.buttonsWrapper}>
            <Button type={"primary"} text={step === stepsNumber ? "Finiseaza" : "Inainte"} onClick={goNext} disabled={loading} />
          </div>
        </div>
      </div>
    </Modal>
  )
};

export default AddModalProduct;
