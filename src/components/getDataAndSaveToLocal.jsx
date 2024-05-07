import React from "react";
import AWS from "aws-sdk";
import { IoIosRefresh } from "react-icons/io";

const fetchDataAndSaveAllToLocal = async () => {
  AWS.config.update({
    accessKeyId: "AKIA2FJY4VWP5KFGGLOK",
    secretAccessKey: "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",
    region: "ap-southeast-1",
  });
  const s3 = new AWS.S3();

  const dynamoDB = new AWS.DynamoDB.DocumentClient();
  try {
    const s3Params = {
      Bucket: "esp32imagedata-02b566796c19",
    };
    const s3Data = await s3.listObjectsV2(s3Params).promise();
    const imageNames = s3Data.Contents.map((obj) => obj.Key);

    const imageDataArray = await Promise.all(
      imageNames.map(async (imageName) => {
        const s3Params = {
          Bucket: "esp32imagedata-02b566796c19",
          Key: imageName,
        };
        const s3Data = await s3.getObject(s3Params).promise();
        const simpleImageName = imageName.split('/').pop();
        return { name: simpleImageName, data: s3Data.Body.toString("base64") };
      })
    );

    const tableNames = ["IoTData", "RekogData"];
    const allDynamoData = await Promise.all(
      tableNames.map(async (tableName) => {
        const dynamoDBParams = {
          TableName: tableName
        };
        const tableData = await dynamoDB.scan(dynamoDBParams).promise();
        return { tableName, items: tableData.Items };
      })
    );

    localStorage.setItem("imageDataArray", JSON.stringify(imageDataArray));
    allDynamoData.forEach(data => {
      localStorage.setItem(`${data.tableName}Data`, JSON.stringify(data.items));
    });

    console.log(
      "Images and DynamoDB data saved to local storage:",
      imageDataArray,
      allDynamoData
    );
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const FetchAllAndSaveButton = () => {
  const handleFetchAllAndSave = () => {
    fetchDataAndSaveAllToLocal();
  };

  return (
    <div>
      <button
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-xl shadow w-[80px] flex justify-center"
        onClick={handleFetchAllAndSave}>
        <IoIosRefresh />
      </button>
    </div>
  );
};

export default FetchAllAndSaveButton;
