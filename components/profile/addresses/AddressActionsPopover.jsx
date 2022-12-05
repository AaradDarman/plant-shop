import React, { useState } from "react";

import { IconButton, Popover, Typography, useTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";

import Icon from "components/shared/Icon";

const AddressActionsPopover = ({ address, onDeleteClick, onEditClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();

  return (
    <>
      <IconButton
        id={`btn-${address._id}`}
        onClick={(e) => {
          setIsOpen(true);
          setAnchorEl(e.currentTarget);
        }}
        className="!text-[19px]"
      >
        <FontAwesomeIcon icon={faEllipsisVertical} width={19} />
      </IconButton>
      <Popover
        id={`popover-${address._id}`}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={() => setIsOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography
          onClick={() => {
            onDeleteClick();
            setIsOpen(false);
          }}
          variant="subtitle2"
          sx={{
            p: 1,
            cursor: "pointer",
          }}
          className="bg-white hover:bg-black/[.1] dark:bg-primary-800 dark:hover:bg-primary-900"
        >
          <Icon icon="delete" size={19} />
          حذف
        </Typography>
        <Typography
          onClick={() => {
            onEditClick();
            setIsOpen(false);
          }}
          variant="subtitle2"
          sx={{
            p: 1,
            cursor: "pointer",
          }}
          className="bg-white hover:bg-black/[.1] dark:bg-primary-800 dark:hover:bg-primary-900"
        >
          <FontAwesomeIcon icon={faPencil} width={19} />
          ویرایش
        </Typography>
      </Popover>
    </>
  );
};

export default AddressActionsPopover;
