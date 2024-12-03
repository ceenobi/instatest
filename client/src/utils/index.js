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
  handleSavePost,
  handleLike,
  handleDeleteComment,
  handleCommentLike,
  toggleFollowUser,
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
  handleSavePost,
  handleLike,
  handleDeleteComment,
  handleCommentLike,
  toggleFollowUser,
};
