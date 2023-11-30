import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import cls from "./LoginForm.module.scss";

interface LoginFormProps {
  goToMainPage: () => void;
}

type Inputs = {
  username: string;
  password: string;
};

const LoginForm = ({ goToMainPage }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const formdata = new FormData();

    formdata.append("username", data.username);
    formdata.append("password", data.password);

    fetch(`${process.env.REACT_APP_API_URL}login`, {
      method: "POST",
      body: formdata,
    }).then((response) => {
      if (response.url.includes("handler/success")) {
        sessionStorage.setItem(
          "admin",
          `Basic ${window.btoa(`${data.username}:${data.password}`)}`
        );
        window.location.reload();
      } else {
        setError("password", {
          type: "custom",
          message: "Datele sunt gresite",
        });
      }
    });
  };

  return (
    <div className={cls.loginFormWrapper}>
      <p className={cls.title}>
        Bună! Introdu datele pentru
        <br /> a verifica identitatea
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className={cls.formWrapper}>
        <input
          {...register("username", { required: true })}
          placeholder="Nume"
          className={cls.input}
        />
        <input
          {...register("password", { required: true })}
          type="password"
          placeholder="Parola"
          className={cls.input}
        />

        {(errors.username || errors.password) && (
          <div className={cls.errorWrapper}>
            {errors.username && (
              <span className={cls.error}>Numele e obligatoriu</span>
            )}
            {errors.password && (
              <span className={cls.error}>
                {errors.password.message || "Parola este obligatorie"}
              </span>
            )}
          </div>
        )}

        <input type="submit" className={cls.button} />
        <p className={cls.backText} onClick={goToMainPage}>
          Înapoi la pagina principală
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
