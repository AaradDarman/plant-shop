import React, { useState, useEffect, useContext } from "react";

import {
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  useTheme,
  Box,
  Modal,
  Fade,
  Backdrop,
  Stack,
  IconButton,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%) !important",
  bgcolor: "background.default",
  border: "none",
  boxShadow: 0,
};

const EditPhoneNumberModal = ({ isOpen, onClose, onSave }) => {
  const { user } = useSelector((state) => state.user);
  const theme = useTheme();

  const ChangePhoneNumberSchema = Yup.object().shape({
    phoneNumber: Yup.string()
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

  return (
    <Modal
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
        <Box sx={modalStyle} className="w-[95%] rounded-md md:w-1/2 lg:w-1/3">
          <div
            className="flex flex-col rounded-md bg-white p-5 dark:bg-primary-900"
          >
            <div className="flex w-full items-center justify-between pb-3 mb-3 border-b-[1px] border-solid border-b-secondary-dark-200 dark:border-b-secondary-dark-800">
              <div className="flex flex-col">
                <Typography variant="h6" component="strong">
                  تغییر شماره موبایل
                </Typography>
              </div>
              <IconButton className="self-start !text-[19px]" onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} width={19} />
              </IconButton>
            </div>
            <Formik
              initialValues={{
                phoneNumber: user.phoneNumber,
              }}
              enableReinitialize={false}
              validationSchema={ChangePhoneNumberSchema}
              onSubmit={onSave}
            >
              {({
                values,
                handleBlur,
                errors,
                touched,
                setFieldValue,
                handleSubmit,
              }) => (
                <>
                  <TextField
                    autoFocus
                    variant="outlined"
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
                    className="self-center"
                    label=""
                    size="small"
                    value={values.phoneNumber}
                    fullWidth
                    onChange={(e) => {
                      setFieldValue("phoneNumber", e.target.value);
                    }}
                    onBlur={handleBlur("phoneNumber")}
                    error={errors.phoneNumber && touched.phoneNumber}
                    FormHelperTextProps={{ style: { marginBottom: "4px" } }}
                    helperText={
                      errors.phoneNumber && touched.phoneNumber
                        ? errors.phoneNumber
                        : " "
                    }
                  />
                  <Stack
                    spacing={1}
                    direction="row"
                    className="action-buttons mt-3"
                  >
                    <Button
                      variant="text"
                      size="small"
                      onClick={onClose}
                      color="grey"
                    >
                      لغو
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      variant="contained"
                      className="!bg-accent-700 !text-white hover:!bg-accent-800"
                      size="small"
                    >
                      ذخیره
                    </Button>
                  </Stack>
                </>
              )}
            </Formik>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EditPhoneNumberModal;
