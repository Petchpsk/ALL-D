import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import MapDisplay from "./MapDisplay";

const ImageGallery = () => {
  const [imageDataArray, setImageDataArray] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dynamoDBData, setDynamoDBData] = useState([]);
  const [relatedDynamoDBData, setRelatedDynamoDBData] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const favsInLocalStorage = localStorage.getItem("favorites");
    return favsInLocalStorage ? JSON.parse(favsInLocalStorage) : [];
  });

  useEffect(() => {
    const localStorageData = localStorage.getItem("imageDataArray");
    const dynamoDataFromLocalStorage = localStorage.getItem("IoTDataData");
    const rekognition = localStorage.getItem("rekognitionData");

    if (localStorageData) {
      const data = JSON.parse(localStorageData);
      setImageDataArray(data);
    }

    if (dynamoDataFromLocalStorage) {
      setDynamoDBData(JSON.parse(dynamoDataFromLocalStorage));
    }
    console.log(rekognition);
  }, []);

  useEffect(() => {
    if (selectedImage && dynamoDBData) {
      const imageNameWithoutExtension = selectedImage.name.replace(".jpg", "");
      const filteredData = dynamoDBData.filter(
        (item) => item.imagename === imageNameWithoutExtension
      );
      setRelatedDynamoDBData(filteredData);
    } else {
      setRelatedDynamoDBData(null);
    }
  }, [selectedImage, dynamoDBData]);
  // console.log(selectedImage);
  // console.log(relatedDynamoDBData);

  const handleClick = (image) => {
    console.log(image);
    // setSelectedImage(imageDataArray[image]);
    setSelectedImage(image);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const handleYearClick = (year) => {
    setSelectedYear(year);
    setSelectedMonth(null);
    setSelectedDate(null);
    setSelectedImages([]);
  };

  const handleMonthClick = (month) => {
    setSelectedMonth(month);
    setSelectedDate(null);
    setSelectedImages([]);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const filteredImages = imageDataArray.filter((image) => {
      const imageName = image.name;
      return (
        imageName.startsWith(selectedYear) &&
        imageName.substring(5, 7) === selectedMonth &&
        imageName.substring(8, 10) === date
      );
    });
    filteredImages.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    setSelectedImages(filteredImages);
  };

  const renderYears = () => {
    if (selectedYear) {
      return null;
    }
    const years = Array.from(
      new Set(imageDataArray.map((image) => image.name.substring(0, 4)))
    );
    return years.map((year) => (
      <div
        key={year}
        className="bg-gradient-to-r from-cyan-500 to-blue-500 w-[400px] h-[500px] text-white p-4 rounded-lg cursor-pointer flex justify-center items-center my-4 mx-4"
        onClick={() => handleYearClick(year)}
      >
        {year}
      </div>
    ));
  };

  const renderMonths = () => {
    if (!selectedYear) {
      return null;
    }
    if (selectedMonth) {
      return null;
    }
    const months = Array.from(
      new Set(
        imageDataArray
          .filter((image) => image.name.startsWith(selectedYear))
          .map((image) => image.name.substring(5, 7))
      )
    );
    return months.map((month) => (
      <div
        key={month}
        className="bg-gradient-to-r from-violet-500 to-fuchsia-500 w-[400px] h-[500px] text-white p-4 rounded-lg cursor-pointer flex justify-center items-center my-4 mx-4"
        onClick={() => handleMonthClick(month)}
      >
        {month}
      </div>
    ));
  };

  const formatDateTime = (dateTimeString) => {
    const cleanString = dateTimeString.replace(/\.jpg$/, "");
    const [datePart, timePart] = cleanString.split("T");

    const [year, month, day] = datePart.split("-");
    const hour = timePart.substring(0, 2);
    const minute = timePart.substring(2, 4);
    const second = timePart.substring(4, 6);

    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hour}:${minute}:${second}`;

    return { formattedDate, formattedTime };
  };

  const renderDates = () => {
    if (!selectedYear || !selectedMonth) {
      return null;
    }
    if (selectedDate) {
      return null;
    }
    const dates = Array.from(
      new Set(
        imageDataArray
          .filter((image) =>
            image.name.startsWith(selectedYear + "-" + selectedMonth)
          )
          .map((image) => image.name.substring(8, 10))
      )
    );
    return dates.map((date) => (
      <div
        key={date}
        className="bg-gradient-to-r from-purple-500 to-pink-500 w-[400px] h-[500px] text-white p-4 rounded-lg cursor-pointer flex justify-center items-center my-4 mx-4"
        onClick={() => handleDateClick(date)}
      >
        {date}
      </div>
    ));
  };

  const renderImages = () => {
    return selectedImages.map((image, index) => (
      <div
        key={index}
        className="bg-gray-100 p-4 rounded-lg text-black w-[516px] h-[451px]"
        onClick={() => handleClick(image)}
      >
        {image.name && (
          <p className="text-center mb-2">
            Date: {formatDateTime(image.name).formattedDate}
            <br />
            Time: {formatDateTime(image.name).formattedTime}
          </p>
        )}
        <img
          className="w-full h-auto"
          src={`data:image/jpeg;base64,${image.data}`}
          alt={`Image ${index}`}
        />
      </div>
    ));
  };

  const category = () => {
    if (!selectedYear) {
      return <p className="text-xl font-semibold text-center mb-2">Years:</p>;
    } else if (selectedYear && !selectedMonth) {
      return <p className="text-xl font-semibold text-center mb-2">Months:</p>;
    } else if (selectedYear && selectedMonth && !selectedDate) {
      return <p className="text-xl font-semibold text-center mb-2">Dates:</p>;
    } else {
      return <p className="text-xl font-semibold text-center mb-2">Images:</p>;
    }
  };
  const handleFavorite = () => {
    const index = favorites.findIndex((fav) => fav.name === selectedImage.name);
    if (index >= 0) {
      const newFavorites = [
        ...favorites.slice(0, index),
        ...favorites.slice(index + 1),
      ];
      setFavorites(newFavorites);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    } else {
      const newFavorites = [...favorites, selectedImage];
      setFavorites(newFavorites);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    }
  };

  return (
    <>
      <div className="text-[black] flex flex-col items-center content-center">
        {selectedImage ? (
          <div className="fixed inset-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center px-4 py-6">
            <div className="bg-white p-4 rounded-lg max-w-lg mx-auto">
              {selectedImage.name && (
                <p className="text-center mb-2">
                  Date: {formatDateTime(selectedImage.name).formattedDate}
                  <br />
                  Time: {formatDateTime(selectedImage.name).formattedTime}
                </p>
              )}
              <img
                className="w-full h-auto max-h-80 object-contain"
                src={`data:image/jpeg;base64,${selectedImage.data}`}
                alt="Selected Image"
              />
              <button
                onClick={handleFavorite}
                className="block w-full mt-2 px-4 py-2 text-white rounded-md"
                style={{
                  backgroundColor: favorites.some(
                    (fav) => fav.name === selectedImage.name
                  )
                    ? "#d9534f"
                    : "#5cb85c",
                }}
              >
                {favorites.some((fav) => fav.name === selectedImage.name)
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </button>
              {relatedDynamoDBData && relatedDynamoDBData.length > 0 && (
                <div className="mt-4">
                  {relatedDynamoDBData.map((data, index) => (
                    <div
                      key={index}
                      className=" flex flex-col items-center justify-center h-[300px]"
                    >
                      <p>
                        <strong>Locationt:</strong>
                      </p>
                      {data && data.Latitude === 0 && data.Longitude === 0 ? (
                        <p className="">You are in the Building</p>
                      ) : (
                        <MapDisplay
                          latitude={data?.Latitude}
                          longitude={data?.Longitude}
                        />
                      )}
                      <p className=" text-center">
                        <strong>Temperature:</strong> {data.temperature} °C
                        <br />
                        <strong>Humidity:</strong> {data.humidity}%
                      </p>
                      <p>
                        <strong>UV Index:</strong> {data.UV}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={handleClose}
                className="block w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
        <div className="my-4">{category()}</div>
        <div className="flex flex-row flex-wrap justify-center items-center">
          {renderYears()}
        </div>
        <div className="flex flex-row flex-wrap justify-center items-center">
          {renderMonths()}
        </div>
        <div className="flex flex-row flex-wrap justify-center items-center">
          {renderDates()}
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 ">
            {renderImages()}
          </div>
        </div>

        <Outlet />
      </div>
    </>
  );
};

export default ImageGallery;
