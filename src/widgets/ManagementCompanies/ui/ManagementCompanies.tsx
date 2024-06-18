import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  useGetCompaniesQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  Company,
} from "entities/CompaniesData";
import { LoadingSpinner } from "shared/ui";
import cls from "./ManagementCompanies.module.scss";
import {
  AddIcon,
  DeleteIcon,
  DragIcon,
  EditIcon,
} from "../../../shared/assets";
import { toast } from "react-toastify";

const ManagementCompanies = () => {
  const navigate = useNavigate();
  const { data: companies, isLoading, isFetching } = useGetCompaniesQuery();
  const [createCompany] = useCreateCompanyMutation();
  const [updateCompany] = useUpdateCompanyMutation();
  const [deleteCompany] = useDeleteCompanyMutation();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editedCompany, setEditedCompany] = useState<Company | null>(null);
  const [companyName, setCompanyName] = useState("");

  const handleCreate = () => {
    createCompany(companyName).then(() => {
      toast.success("Compania a fost adăugată cu success!");
      setIsAddOpen(false);
      setCompanyName("");
    });
  };

  const handleUpdate = () => {
    updateCompany(editedCompany).then(() => {
      toast.success("Compania a fost modificată cu success!");
      setEditedCompany(null);
    });
  };

  const handleDelete = (companyId: string) => {
    if (window.confirm("Sigur vrei sa ștergi compania?")) {
      deleteCompany(companyId).then(() => {
        toast.success("Compania a fost ștearsă cu success!");
      });
    }
  };

  const onDragEnd = (result: any) => {
    const { destination, source } = result;

    if (!destination || destination.index === source.index) {
      return;
    }

    const item = companies.data[source.index];

    updateCompany({
      companyId: item.companyId,
      companyName: item.companyName,
      order: destination.index + 1,
    }).then(() => {
      toast.success("Poziția a fost modificată cu success!");
    });
  };

  useEffect(() => {
    if (!sessionStorage.getItem("jwt")) navigate("/management");
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={cls.managementCompaniesWrapper}>
        <div className={cls.contentWrapper}>
          <div className={cls.headerWrapper}>
            <p className={cls.title}>Companii</p>
          </div>
          {isLoading || isFetching ? (
            <LoadingSpinner />
          ) : (
            <Droppable droppableId="droppableCompanies">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cls.companiesWrapper}
                >
                  {companies &&
                    companies.data &&
                    companies.data.map((item: Company, index: number) => (
                      <Draggable
                        key={item.companyName}
                        draggableId={item.companyName}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cls.item}
                          >
                            <div className={cls.actionsWrapper}>
                              <DragIcon
                                stroke={"#000"}
                                width={24}
                                height={24}
                              />
                            </div>
                            {editedCompany &&
                            editedCompany.companyId === item.companyId ? (
                              <>
                                <input
                                  value={editedCompany.companyName}
                                  onChange={(e) =>
                                    setEditedCompany({
                                      ...editedCompany,
                                      companyName: e.target.value,
                                    })
                                  }
                                />
                                <button onClick={handleUpdate}>Salveaza</button>
                              </>
                            ) : (
                              <p className={cls.title}>{item.companyName}</p>
                            )}
                            <div className={cls.actionsWrapper}>
                              <EditIcon
                                width={18}
                                height={18}
                                fill={"#000"}
                                cursor={"pointer"}
                                onClick={() =>
                                  setEditedCompany(
                                    !editedCompany ||
                                      (editedCompany &&
                                        editedCompany.companyId !==
                                          item.companyId)
                                      ? item
                                      : null,
                                  )
                                }
                              />
                              <DeleteIcon
                                width={18}
                                height={18}
                                stroke={"#000"}
                                cursor={"pointer"}
                                onClick={() => handleDelete(item.companyId)}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                  <div
                    className={isAddOpen ? cls.item : cls.addWrapper}
                    style={{ cursor: "default" }}
                    onClick={() => setIsAddOpen(true)}
                  >
                    {isAddOpen ? (
                      <>
                        <input
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                        <button onClick={handleCreate}>Salveaza</button>
                      </>
                    ) : (
                      <AddIcon width={18} height={18} stroke="#ffbbeb" />
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          )}
        </div>
      </div>
    </DragDropContext>
  );
};

export default ManagementCompanies;
