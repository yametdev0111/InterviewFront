import { axiosHandler } from "./config";

export const createBusiness = (param, callback) => {
  axiosHandler("/business/create", param, callback);
}

export const updateBusiness = (param, callback) => {
  axiosHandler("/business/update", param, callback);
}

export const infoBusiness = (param, callback) => {
  axiosHandler("/business/info", param, callback);
}

export const lookupBusiness = (param, callback) => {
  axiosHandler("business/lookup", param, callback);
}