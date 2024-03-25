import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { AddBasicInfo } from "features/AddBasicInfo";
import { ColorInfo } from "features/ColorInfo";
import { PricesInfo } from "features/PricesInfo";
import {
  ProductInterface,
  useAddImagesMutation,
  useCreateBasicInfoProductMutation,
} from "entities/ProductsData";
import { emptyProduct } from "shared/config";
import { Modal, Button } from "shared/ui";
import { translateText } from "shared/lib/translateText/translateText";
import cls from "./AddModalProduct.module.scss";

interface FileWithPreview extends File {
  preview: string;
}

interface AddModalProductProps {
  handleClose: () => void;
}

const AddModalProduct = ({ handleClose }: AddModalProductProps) => {
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
  const [product, setProduct] = useState<ProductInterface>(emptyProduct);

  /**
   * Color of the product
   */
  const [color, setColor] = useState<string>("#ffffff");

  /**
   * Color of the product
   */
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  /**
   * State for triggering the function in PricesInfo
   */
  const [triggerAction, setTriggerAction] = useState(false);

  /**
   * Function to change some value from the product
   * @param key
   * @param value
   */

  const handleChange = useCallback(
    (
      key: keyof ProductInterface,
      value: string | number | boolean | object | null,
    ) => {
      setProduct((currentProduct) => ({ ...currentProduct, [key]: value }));
    },
    [],
  );

  /**
   * Handling closing the modal with confirming
   */
  const handleConfirmedClose = () => {
    if (product) {
      window.confirm("Sigur vrei sa inchizi?") && handleClose();
    } else {
      handleClose();
    }
  };

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
            hasSteps
          />
        );
      case stepsNumber:
        return (
          <PricesInfo
            product={product}
            triggerAction={triggerAction}
            resetTrigger={() => setTriggerAction(false)}
            handleClose={handleClose}
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
        );
    }
  };

  /**
   * Handling next step
   */
  const goNext = () => {
    if (step === 1) {
      // setStep(step + 1)
      saveBasicInfo();
    } else if (step === stepsNumber) {
      setTriggerAction(true);
    } else {
      // setStep(step + 1)
      saveColor();
    }
  };

  /**
   * Function to save the basic info from first step
   */
  const saveBasicInfo = async () => {
    if (!stepsNumber) {
      toast.error("Ai uitat să introduci numărul de culori!");
      return;
    }

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
      specificationsRu: product.specificationsRu,
    }).then((res: any) => {
      if ("data" in res) {
        setProduct({
          ...res.data?.data,
        });
        setStep(step + 1);
        setLoading(false);
        toast.success("Informațiile generale ale produsului au fost salvate!");
      } else {
        setLoading(false);
        toast.error(res.error.data.error);
      }
    });
  };

  /**
   * Function to save the color and her images
   */
  const saveColor = async () => {
    try {
      const result = await triggerAddImages({
        bucketName: product.bucketName,
        color: color,
        files: files,
      }).unwrap();
      setStep(step + 1);
      setFiles([]);
      setColor("#ffffff");
      toast.success("Culoarea cu imagini a fost salvată cu succes!");
    } catch (error: any) {
      console.error("Failed to upload images", error);
      toast.error(
        `Failed to upload images: ${error.data?.message || "An unknown error occurred"}`,
      );
    }
  };

  return (
    <Modal handleClickAway={handleConfirmedClose}>
      <div className={cls.modalWrapper}>
        <p className={cls.title}>Adaugă produs</p>
        <p className={cls.description}>
          Adăugarea unui produs constă din mai mulți pași, adaugă până la
          sfârșit pentru a adăuga produsul!
        </p>
        <div className={cls.dataWrapper}>
          {getContentByStep()}
          <div className={cls.buttonsWrapper}>
            <Button
              type={"primary"}
              text={step === stepsNumber ? "Finiseaza" : "Inainte"}
              onClick={goNext}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddModalProduct;
