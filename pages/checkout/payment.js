import React from "react";

import Cookies from "cookies";
import styled from "styled-components";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
} from "@mui/material";

import MainLayout from "components/layouts/MainLayout";
import CheckoutLayout from "components/layouts/CheckoutLayout";

const StyledWraper = styled.div`
  display: flex;
  direction: "rtl";
  flex-direction: column;
  flex: 1;
  padding: 1rem;
`;

const Payment = () => {
  const theme = useTheme();
  return (
    <StyledWraper className="ml-0 rounded-[4px] border-[1px] border-secondary-dark-800 md:ml-2">
      <Typography variant="h6">انتخاب روش پرداخت</Typography>
      <FormControl>
        <RadioGroup
          className="mt-3"
          aria-labelledby="payment-radio-buttons-group"
          defaultValue="online"
          name="radio-buttons-group"
          sx={{
            "& .MuiButtonBase-root.Mui-checked": {
              color:
                theme.palette.mode === "dark" ? "accent.main" : "accent.600",
            },
          }}
        >
          <FormControlLabel
            value="online"
            control={<Radio />}
            label="پرداخت اینترنتی"
          />
          <FormControlLabel
            disabled
            value="pay-in-place"
            control={<Radio />}
            label="پرداخت در محل(با کارت بانکی)"
          />
        </RadioGroup>
      </FormControl>
    </StyledWraper>
  );
};

export async function getServerSideProps(ctx) {
  const cookies = new Cookies(ctx.req, ctx.res);
  const authorization = cookies.get("authorization");
  if (!authorization) {
    return {
      redirect: {
        destination: `/users/login?returnUrl=${ctx.resolvedUrl}&forceLogout=true`,
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

Payment.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      <CheckoutLayout>{page}</CheckoutLayout>
    </MainLayout>
  );
};

export default Payment;
