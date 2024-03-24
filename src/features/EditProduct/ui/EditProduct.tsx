import React, {useCallback, useState} from 'react';
import {toast} from "react-toastify";
import {AddBasicInfo} from "features/AddBasicInfo";
import {ProductInterface, useUpdateBasicInfoMutation} from "entities/ProductsData";
import {Button, Modal} from "shared/ui";
import {translateText} from "shared/lib/translateText/translateText";
import cls from './EditProduct.module.scss';

interface Props {
    selectedProduct: ProductInterface;
    handleClose: () => void;
}

const EditProduct = ({selectedProduct, handleClose}: Props) => {
    const [triggerUpdate] = useUpdateBasicInfoMutation();
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(selectedProduct)

    const handleChange = useCallback((key: keyof ProductInterface, value: string | number | boolean | object | null) => {
        setProduct((currentProduct) => ({ ...currentProduct, [key]: value }));
    }, []);

    const saveBasicInfo = async () => {
        setLoading(true);

        const productNameRuData = await translateText(product.productName);
        const productNameRu = productNameRuData.data.translations[0].translatedText;

        const descriptionRuData = await translateText(product.description);
        const descriptionRu = descriptionRuData.data.translations[0].translatedText;

        triggerUpdate({
            productId: product.productId,
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
                setLoading(false);
                handleClose();
                toast.success('Informațiile generale ale produsului au fost salvate!');
            } else {
                setLoading(false);
                toast.error(res.error.data.error);
            }
        })
    }

    return(
        <Modal handleClickAway={handleClose}>
            <div className={cls.modalWrapper}>
                <p className={cls.title}>
                    Editează produs
                </p>
                <div className={cls.dataWrapper}>
                    <AddBasicInfo
                        product={product}
                        handleChange={handleChange}
                    />
                    <div className={cls.buttonsWrapper}>
                        <Button type={"primary"} text="Finiseaza" onClick={saveBasicInfo} disabled={loading}/>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default EditProduct;