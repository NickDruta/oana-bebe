import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { SliderItemIcon, SliderLeftIcon, SliderRightIcon } from "shared/assets";
import cls from "./Swiper.module.scss";
import { useNavigate } from "react-router-dom";
import { Slider } from "../../../entities/SliderData/types/sliderTypes";

interface SwiperProps {
  images: Slider[];
}

const Swiper = ({ images }: SwiperProps) => {
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  const handleImageChange = (index: number) => {
    setTranslateX(index * -100);
    setActiveImage(index);
  };

  const handlePrevious = () => {
    if (activeImage - 1 < 0) {
      handleImageChange(images.length - 1);
      setActiveImage(images.length - 1);
    } else {
      handleImageChange(activeImage - 1);
      setActiveImage(activeImage - 1);
    }
  };

  const handleNext = () => {
    if (activeImage + 1 === images.length) {
      handleImageChange(0);
      setActiveImage(0);
    } else {
      handleImageChange(activeImage + 1);
      setActiveImage(activeImage + 1);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleNext();
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [activeImage]);

  return (
    <div className={cls.swiperWrapper}>
      <div
        className={cls.swiperImagesWrapper}
        style={{ transform: `translateX(${translateX}%)` }}
      >
        {images.map((item, index) => (
          <img
            key={index}
            src={item.sourceUrl}
            alt=""
            className={clsx(cls.img, index === activeImage && cls.activeImg)}
            onClick={() => (item.linkUrl ? navigate(item.linkUrl) : {})}
          />
        ))}
      </div>
      <div className={clsx(cls.swiperArrow, cls.left)} onClick={handlePrevious}>
        <SliderLeftIcon />
      </div>
      <div className={clsx(cls.swiperArrow, cls.right)} onClick={handleNext}>
        <SliderRightIcon />
      </div>
      <div className={cls.swiperItemsWrapper}>
        {images.map((item, index) => (
          <SliderItemIcon
            key={index}
            className={clsx(cls.item, index === activeImage && cls.activeItem)}
            onClick={() => handleImageChange(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Swiper;
