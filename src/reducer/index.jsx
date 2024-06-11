import { combineReducers } from "redux";
import { imageReducer as images } from "./images";
import { fileReducer as files } from "./files";

export default combineReducers({ images, files });
