import React, { useEffect, useState } from "react";
import FetchAllAndSaveButton from "./getDataAndSaveToLocal";
import ClearLocalStorageButton from "./ClearLocalStorageButton";
import MapDisplay from "./MapDisplay";
import { MdOutlineWbSunny } from "react-icons/md";
import { FaTemperatureHigh } from "react-icons/fa";
import { TbTemperatureCelsius } from "react-icons/tb";
import { WiHumidity } from "react-icons/wi";
import { Outlet } from "react-router-dom";

const Mainpage = () => {
  const [lastData, setLastData] = useState(null);

  useEffect(() => {
    const localStorageData = localStorage.getItem("IoTDataData");

    if (localStorageData) {
      const data = JSON.parse(localStorageData);

      data.sort((a, b) => {
        const dateA = new Date(a.imagename);
        const dateB = new Date(b.imagename);
        return dateA - dateB;
      });

      if (data.length > 0) {
        setLastData(data[data.length - 1]);
      } else {
        console.error("No data found in local storage.");
      }
    } else {
      console.error("No data found in local storage.");
    }
  }, []);

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

  return (
    <>
      <div className=" max-w-[screen] w-[100%] h-[100%] mx-auto flex flex-col items-center content-centertext-[black]">
        <div className="flex justify-end w-full mr-9 my-2">
          <FetchAllAndSaveButton />
          <ClearLocalStorageButton />
        </div>
        <div>
          {lastData && (
            <div>
              <p className="text-xl font-semibold text-center mb-4">
                Date: {formatDateTime(lastData.imagename).formattedDate}
                <br />
                Time: {formatDateTime(lastData.imagename).formattedTime}
              </p>
            </div>
          )}
        </div>
        <div className="flex 2xl:flex-row  2xl:w-screen 2xl:h-[600px] mb-[25px] items-center justify-center flex-col">
          <div className="flex flex-col bg-[#FFC876] 2xl:w-[800px] 2xl:h-[600px] 2xl:my-0 2xl:mr-[50px] rounded-3xl  md:w-[800px] sm:h-[275px] sm:mb-[25px] sm:w-[300px]">
            <div className=" my-[10px]">
              <h1>UV Index</h1>
            </div>
            <div className="flex md:w-[800px] h-full sm:w-[300px]">
              <div className="items-center m-auto pl-8 w-[400px] justify-center hidden sm:hidden md:block ">
                <MdOutlineWbSunny size="60%" />
              </div>
              <div className="items-center m-auto pl-6 w-[150px] justify-center hiden md:hidden sm:block">
                <MdOutlineWbSunny size="80%" />
              </div>
              <div className="flex md:w-[400px] items-center justify-center w-[150px]">
                {lastData && (
                  <div>
                    <p className=" md:text-[100px] sm:text-[50px]">
                      {lastData.UV}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col md:w-[800px] h-[600px] 2xl:ml-[50px] sm:w-[300px]">
            <div className=" flex flex-col bg-slate-600 md:w-[800px] h-[275px] rounded-3xl 2xl:mb-[25px] sm:w-[300px]">
              <div className=" my-[10px]">
                <h1>Temperature</h1>
              </div>
              <div className="flex md:w-[800px] h-full sm:w-[300px]">
                <div className="items-center m-auto  w-[200px] justify-center hidden sm:hidden md:block ">
                  <FaTemperatureHigh size="50%" />
                </div>
                <div className="items-center m-auto pl-4 w-[150px] justify-center hiden md:hidden sm:block">
                  <FaTemperatureHigh size="100%" />
                </div>
                <div className="flex md:w-[400px] items-center justify-center sm:w-[300px]">
                  {lastData && (
                    <div className="flex justify-center items-center">
                      <p className=" md:text-[80px] sm:text-[45px] md:w-[200px] sm:-[75px]">
                        {lastData.temperature}
                      </p>
                      <div className="items-center w-[200px] justify-center hidden sm:hidden md:block sm:w-[75px]">
                        <TbTemperatureCelsius size="100%" />
                      </div>
                      <div className="items-center justify-center hiden md:hidden sm:block">
                        <TbTemperatureCelsius size={60} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className=" flex flex-col bg-[#87B3F6] md:w-[800px] h-[275px] rounded-3xl mt-[25px] sm:w-[300px]">
              <div className=" my-[10px]">
                <h1>Humidity</h1>
              </div>
              <div className="flex md:w-[800px] h-full sm:w-[300px]">
                <div className="items-center m-auto w-[400px] justify-center hidden sm:hidden md:block ">
                  <WiHumidity size="60%" />
                </div>
                <div className="items-center m-auto w-[150px] justify-center hiden md:hidden sm:block">
                  <WiHumidity size="100%" />
                </div>
                <div className="flex w-[400px] items-center justify-center ">
                  {lastData && (
                    <div className="flex justify-center items-center">
                      <p className=" md:text-[80px] sm:text-[45px] md:w-[400px] sm:w-[150px]">
                        {lastData.humidity}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-red-900 2xl:w-[800px] 2xl:h-[500px] 2xl:my-0 2xl:mr-[50px] rounded-3xl  md:w-[800px] sm:h-[375px] sm:mb-[25px] sm:w-[300px] ">
          <div className=" my-[10px]">
            <h1>Location</h1>
          </div>
          {lastData && (lastData.Latitude === 0 && lastData.Longitude == 0) ? (
            <p className="flex justify-center md:text-3xl ">You are in the Building</p>
          ) : (
            <MapDisplay latitude={lastData?.Latitude} longitude={lastData?.Longitude} />
          )
          }

        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Mainpage;
