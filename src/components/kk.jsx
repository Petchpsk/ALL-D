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
        {relatedDynamoDBData && relatedDynamoDBData.length > 0 && (
          <div className="mt-4">
            {relatedDynamoDBData.map((data, index) => (
              <div
                key={index}
                className=" flex flex-col items-center justify-center"
              >
                <p>
                  <strong>Locationt:</strong>
                </p>
                {data && data.Latitude == 0 && data.Longitude == 0 ? (
                  <p className="">You are in the Building</p>
                ) : (
                  <MapDisplay
                    latitude={data?.Latitude}
                    longitude={data?.Longitude}
                  />
                )}
                <p>
                  <strong>Temperature:</strong> {data.temperature}{" "}
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