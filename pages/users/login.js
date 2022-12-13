import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, TextField, Typography, useTheme } from "@mui/material";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import { login, resetUser, setUser } from "redux/slices/user";
import userApi from "adapters/user-adapter";
import {
  resetLocalCart,
  setLocalCartItems,
  syncCartToDb,
} from "redux/slices/cart";
import MainLayout from "components/layouts/MainLayout";
import AuthContext from "context/AuthContext";
import { loadState } from "utils/browser-storage";

const StyledWraper = styled.div`
  height: calc(100vh - 58px);
`;

const Login = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const theme = useTheme();

  useEffect(() => {
    if (!isEmpty(user?.user) && router.query.forceLogout) {
      dispatch(resetUser());
      dispatch(resetLocalCart());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (event) => {
    const payload = {
      username,
      password,
    };
    let localBasket = loadState();
    dispatch(login(payload))
      .unwrap()
      .then(async (originalPromiseResult) => {
        const { data, status } = await userApi.getUserData();
        dispatch(setUser(data.user));
        if (!isEmpty(localBasket?.items)) {
          dispatch(syncCartToDb(localBasket?.items));
        } else if (data.user.basket.length) {
          if (status === 200) dispatch(setLocalCartItems(data.user.basket));
        }
        if (router.query.returnUrl) {
          router.replace(router.query.returnUrl);
        } else {
          router.replace("/");
        }
      });
  };

  const validateEmail = (email) => {
    return Yup.string().email().isValidSync(email);
  };

  const validatePhone = (phone) => {
    return Yup.string()
      .matches(/^\d+$/, "فرمت شماره همراه صحیح نمی باشد")
      .test("len", (val) => val && val.toString().length === 11)
      .test("with zero", (val) => val && val.toString().startsWith("0"))
      .isValidSync(phone);
  };

  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .required("پر کردن این فیلد الزامی می باشد")
      .test("email_or_phone", "ایمیل / شماره معتبر نمی باشد", (value) => {
        return validateEmail(value) || validatePhone(value ?? "0");
      }),
    password: Yup.string()
      .label("Password")
      .required("پر کردن این فیلد الزامی می باشد"),
  });

  return (
    <Formik
      // innerRef={formikRef}
      initialValues={{
        username,
        password,
      }}
      enableReinitialize={false}
      validationSchema={LoginSchema}
      onSubmit={handleLogin}
    >
      {({
        values,
        handleBlur,
        errors,
        touched,
        setFieldValue,
        handleSubmit,
      }) => (
        <StyledWraper className="grid grid-cols-11 content-center justify-center">
          <Head>
            <title>{`فروشگاه اینترنتی ${process.env.NEXT_PUBLIC_SITE_NAME}`}</title>
          </Head>
          <Form
            className="col-span-12 flex flex-col rounded-md border border-gray-500 p-8 md:col-span-5 md:col-start-4 lg:col-span-3 lg:col-start-5"
            onSubmit={handleSubmit}
          >
            <Typography variant="h5" marginBottom={2} className="text-center">
              ورود
            </Typography>
            <TextField
              variant="outlined"
              label="ایمیل یا شماره موبایل"
              size="small"
              margin="dense"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setFieldValue("username", e.target.value);
              }}
              onBlur={handleBlur("username")}
              error={errors.username && touched.username}
              helperText={
                errors.username && touched.username ? errors.username : " "
              }
              sx={{
                "& label.Mui-focused": {
                  color:
                    theme.palette.mode === "dark"
                      ? "accent.main"
                      : "accent.600",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "accent.main"
                        : "accent.600",
                  },
                },
              }}
              inputProps={{ className: "bg-transparent" }}
            />
            <TextField
              variant="outlined"
              label="رمز عبور"
              size="small"
              margin="dense"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldValue("password", e.target.value);
              }}
              type="password"
              autoComplete="current-password"
              onBlur={handleBlur("password")}
              error={errors.password && touched.password}
              helperText={
                errors.password && touched.password ? errors.password : " "
              }
              sx={{
                "& label.Mui-focused": {
                  color:
                    theme.palette.mode === "dark"
                      ? "accent.main"
                      : "accent.600",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "accent.main"
                        : "accent.600",
                  },
                },
              }}
              inputProps={{ className: "bg-transparent" }}
            />
            <Button
              variant="contained"
              type="submit"
              className="!z-[1] !bg-accent-700 !text-white hover:!bg-accent-800"
              sx={{ letterSpacing: "2px" }}
            >
              ورود
            </Button>
            <Typography variant="body2" className="!mt-3 !mb-2">
              هنوز ثبت نام نکردی؟
              <Link href={"/users/signup"}>
                <a className="changePageBtn  hover:text-accent-700">{` ثبت نام`}</a>
              </Link>
            </Typography>
            <Typography variant="body2">
              رمزتو فراموش کردی؟
              <Link href="/users/password/forget">
                <a className="forgetPassBtn  hover:text-accent-700">{` بازیابی`}</a>
              </Link>
            </Typography>
          </Form>
        </StyledWraper>
      )}
    </Formik>
  );
};

Login.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      <AuthContext>{page}</AuthContext>
    </MainLayout>
  );
};

export default Login;
