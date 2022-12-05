import React from "react";

import { styled as MuiStyled } from "@mui/material/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";

const StyledDialog = MuiStyled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: theme.palette.secondary.main,
    backgroundImage: "none",
  },
  "& .MuiTypography-root": {
    color: theme.palette.text.primary,
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
    justifyContent: "flex-start",
  },
  ".product-name": {
    color: theme.palette.error.main,
  },
}));

const PaymentStatusDialog = ({
  isOpen,
  onClose,
  status,
  orderNumber,
  trackingNumber,
}) => {
  return (
    <StyledDialog onClose={onClose} open={isOpen}>
      <DialogContent>
        <h4 className="success-message text-center">{status}</h4>
        <h5 className="order-number">{`شماره سفارش: ${orderNumber}`}</h5>
        <h5 className="tracking-number">
          {trackingNumber && `شماره پیگیری: ${trackingNumber}`}
        </h5>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={onClose}
        >
          بستن
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default PaymentStatusDialog;
