
import dotenv from "dotenv";

dotenv.config();

import { getTrainDetails } from "../utils/getTrainDetails.js";
import { getDateDetails } from "../utils/getDateInfo.js";
import { checkValidityOfDate } from "../utils/checkValidityOfDate.js";
import axios from "axios";

export const getData = async (req, res) => {
  try {
    const { trainNumber, date } = req.body;
   

    if (!trainNumber || !date) {
      return res.status(400).json({
        success: false,
        message: "Train number and date are required.",
      });
    }

    const train_details = getTrainDetails(trainNumber);
    if (!train_details || train_details.error) {
      return res.status(404).json({
        success: false,
        message: "Train not found.",
        details: train_details?.error || null,
      });
    }

    const isDateValid = checkValidityOfDate(train_details, date);
    if (!isDateValid) {
      return res.status(400).json({
        success: false,
        message: "Train not running on the given date.",
      });
    }

    const date_details = getDateDetails(date);
    if (date_details === null) {
      return res.status(400).json({
        success: false,
        message: "Please do not enter too old a date.",
      });
    }

    const train_start = train_details.Stations[0];
    const train_end = train_details.Stations[train_details.Stations.length - 1];
    if (!train_start || !train_end) {
      throw new Error("Invalid Stations data in train details.");
    }

    const formattedTrainName = train_details.Train_name.replace(
      /\s+/g,
      "-"
    ).toLowerCase();
    const url = `${process.env.TRAIN_API1}${trainNumber}${process.env.TRAIN_API2}${date_details}`;

    const response = await axios.get(url);
    const data = response.data;
    console.dir(data, { depth: null });

    return res.status(200).json({
      success: true,
      response: {
        pageProps: {
          ltsData: data,
        },
      },
      message: "Successfully fetched data.",
    });
  } catch (error) {
    console.error("Data error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
