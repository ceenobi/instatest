import { Compass, Heart, House, Search } from "lucide-react";
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

export const sidebar = [
  {
    id: 1,
    path: "/",
    name: "Home",
    Icon: House,
  },
  {
    id: 2,
    path: "/search",
    name: "Search",
    Icon: Search,
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
