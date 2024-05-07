import React, { useContext, useEffect, useState } from "react";
import { SearchContext } from "./SearchContext";

const ResultsDisplay = () => {
  const { filteredResults, searchTerm } = useContext(SearchContext);
  const [imageDataArray, setImageDataArray] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dynamoDBData, setDynamoDBData] = useState([]);
  const [relatedDynamoDBData, setRelatedDynamoDBData] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const favsInLocalStorage = localStorage.getItem("favorites");
    return favsInLocalStorage ? JSON.parse(favsInLocalStorage) : [];
  });

  useEffect(() => {
    const imageDataFromLocalStorage = localStorage.getItem("imageDataArray");
    const dynamoDataFromLocalStorage = localStorage.getItem("IoTDataData");

    if (imageDataFromLocalStorage) {
      setImageDataArray(JSON.parse(imageDataFromLocalStorage));
    }

    if (dynamoDataFromLocalStorage) {
      setDynamoDBData(JSON.parse(dynamoDataFromLocalStorage));
    }
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

  const handleClick = (imageData) => {
    setSelectedImage(imageData);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const matchedImages = imageDataArray.filter((imageData) =>
    filteredResults.some((result) => imageData.name === result.imagename)
  );

  console.log(matchedImages);

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
  const showimage = () => {
    return (
      <div className="text-[black] flex flex-col items-center content-center">
        <h2 className="text-xl font-semibold mb-4">Search Result :</h2>
        <div className="flex justify-center w-full h-full">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
            {matchedImages.map((imageData, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-lg cursor-pointer shadow w-[516px] h-[451px]"
                onClick={() => handleClick(imageData)}
              >
                {imageData.name && (
                  <p className="text-center mb-2">
                    Date: {formatDateTime(imageData.name).formattedDate}
                    <br />
                    Time: {formatDateTime(imageData.name).formattedTime}
                  </p>
                )}
                <img
                  className="w-full h-auto object-cover"
                  src={`data:image/jpeg;base64,${imageData.data}`}
                  alt={`Image ${index}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
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
  //   console.log(filteredResults);
  //   console.log(searchTerm);
  return (
    <div>
      {filteredResults.length >= 0 ? (
        <>{showimage()}</>
      ) : (
        searchTerm && <p>No results found for "{searchTerm}"</p>
      )}
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
                  <div key={index} className="mt-2">
                    <p>
                      <strong>Latitude:</strong> {data.Latitude}
                    </p>
                    <p>
                      <strong>Longitude:</strong> {data.Longitude}
                    </p>
                    <p>
                      <strong>Temperature:</strong> {data.temperature}
                    </p>
                    <p>
                      <strong>Humidity:</strong> {data.humidity}
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
    </div>
  );
};

export default ResultsDisplay;
