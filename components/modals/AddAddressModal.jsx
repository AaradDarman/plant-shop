import React, { useContext, useEffect, useState, useRef } from "react";

import {
  Button,
  TextField,
  Typography,
  Box,
  Modal,
  Fade,
  Backdrop,
  IconButton,
  Autocomplete,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import dynamic from "next/dynamic";
import { styled as MuiStyled, useTheme } from "@mui/material/styles";
import styled from "styled-components";
import { rgba } from "polished";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { Formik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faXmark } from "@fortawesome/free-solid-svg-icons";

import Icon from "components/shared/Icon";
import { mapContext } from "context/map-context";
import { toEnglishDigits } from "utils/number-helper";
import { PulseLoader } from "react-spinners";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%) !important",
  bgcolor: "background.default",
  border: "none",
  boxShadow: 0,
};

const StyledMapWraper = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  flex-direction: column;
  padding: 10px 0;
`;

const StyledInputWraper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.palette.primary.main};
  background-color: ${({ theme }) => theme.palette.secondary.main};
  padding: 10px 0;
  padding-right: 4px;
`;

const StyledInput = styled.input`
  all: unset;
  padding: 2px 4px;
  color: ${({ theme }) => theme.palette.text.primary};
  ::placeholder {
    font-size: 14px;
  }
`;

const StyledFormWraper = styled.div`
  width: 100%;
  flex: 1;
  overflow-y: auto;
`;

const StyledSearchResult = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.palette.secondary.main};
  padding: 5px;
  max-height: 50%;
  overflow-y: auto;
  .result-item {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid
      ${({ theme }) => rgba(theme.palette.text.primary, 0.23)};
    padding: 5px;
    cursor: default;
  }
