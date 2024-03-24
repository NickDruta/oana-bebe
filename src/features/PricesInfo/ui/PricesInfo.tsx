import React, { useState, useEffect } from 'react';
import {toast} from "react-toastify";
import {
    ImageInterface,
    ProductInterface,
    useGetProductDetailsQuery,
    useUpdateProductPricesMutation
} from "entities/ProductsData";
import { Input, LoadingSpinner } from "shared/ui";
import cls from './PricesInfo.module.scss';

interface Props {
    product: ProductInterface;
    triggerAction: boolean;
    resetTrigger: () => void;
    handleClose: () => void;
}

const PricesInfo = ({ product, triggerAction, resetTrigger, handleClose }: Props) => {
    const [triggerUpdate] = useUpdateProductPricesMutation();
    const { data: productData, isLoading } = useGetProductDetailsQuery(product.productId, {
        refetchOnMountOrArgChange: true
    });
    const [images, setImages] = useState<ImageInterface[]>([]);

    useEffect(() => {
        setImages(productData?.image || []);
    }, [productData]);

    useEffect(() => {
        if (triggerAction) {
            const updatePrices = async () => {
                for (const image of images) {
                    await triggerUpdate({
                        productId: product.productId,
                        color: image.color,
                        price: {
                            price: image.price,
                            discount: image.discountPrice
                        }
                    });
                }

                resetTrigger();
                handleClose();
                toast.success('Produsul finalizat cu succes!');
            };

            updatePrices().catch(console.error);
        }
    }, [triggerAction, images, triggerUpdate, resetTrigger, handleClose]);

    const handleChange = (index: number, key: keyof ImageInterface, value: string) => {
        const numericValue = Number(value) || null; // Convert string to number or null if empty
        setImages(currentImages =>
            currentImages.map((item, idx) => idx === index ? { ...item, [key]: numericValue } : item)
        );
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className={cls.pricesInfoWrapper}>
            {images.map((item, index) => (
                <div key={item.color} className={cls.dataWrapper}>
                    <div className={cls.color} style={{ background: item.color }} />
                    <Input
                        placeholder="Pretul"
                        value={item.price ? item.price.toString() : ''}
                        handleChange={(value) => handleChange(index, 'price', value)}
                    />
                    <Input
                        placeholder="Pretul la reducere"
                        value={item.discountPrice ? item.discountPrice.toString() : ''}
                        handleChange={(value) => handleChange(index, 'discountPrice', value)}
                    />
                </div>
            ))}
        </div>
    );
};

export default PricesInfo;
