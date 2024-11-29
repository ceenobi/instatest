import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateTextField,
} from "./formValidate";
import { inputFields, sidebar, settingsLinks } from "./constant";
import axiosInstance from "./axiosInstance";
import handleError from "./handleError";
import {
  saveUserPost,
  unsaveUserPost,
  savePostPage,
  unsavePostPage,
  handleLike,
  handleUnlike,
  handleLikePostPage,
  handleUnlikePostPage,
} from "./setFunction";

export {
  validateEmail,
  validatePassword,
  validateUsername,
  validateTextField,
  inputFields,
  axiosInstance,
  handleError,
  sidebar,
  settingsLinks,
  saveUserPost,
  unsaveUserPost,
  savePostPage,
  unsavePostPage,
  handleLike,
  handleUnlike,
  handleLikePostPage,
  handleUnlikePostPage,
};
