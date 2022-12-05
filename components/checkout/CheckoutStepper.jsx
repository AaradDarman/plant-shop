import React, { useEffect, useState } from "react";

import { styled } from "@mui/material/styles";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import Link from "next/link";
import { useRouter } from "next/router";
import { rgba } from "polished";

import Icon from "components/shared/Icon";
import useBreakpoints from "utils/useBreakPoints";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient( 95deg,${theme.palette.accent.main} 0%,${theme.palette.accent[500]} 50%,${theme.palette.accent.main} 100%)`,
      opacity: 0.5,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient( 95deg,${theme.palette.accent.main} 0%,${theme.palette.accent[500]} 50%,${theme.palette.accent.main} 100%)`,
      opacity: 0.5,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.text.disabled,
    borderRadius: 1,
  },
}));

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  [`& .MuiStepLabel-label.Mui-active`]: {
    color:
      theme.palette.mode === "dark"
        ? theme.palette.accent.main
        : theme.palette.accent[800],
    fontSize: "17px",
  },
  [`& .MuiStepLabel-label.Mui-completed `]: {
    color:
      theme.palette.mode === "dark"
        ? rgba(theme.palette.accent.main, 0.5)
        : rgba(theme.palette.accent[800], 0.5),
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  zIndex: 1,
  color: theme.palette.text.disabled,
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    color:
      theme.palette.mode === "dark"
        ? theme.palette.accent.main
        : theme.palette.accent[800],
  }),
  ...(ownerState.completed && {
    color:
      theme.palette.mode === "dark"
        ? rgba(theme.palette.accent.main, 0.5)
        : rgba(theme.palette.accent[800], 0.5),
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <Icon icon="cart" size={24} className="icon" />,
    2: <Icon icon="delivery" size={35} className="icon" />,
    3: <Icon icon="wallet" size={35} className="icon" />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = ["سبد خرید", "زمان و نحوه ارسال", "پرداخت"];
const links = {
  "سبد خرید": "/checkout/cart",
  "زمان و نحوه ارسال": "/checkout/shipping",
  پرداخت: "/checkout/payment",
};
const CheckoutStepper = () => {
  const { isMd } = useBreakpoints();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    switch (router.pathname) {
      case "/checkout/cart":
        setActiveStep(0);
        break;
      case "/checkout/shipping":
        setActiveStep(1);
        break;
      case "/checkout/payment":
        setActiveStep(2);
        break;
    }
  }, [router.pathname]);
  return (
    <Stepper
      className="py-3"
      alternativeLabel={!isMd}
      activeStep={activeStep}
      connector={<ColorlibConnector />}
    >
      {steps.map((label, index) => (
        <Step key={label}>
          {index >= activeStep ? (
            <StyledStepLabel StepIconComponent={ColorlibStepIcon}>
              {label}
            </StyledStepLabel>
          ) : (
            <Link href={links[label]} passHref>
              <a>
                <StyledStepLabel StepIconComponent={ColorlibStepIcon}>
                  {label}
                </StyledStepLabel>
              </a>
            </Link>
          )}
        </Step>
      ))}
    </Stepper>
  );
};

export default CheckoutStepper;
