import React, { useContext } from "react";

import {
  Typography,
  Box,
  Modal,
  Fade,
  Backdrop,
  IconButton,
  FormControlLabel,
  FormControl,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faXmark } from "@fortawesome/free-solid-svg-icons";

import Icon from "components/shared/Icon";
import { orderContext } from "context/order-context";
import { mapContext } from "context/map-context";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%) !important",
  bgcolor: "background.default",
  border: "none",
  boxShadow: 0,
};

const SelectAddressModal = ({ isOpen, onClose }) => {
  const { openAddAddressModal } = useContext(mapContext);
  const { selectedAddress, setSelectedAddress } = useContext(orderContext);
  const handleChangeSelectedAddress = (e) => {
    setSelectedAddress(JSON.parse(e.target.value));
    onClose();
  };
  const { user } = useSelector((state) => state);
  const theme = useTheme();

  const Label = ({ item }) => {
    return (
      <Box className="flex flex-col items-start py-2">
        <Typography>{item.postalAddress}</Typography>
        <Typography className="py-1">
          <Icon icon="address" size={20} className="ml-[2px]" />
          {item.city}
        </Typography>
        <Typography className="py-1">
          <Icon icon="post" size={22} className="ml-[2px]" />
          {item?.postalCode}
        </Typography>
        <Typography className="py-1">
          <Icon icon="call" size={20} className="ml-[2px]" />
          {item.receiver.phoneNumber}
        </Typography>
        <Typography className="py-1">
          <Icon icon="profile" size={20} className="ml-[2px]" />
          {`${item.receiver.fName} ${item.receiver.lName}`}
        </Typography>
      </Box>
    );
  };

  return (
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
          className="w-[95%] rounded-md bg-white p-5 dark:bg-primary-900 md:w-1/2 lg:w-1/3"
        >
          <div className="w-100 bottom-border flex items-center justify-between py-3">
            <Typography variant="h6" component="strong">
              انتخاب آدرس
            </Typography>
            <IconButton className="self-start !text-[19px]" onClick={onClose}>
              <FontAwesomeIcon icon={faXmark} width={19} />
            </IconButton>
          </div>
          <div
            onClick={openAddAddressModal}
            className="new-address-btn w-100 bottom-border flex cursor-pointer items-center justify-between py-3"
          >
            <div className="flex items-center">
              <Icon icon="location" size={24} />
              <Typography variant="h6" component="strong">
                افزودن آدرس جدید
              </Typography>
            </div>
            <IconButton className="self-start !text-[19px]" onClick={onClose}>
              <FontAwesomeIcon icon={faChevronLeft} width={19} />
            </IconButton>
          </div>
          <FormControl className="form-wraper">
            <RadioGroup
              className="mt-3"
              value={JSON.stringify(selectedAddress)}
              onChange={handleChangeSelectedAddress}
              sx={{
                "& .MuiButtonBase-root.Mui-checked": {
                  color:
                    theme.palette.mode === "dark"
                      ? "accent.main"
                      : "accent.600",
                },
              }}
            >
              {!isEmpty(user?.user) &&
                user?.user?.addresses.map((address) => (
                  <FormControlLabel
                    className="mx-0 flex items-start"
                    key={address._id}
                    value={JSON.stringify(address)}
                    control={<Radio />}
                    label={<Label item={address} />}
                  />
                ))}
            </RadioGroup>
          </FormControl>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SelectAddressModal;
