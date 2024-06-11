import { axiosHandler } from "./config";

export const createInfluencer = (param, callback) => {
  axiosHandler("/influencer/create", param, callback);
}

export const updateInfluencer = (param, callback) => {
  axiosHandler("/influencer/update", param, callback);
}

export const infoInfluencer = (param, callback) => {
  axiosHandler("/influencer/info", param, callback);
}

export const lookupInfluencer = (param, callback) => {
  axiosHandler("influencer/lookup", param, callback);
}