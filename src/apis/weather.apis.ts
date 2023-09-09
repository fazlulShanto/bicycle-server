import fetch from 'node-fetch';
import path from 'path';

import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

const getWeatherData = async (longitude: Number, latitude: Number) => {
  const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  const appid = process.env.OPEN_WEATHER_API_ID;

  const url = `${apiUrl}?&lat=${latitude}&lon=${longitude}&appid=${appid}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const weatherData = await response.json();

    const weather = {
      description: weatherData.weather[0].description,
      temperature: weatherData.main.temp,
    };

    return weather;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export { getWeatherData };
