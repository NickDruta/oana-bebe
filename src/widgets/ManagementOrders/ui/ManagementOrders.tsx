import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDeleteOrderMutation, useGetOrdersQuery } from "entities/OrdersData";
import { Button, LoadingSpinner } from "shared/ui";
import cls from "./ManagementOrders.module.scss";
import { SuccessIcon } from "shared/assets";
import { initPaginationData } from "shared/config";

const ManagementOrders = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState(initPaginationData);
  const { data: ordersData, isLoading } = useGetOrdersQuery(pagination);
  const [completeOrder] = useDeleteOrderMutation();

  const handleComplete = (value: number) => {
    completeOrder(value).then(() => window.location.reload());
  };

  useEffect(() => {
    if (!sessionStorage.getItem("admin")) navigate("/management");
  }, []);
  
  useEffect(() => {
    if (ordersData) {
      setPagination({
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
        totalElements: ordersData.totalElements,
        totalPages: ordersData.totalPages,
      });
    }
  }, [ordersData]);
  

  return (
    <div className={cls.managementOrdersWrapper}>
      <div className={cls.contentWrapper}>
        <div className={cls.headerWrapper}>
          <p className={cls.title}>Comenzi</p>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className={cls.ordersWrapper}>
            {ordersData &&
              ordersData.orders &&
              ordersData.orders.map((item: any, index: number) => (
                <div className={cls.item} key={index}>
                  <SuccessIcon
                    className={cls.complete}
                    onClick={() => {
                      handleComplete(item.productDetails.orderId);
                    }}
                  />
                  <p className={cls.title}>{item.phoneNumber}</p>
                  <p className={cls.name}>{item.productDetails.productName}</p>
                  <p className={cls.quantity}>
                    Cantitate: {item.productDetails.quantity}
                  </p>
                  <div
                    className={cls.color}
                    style={{
                      backgroundColor: item.productDetails.colors.slice(1, -1),
                    }}
                  />
                </div>
              ))}
          </div>
        )}
        {pagination.totalPages > 1 ? (
          <div className={cls.paginationWrapper}>
            {Array.from(
              { length: pagination.totalPages },
              (_, index) => index + 1
            ).map((item) => (
              <Button
                key={item}
                type={
                  item === pagination.pageNumber + 1 ? "primary" : "secondary"
                }
                text={String(item)}
                className={cls.paginationItem}
                onClick={() => {
                  setPagination({
                    pageNumber: item - 1,
                    pageSize: pagination.pageSize,
                    totalElements: pagination.totalElements,
                    totalPages: pagination.totalPages,
                  });
                }}
              />
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ManagementOrders;
