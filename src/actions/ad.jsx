import { axiosHandler } from "./config";

export const createAd = (param, callback) => {
  axiosHandler("/ad/create", param, callback);
};

export const lookupAd = (param, callback) => {
  axiosHandler("/ad/lookup", param, callback);
};

export const pickAd = (param, callback) => {
  axiosHandler("/ad/pickup", param, callback);
};

export const updateAd = (param, callback) => {
  axiosHandler("/ad/update", param, callback);
};

export const deleteAd = (param, callback) => {
  axiosHandler("/ad/delete", param, callback);
};
