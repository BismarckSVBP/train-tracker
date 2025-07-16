import dotenv from "dotenv";

dotenv.config();



import axios from "axios";

export const getPNRData = async (req, res) => {
  try {
    const { pnr_number } = req.body;

    if (!pnr_number) {
      return res.status(400).json({
        success: false,
        message: "PNR Number are required.",
      });
    }
    if (pnr_number.toString().length !== 10) {
      return res.status(400).json({
        success: false,
        message: "PNR Number should contain exactly 10 digits.",
      });
    }

    const url = `${process.env.PNR_API}${pnr_number}`;

    const response = await axios.get(url);
    const data = response.data;
    if (!data.pnrNo) {
      return res.status(400).json({
        success: false,
        message:
          "The PNR Number you've entered is either wrong or has been flushed.",
      });
    }

    console.log("API Response:", data);

    return res.status(200).json({
      success: true,
      response: data,
      message: "Successfully fetched data.",
    });
  } catch (error) {
    console.error("Error fetching PNR data:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching PNR data.",
      error: error.message,
    });
  }
};