`;

const AddAddressModal = ({ isOpen, onClose, modalState = "map" }) => {
  const [state, setState] = useState(modalState);
  const [receiverIsMe, setReceiverIsMe] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    handleChangeSearch,
    handleAddNewAddress,
    searchResults,
    handleChangeView,
    findAddress,
    postalAddress,
    addressState,
    setAddressState,
    city,
    setCity,
    states,
    cities,
    receiverFName,
    receiverLName,
    receiverPhone,
    postalCode,
    plaque,
    mapCenter,
    mapStatesCleanUp,
    addressFetching,
  } = useContext(mapContext);

  const { user } = useSelector((state) => state);
  const theme = useTheme();

  const MyMap = React.useMemo(
    () =>
      dynamic(() => import("components/Map"), {
        ssr: false,
      }),
    []
  );

  const handleCloseModal = () => {
    mapStatesCleanUp();
    formikRef.current.setFieldValue("receiverFName", "");
    formikRef.current.setFieldValue("receiverLName", "");
    formikRef.current.setFieldValue("receiverPhone", "");
    formikRef.current.setFieldValue("postalCode", "");
    formikRef.current.setFieldValue("postalAddress", "");
    formikRef.current.setFieldValue("plaque", "");
    formikRef.current.setFieldValue("addressState", "");
    formikRef.current.setFieldValue("city", "");
    onClose();
    setState("map");
  };

  const handleCheckChange = (e) => {
    setReceiverIsMe(e.target.checked);
    if (e.target.checked) {
      formikRef.current.setFieldValue("receiverFName", user.user.fName);
      formikRef.current.setFieldValue("receiverLName", user.user.lName);
      formikRef.current.setFieldValue("receiverPhone", user.user.phoneNumber);
    } else {
      formikRef.current.setFieldValue("receiverFName", "");
      formikRef.current.setFieldValue("receiverLName", "");
      formikRef.current.setFieldValue("receiverPhone", "");
    }
    if (formikRef.current) {
      formikRef.current.setTouched({});
    }
  };

  useEffect(() => {
    if (state === "form") {
      findAddress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const NewAddressSchema = Yup.object().shape({
    postalAddress: Yup.string()
      .min(3, "آدرس وارد شده باید بیشتر از 3 حرف باشد")
      .max(90, "آدرس وارد شده نباید بیشتر از 90 حرف باشد")
      .required("پر کردن این فیلد الزامی می باشد"),
    addressState: Yup.object().test(
      "objectSize",
      "پر کردن این فیلد الزامی می باشد",
      (value) => {
        return !isEmpty(value);
      }
    ),
    city: Yup.object().test(
      "objectSize",
      "پر کردن این فیلد الزامی می باشد",
      (value) => {
        return !isEmpty(value);
      }
    ),
    plaque: Yup.string().required("پر کردن این فیلد الزامی می باشد"),
    postalCode: Yup.number()
      .required("پر کردن این فیلد الزامی می باشد")
      .typeError("ارقام وارد کنید")
      .test(
        "len",
        "کد پستی باید 10 رقم باشد",
        (val) => val && val.toString().length === 10
      ),
    receiverFName: Yup.string()
      .required("پر کردن این فیلد الزامی می باشد")
      .min(2, "نام وارد شده باید بیشتر از 2 حرف باشد")
      .max(90, "نام وارد شده نباید بیشتر از 90 حرف باشد"),
    receiverLName: Yup.string()
      .required("پر کردن این فیلد الزامی می باشد")
      .min(2, "نام خانوادگی وارد شده باید بیشتر از 2 حرف باشد")
      .max(90, "نام خانوادگی وارد شده نباید بیشتر از 90 حرف باشد"),
    receiverPhone: Yup.string()
      .required("پر کردن این فیلد الزامی می باشد")
      .matches(/^\d+$/, "فرمت شماره همراه صحیح نمی باشد")
      .test(
        "len",
        "شماره همراه باید 11 رقم باشد",
        (val) => val && val.toString().length === 11
      )
      .test(
        "with zero",
        "شماره همراه باید با صفر شروع شود",
        (val) => val && val.toString().startsWith("0")
      ),
  });

  const formikRef = useRef(null);

  useEffect(() => {
    formikRef.current.setFieldValue("postalAddress", postalAddress);
  }, [postalAddress]);

  useEffect(() => {
    formikRef.current.setFieldValue(
      "addressState",
      addressState === null ? {} : addressState
    );
  }, [addressState]);

  useEffect(() => {
    formikRef.current.setFieldValue("city", city === null ? {} : city);
  }, [city]);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        postalAddress,
        addressState,
        city,
        plaque,
        postalCode,
        receiverFName,
        receiverLName,
        receiverPhone,
      }}
      enableReinitialize={true}
      validationSchema={NewAddressSchema}
      onSubmit={handleAddNewAddress}
    >
      {({
        values,
        handleBlur,
        errors,
        touched,
        setFieldValue,
        handleSubmit,
      }) => (
        <Modal
          disable
          aria-labelledby="edit-product-modal-title"
          aria-describedby="edit-product-modal-description"
          open={isOpen}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={isOpen}>
            <Box
              sx={modalStyle}
              className="flex h-[560px] max-h-[100%] w-[100%] flex-col rounded-md bg-white p-5 px-1 dark:bg-primary-900 md:px-5 lg:w-[780px]"
            >
              {/* {user?.status === "loading" && <LoadingSpinner show={true} />} */}
              {state === "form" && (
                <div className="w-100 iteml-center flex justify-between">
                  <div className="iteml-center flex">
                    <IconButton
                      className="self-start"
                      onClick={() => setState("map")}
                    >
                      <Icon icon="arrow-right" size={24} />
                    </IconButton>
                    <Typography variant="h6" component="strong">
                      جزییات آدرس
                    </Typography>
                  </div>
                  <IconButton
                    className="self-start !text-[19px]"
                    onClick={handleCloseModal}
                  >
                    <FontAwesomeIcon icon={faXmark} width={19} />
                  </IconButton>
                </div>
              )}
              {state === "map" ? (
                <StyledMapWraper className="w-100">
                  <div className="iteml-center flex justify-between">
                    <div className="flex flex-col">
                      <Typography variant="h6" component="strong">
                        آدرس جدید
                      </Typography>
                      <Typography variant="body1">
                        موقعیت مکانی آدرس را مشخص کنید.
                      </Typography>
                    </div>
                    <IconButton
                      className="self-start !text-[19px]"
                      onClick={handleCloseModal}
                    >
                      <FontAwesomeIcon icon={faXmark} width={19} />
                    </IconButton>
                  </div>
                  <MyMap onInputClick={() => setState("search")} />
                </StyledMapWraper>
              ) : state === "form" ? (
                <StyledFormWraper>
                  <TextField
                    label="نشانی پستی"
                    variant="outlined"
                    multiline
                    required
                    margin="dense"
                    size="small"
                    value={values.postalAddress}
                    InputProps={
                      addressFetching && {
                        inputComponent: () => (
                          <PulseLoader
                            size={6}
                            color={theme.palette.accent.main}
                            loading={true}
                            className="flex h-[23px] items-center"
                          />
                        ),
                      }
                    }
                    onChange={(e) => {
                      // setPostalAddress(e.target.value);
                      setFieldValue("postalAddress", e.target.value);
                    }}
                    fullWidth
                    onBlur={handleBlur("postalAddress")}
                    error={errors.postalAddress && touched.postalAddress}
                    helperText={
                      errors.postalAddress && touched.postalAddress
                        ? errors.postalAddress
                        : ""
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
                  <Typography variant="body1" className="text-muted">
                    آدرس بالا بر اساس موقعیت انتخابی شما وارد شده است.
                  </Typography>
                  {/* <button
                    className="edit-map-btn"
                    onClick={() => setState("map")}
                  > */}
                  <Button
                    variant="text"
                    className=" !my-2 !text-white hover:!text-accent-800"
                    size="small"
                    onClick={() => setState("map")}
                  >
                    اصلاح موقعیت مکانی بر روی نقشه
                    <FontAwesomeIcon icon={faChevronLeft} width={19} />
                  </Button>
                  {/* </button> */}
                  <div className="flex">
                    <Autocomplete
                      size="small"
                      disablePortal
                      options={states}
                      sx={{
                        width: 300,
                        marginRight: "5px",
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
                      value={values.addressState}
                      onChange={(event, newValue) => {
                        setAddressState(newValue === null ? "" : newValue);
                        setFieldValue(
                          "addressState",
                          newValue === null ? "" : newValue
                        );
                        setCity("");
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="استان"
                          required
                          onBlur={handleBlur("addressState")}
                          error={errors.addressState && touched.addressState}
                          helperText={
                            errors.addressState && touched.addressState
                              ? errors.addressState
                              : ""
                          }
                          InputProps={
                            addressFetching && {
                              inputComponent: () => (
                                <PulseLoader
                                  size={6}
                                  color={theme.palette.accent.main}
                                  loading={true}
                                  className="flex h-[23px] items-center"
                                />
                              ),
                            }
                          }
                        />
                      )}
                    />
                    <Autocomplete
                      size="small"
                      disablePortal
                      options={cities}
                      sx={{
                        width: 300,
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
                      value={values.city}
                      onChange={(event, newValue) => {
                        // setCity(newValue);
                        setFieldValue(
                          "city",
                          newValue === null ? "" : newValue
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="شهر"
                          required
                          onBlur={handleBlur("city")}
                          error={errors.city && touched.city}
                          helperText={
                            errors.city && touched.city ? errors.city : ""
                          }
                          InputProps={
                            addressFetching && {
                              inputComponent: () => (
                                <PulseLoader
                                  size={6}
                                  color={theme.palette.accent.main}
                                  loading={true}
                                  className="flex h-[23px] items-center"
                                />
                              ),
                            }
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="flex">
                    <TextField
                      label="پلاک"
                      variant="outlined"
                      required
                      margin="dense"
                      size="small"
                      inputProps={{
                        inputMode: "numeric",
                        className: "bg-transparent",
                      }}
                      sx={{
                        marginRight: "5px",
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
                      value={values.plaque}
                      onChange={(e) => {
                        // setPlaque(e.target.value);
                        setFieldValue("plaque", e.target.value);
                      }}
                      onBlur={handleBlur("plaque")}
                      error={errors.plaque && touched.plaque}
                      helperText={
                        errors.plaque && touched.plaque ? errors.plaque : ""
                      }
                    />
                    <TextField
                      label="کد پستی"
                      variant="outlined"
                      required
                      margin="dense"
                      size="small"
                      inputProps={{
                        inputMode: "numeric",
                        className: "bg-transparent",
                      }}
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
                      value={values.postalCode}
                      onChange={(e) => {
                        // setPostalCode(e.target.value);
                        setFieldValue("postalCode", e.target.value);
                      }}
                      onBlur={handleBlur("postalCode")}
                      error={errors.postalCode && touched.postalCode}
                      helperText={`
                      ${
                        errors.postalCode && touched.postalCode
                          ? errors.postalCode
                          : "کد‌پستی باید ۱۰ رقم و بدون خط تیره باشد."
                      }`}
                    />
                  </div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          receiverIsMe ||
                          (user.user.fName === values.receiverFName &&
                            user.user.lName === values.receiverLName)
                        }
                        onChange={handleCheckChange}
                      />
                    }
                    label="گیرنده سفارش خودم هستم."
                    sx={{
                      "&": {
                        marginLeft: 0,
                      },
                      "& .MuiButtonBase-root.Mui-checked": {
                        color:
                          theme.palette.mode === "dark"
                            ? "accent.main"
                            : "accent.600",
                      },
                    }}
                  />
                  <div className="flex">
                    <TextField
                      label="نام گیرنده"
                      variant="outlined"
                      required
                      margin="dense"
                      size="small"
                      disabled={
                        receiverIsMe ||
                        (user.user.fName === values.receiverFName &&
                          user.user.lName === values.receiverLName)
                      }
                      value={values.receiverFName}
                      inputProps={{
                        inputMode: "text",
                        className: "bg-transparent",
                      }}
                      sx={{
                        marginRight: "5px",
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
                      onChange={(e) => {
                        // setReceiverFName(e.target.value);
                        setFieldValue("receiverFName", e.target.value);
                      }}
                      onBlur={handleBlur("receiverFName")}
                      error={errors.receiverFName && touched.receiverFName}
                      helperText={
                        errors.receiverFName && touched.receiverFName
                          ? errors.receiverFName
                          : ""
                      }
                    />
                    <TextField
                      label="نام خانوادگی گیرنده"
                      variant="outlined"
                      margin="dense"
                      size="small"
                      disabled={
                        receiverIsMe ||
                        (user.user.fName === values.receiverFName &&
                          user.user.lName === values.receiverLName)
                      }
                      required
                      inputProps={{
                        inputMode: "text",
                        className: "bg-transparent",
                      }}
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
                      value={values.receiverLName}
                      onChange={(e) => {
                        // setReceiverLName(e.target.value);
                        setFieldValue("receiverLName", e.target.value);
                      }}
                      onBlur={handleBlur("receiverLName")}
                      error={errors.receiverLName && touched.receiverLName}
                      helperText={
                        errors.receiverLName && touched.receiverLName
                          ? errors.receiverLName
                          : ""
                      }
                    />
                  </div>
                  <TextField
                    label="شماره موبایل گیرنده"
                    variant="outlined"
                    margin="dense"
                    size="small"
                    disabled={
                      receiverIsMe ||
                      (user.user.fName === values.receiverFName &&
                        user.user.lName === values.receiverLName)
                    }
                    required
                    inputProps={{
                      inputMode: "text",
                      className: "bg-transparent",
                    }}
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
                    value={values.receiverPhone}
                    onChange={(e) => {
                      // setReceiverPhone(e.target.value);
                      setFieldValue(
                        "receiverPhone",
                        toEnglishDigits(e.target.value)
                      );
                    }}
                    onBlur={handleBlur("receiverPhone")}
                    error={errors.receiverPhone && touched.receiverPhone}
                    helperText={
                      errors.receiverPhone && touched.receiverPhone
                        ? errors.receiverPhone
                        : ""
                    }
                  />
                </StyledFormWraper>
              ) : (
                <div className="w-100">
                  <StyledInputWraper>
                    <Icon
                      icon="arrow-right"
                      size={24}
                      onClick={() => {
                        setState("map");
                        setSearchTerm("");
                      }}
                    />
                    <StyledInput
                      type="text"
                      onChange={handleChangeSearch}
                      value={searchTerm}
                      placeholder="جستجوی آدرس"
                      autoFocus
                    />
                  </StyledInputWraper>
                  {searchResults.length > 0 && (
                    <StyledSearchResult>
                      {searchResults.map((item) => (
                        <div
                          key={JSON.stringify(item.location)}
                          className="result-item"
                          onClick={() => {
                            handleChangeView(item);
                            setState("map");
                          }}
                        >
                          <span className="flex">{item.title}</span>
                          <span className="flex">{item.address}</span>
                        </div>
                      ))}
                    </StyledSearchResult>
                  )}
                </div>
              )}
              <div className="w-100 iteml-center flex justify-between px-2 lg:px-0">
                {state === "map" ? (
                  <>
                    <Typography variant="body1">
                      مرسوله‌های شما به این موقعیت ارسال خواهد شد.
                    </Typography>
                    <Button
                      variant="contained"
                      className="flex-shrink-0 !bg-accent-700 !text-white hover:!bg-accent-800"
                      size="small"
                      onClick={() => {
                        setState("form");
                      }}
                    >
                      تایید و ادامه
                      <FontAwesomeIcon icon={faChevronLeft} width={19} />
                    </Button>
                  </>
                ) : state === "form" ? (
                  <Button
                    variant="contained"
                    className="me-0 lg:me-auto mt-auto !bg-accent-700 !text-white hover:!bg-accent-800"
                    onClick={handleSubmit}
                  >
                    ثبت آدرس
                  </Button>
                ) : (
                  <></>
                )}
              </div>
            </Box>
          </Fade>
        </Modal>
      )}
    </Formik>
  );
};

export default AddAddressModal;
