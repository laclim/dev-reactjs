import axios from "axios";
import getConfig from "next/config";
import { useEffect, useReducer } from "react";
const { publicRuntimeConfig } = getConfig();
export const uploadImage = async (file) => {
  let formData = new FormData();
  formData.append("image", file);

  try {
    if (file) {
      const res = await axios.post(
        `${publicRuntimeConfig.BASE_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return {
        key: res.data.key,
        url: `${publicRuntimeConfig.CLOUDFRONT_URL}/${res.data.key}`,
      };
    }
  } catch (error) {
    console.log(error);
  }
};

export const getS3Image = (key, width?, height?) => {
  if (key) {
    if (width && height) {
      return `${
        publicRuntimeConfig.RESIZE_CLOUDFRONT_URL
      }/${width}x${height}-${key.replace(/\//g, "-")}`;
    } else {
      return `${publicRuntimeConfig.CLOUDFRONT_URL}/${key}`;
    }
  }

  return publicRuntimeConfig.CLOUDFRONT_URL + "/" + key;
};
