import { createContext } from "react";

export const authContext = createContext({
  fName: "",
  setFName: () => {},
  lName: "",
  setLName: () => {},
  email: "",
  setEmail: () => {},
  username: "",
  setUsername: () => {},
  personalCode: "",
  setPersonalCode: () => {},
  phoneNumber: "",
  setPhoneNumber: () => {},
  password: "",
  setPassword: () => {},
  userId: "",
  setUserId: () => {},
  handleSignup: () => {},
  handleVerifyUser: () => {},
  handleResendVerificationCode: () => {},
  tokenCreateDate: "",
  openEditPhoneNumberModal: () => {},
  handleCheckUser: () => {},
  otpSentDate: null,
  forgotPassPageState: "",
  setForgotPassPageState: () => {},
  handleResetPassword: () => {},
});
