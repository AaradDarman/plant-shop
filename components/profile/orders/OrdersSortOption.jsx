import React, { useState, memo } from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material";

function a11yProps(index) {
  return {
    id: `sort-tab-${index}`,
    "aria-controls": `sort-tabpanel-${index}`,
  };
}

const modalStyle = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  bgcolor: "background.default",
  border: "none",
  boxShadow: 0,
  p: 4,
};

const options = ["جاری", "تحویل شده", "لغو شده"];

const optionsCase = {
  جاری: "in-progress",
  "تحویل شده": "delivered",
  "لغو شده": "cancelled",
};

const StyledTabLabel = (props) => {
  const ordersCountConditions = {
    جاری: props.ordersCount.inProgressOrdersCount,
    "تحویل شده": props.ordersCount.deliveredOrdersCount,
    "لغو شده": props.ordersCount.cancelledOrdersCount,
  };

  return (
    <div className="flex">
      <span>{props.option}</span>
      <span
        className={`${
          props.isSelected
            ? "bg-accent-600 dark:bg-accent-500"
            : "bg-[#00000099] dark:bg-[#ffffffb3] "
        } mr-1 h-[20px] min-w-[20px] rounded-[5px]  px-1 text-white dark:text-primary-800 leading-tight`}
      >
        {ordersCountConditions[props.option]}
      </span>
    </div>
  );
};

const OrdersSortOption = ({ onSortChange, ordersCount }) => {
  const router = useRouter();
  const theme = useTheme();

  const [value, setValue] = useState(
    Object.values(optionsCase).indexOf(router.query.activeTab) != -1
      ? Object.values(optionsCase).indexOf(router.query.activeTab)
      : 0
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onSortChange(optionsCase[options[newValue]]);
  };

  return (
    <div className="flex items-center">
      <Tabs
        sx={{
          "& .MuiTab-root.Mui-selected": {
            color: theme.palette.mode === "dark" ? "accent.main" : "accent.600",
          },
          "& .MuiTabs-indicator": {
            backgroundColor:
              theme.palette.mode === "dark" ? "accent.main" : "accent.600",
          },
        }}
        value={value}
        onChange={handleChange}
      >
        {options.map((option, index) => (
          <Tab
            label={
              <StyledTabLabel
                isSelected={value === index}
                ordersCount={ordersCount}
                option={option}
              />
            }
            key={option}
            {...a11yProps(index)}
          />
        ))}
      </Tabs>
    </div>
  );
};

export default memo(OrdersSortOption);
