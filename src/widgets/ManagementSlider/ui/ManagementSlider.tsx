import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { LoadingSpinner } from "shared/ui";
import cls from "./ManagementSlider.module.scss";
import { AddIcon, DeleteIcon } from "../../../shared/assets";
import { toast } from "react-toastify";
import {
  useCreateSliderMutation,
  useDeleteSliderMutation,
  useGetSliderDataQuery,
  useUpdateSliderMutation,
} from "../../../entities/SliderData";
import { Slider } from "../../../entities/SliderData/types/sliderTypes";
import { SliderModal } from "../../../features/SliderModal";

const ManagementSlider = () => {
  const navigate = useNavigate();
  const { data: sliders, isLoading, isFetching } = useGetSliderDataQuery();
  const [createSlider] = useCreateSliderMutation();
  const [updateSlider] = useUpdateSliderMutation();
  const [deleteSlider] = useDeleteSliderMutation();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [slider, setSlider] = useState<Partial<Slider>>({});
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (newSlider: Partial<Slider>) => {
    setSlider((prevSlider) => {
      return { ...prevSlider, ...newSlider };
    });
  };

  const handleCreate = () => {
    const formData = new FormData();

    if (file) {
      formData.append("images", file);
    }
    if (slider.linkUrl) {
      formData.append("linkUrl", slider.linkUrl);
    }

    createSlider(formData).then(() => {
      toast.success("Imaginea a fost adăugată cu success!");
      setIsAddOpen(false);
      setSlider({});
    });
  };

  const handleDelete = (sliderId: string, sourceUrl: string) => {
    if (window.confirm("Sigur vrei sa ștergi imaginea?")) {
      deleteSlider({ sliderId, sourceUrl }).then(() => {
        toast.success("Imaginea a fost ștearsă cu success!");
      });
    }
  };

  const onDragEnd = (result: any) => {
    const { destination, source } = result;

    if (!destination || destination.index === source.index) {
      return;
    }

    const item = sliders.data[source.index];

    updateSlider({
      sliderId: item.sliderId,
      newOrder: destination.index + 1,
    }).then(() => {
      toast.success("Poziția a fost modificată cu success!");
    });
  };

  useEffect(() => {
    if (!sessionStorage.getItem("jwt")) navigate("/management");
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={cls.managementSliderWrapper}>
        <div className={cls.contentWrapper}>
          <div className={cls.headerWrapper}>
            <p className={cls.title}>Slider</p>
          </div>
          {isLoading || isFetching ? (
            <LoadingSpinner />
          ) : (
            <Droppable droppableId="droppableSlider">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cls.sliderWrapper}
                >
                  {sliders &&
                    sliders.data &&
                    sliders.data.map((item: Slider, index: number) => (
                      <Draggable
                        key={item.sliderId}
                        draggableId={item.sliderId}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cls.item}
                          >
                            <img
                              className={cls.image}
                              src={item.sourceUrl}
                              alt=""
                            />
                            <div className={cls.actionsWrapper}>
                              <DeleteIcon
                                width={18}
                                height={18}
                                stroke={"#000"}
                                cursor={"pointer"}
                                onClick={() =>
                                  handleDelete(item.sliderId, item.sourceUrl)
                                }
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                  <div
                    className={cls.addWrapper}
                    style={{ cursor: "default" }}
                    onClick={() => setIsAddOpen(true)}
                  >
                    <AddIcon width={18} height={18} stroke="#ffbbeb" />
                  </div>
                </div>
              )}
            </Droppable>
          )}
        </div>
        {isAddOpen ? (
          <SliderModal
            slider={slider}
            handleFileChange={(value) => setFile(value)}
            handleChange={handleChange}
            handleSave={handleCreate}
            handleClose={() => setIsAddOpen(false)}
          />
        ) : (
          <></>
        )}
      </div>
    </DragDropContext>
  );
};

export default ManagementSlider;
