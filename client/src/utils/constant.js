import {
  BadgeCheck,
  BadgeX,
  Compass,
  Heart,
  House,
  KeyRound,
  Lock,
} from "lucide-react";
import {
  validateEmail,
  validateTextField,
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
    validate: (value) => validatePassword(value, "Password is required."),
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
    validate: (value) => validateTextField(value, "Fullname is required."),
    isRequired: true,
  },
  {
    label: "Bio",
    type: "text",
    id: "bio",
    name: "bio",
    placeholder: "Bio",
    isRequired: false,
  },
  {
    label: "New Password",
    type: "password",
    id: "newPassword",
    name: "newPassword",
    placeholder: "New password",
    validate: (value) => validatePassword(value, "New password is required."),
    isRequired: true,
  },
  {
    label: "Confirm Password",
    type: "password",
    id: "confirmPassword",
    name: "confirmPassword",
    placeholder: "Confirm Password",
    validate: (value) =>
      validatePassword(value, "Confirm password is required."),
    isRequired: true,
  },
  {
    label: "Title",
    type: "text",
    id: "title",
    name: "title",
    placeholder: "Title",
    validate: (value) => validateTextField(value, "Title is required."),
    isRequired: true,
  },
];

export const sidebar = [
  {
    id: 1,
    path: "/",
    name: "Home",
    Icon: House,
  },
  {
    id: 3,
    path: "/explore",
    name: "Explore",
    Icon: Compass,
  },
  {
    id: 4,
    path: "/favorites",
    name: "Likes",
    Icon: Heart,
  },
];

export const settingsLinks = [
  {
    id: 1,
    path: "/update-password",
    name: "Change password",
    Icon: KeyRound,
  },
  {
    id: 2,
    path: "/verify-account",
    name: "Account verification",
    Icon: BadgeCheck,
  },
  {
    id: 3,
    path: "/account-privacy",
    name: "Account privacy",
    Icon: Lock,
  },
  {
    id: 4,
    path: "/delete-account",
    name: "Delete account",
    Icon: BadgeX,
  },
];
