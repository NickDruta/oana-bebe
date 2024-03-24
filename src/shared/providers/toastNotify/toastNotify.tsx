import React from 'react';
import { toast } from 'react-toastify';

export const Toast = (props: { textContent: string }) =>
    <span>{props.textContent}</span>;

const toastList = new Set();
const MAX_TOAST = 1;

export const toastNotify = (textContent: string, toastId?: string) => {
    if (toastList.size < MAX_TOAST){
        const id: any = toast(
            <Toast textContent={textContent} />,
        {
            toastId: toastId ? toastId : undefined,
                theme: 'dark',
            position: 'top-right',
            className: 'toast-notify',
            hideProgressBar: false,
            autoClose: 4000,
            progressStyle: {
            background: '#ffffff30',
        },
            onClose: () => toastList.delete(id)
        },
    );
        toastList.add(id);
    }
};