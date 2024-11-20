import {
  validateEmail,
  validateFullname,
  validatePassword,
  validateUsername,
} from "./formValidate";

export const inputFields = [
  {
    label: "Username",
    type: "text",
    id: "username",
    name: "username",
    placeholder: "Username",
    validate: (value) => validateUsername(value),
    isRequired: true,
  },
  {
    label: "Password",
    type: "password",
    id: "password",
    name: "password",
    placeholder: "Password",
    validate: (value) => validatePassword(value),
    isRequired: true,
  },
  {
    label: "Email",
    type: "email",
    id: "email",
    name: "email",
    placeholder: "Email address",
    validate: (value) => validateEmail(value),
    isRequired: true,
  },
  {
    label: "Fullname",
    type: "text",
    id: "fullname",
    name: "fullname",
    placeholder: "Fullname",
    validate: (value) => validateFullname(value),
    isRequired: true,
  },
];
