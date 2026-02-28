import { endpoints } from "../../../src/endpoints.js";

export const registerPayload = {
  firstName: "Arafat",
  lastName: "Mansuri",
  email: "arafat@test.com",
  accountType:"student",
  // contactNo: "1234567890",
  password: "Password@123",
};
export const URL = endpoints.auth.signup.base;