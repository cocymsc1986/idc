/* eslint-disable @typescript-eslint/restrict-template-expressions */
import axios from "axios";

import { GetDIDDirectoryResponse } from "../../types";

const apiUrl = process.env.DID_DIRECTORY_API_URL;

export const getDidDirectory = async (): Promise<GetDIDDirectoryResponse> => {
  console.info("Getting DID Directory");
  try {
    const response = await axios.get(`${apiUrl}/get-IDCDID-Directory`, {
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.OCP_APIM_SUBSCRIPTION_KEY,
      },
    });

    if (!response.data) {
      console.error("No data returned for getting DID Directory");
      throw new Error("No data returned for getting DID Directory");
    }

    const didDirectory = (response.data as GetDIDDirectoryResponse).listing;

    if (!didDirectory) {
      console.error("No data found for getting DID Directory");
      throw new Error("No data found for getting DID Directory");
    }

    const data = response.data as GetDIDDirectoryResponse;

    console.info("Successfully retrieved DID Directory");
    return data;
  } catch (e) {
    console.error("Error getting DID Directory", { e });
    throw new Error(`Error getting DID Directory ${e}`);
  }
};
