import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDeleteOrderMutation, useGetOrdersQuery } from "entities/OrdersData";
import { LoadingSpinner } from "shared/ui";
import cls from "./ManagementOrders.module.scss";
import { SuccessIcon } from "shared/assets";

const ManagementOrders = () => {
  const navigate = useNavigate();
  const { data: ordersData, isLoading } = useGetOrdersQuery();
  const [completeOrder] = useDeleteOrderMutation();

  const handleComplete = (value: number) => {
    completeOrder(value).then(() => window.location.reload());
  };

  useEffect(() => {
    if (!sessionStorage.getItem("admin")) navigate("/management");
  }, []);

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
      </div>
    </div>
  );
};

export default ManagementOrders;
