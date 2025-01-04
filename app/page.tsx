'use client';

import { useState, useEffect } from 'react';
import SearchBar from '../app/components/Search';
import WeatherCard from '../app/components/WeathCard';
import ForecastCard from '../app/components/ForecastCard';
import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_BASE_URL = 'https://api.openweathermap.org/geo/1.0/direct';

const Dashboard: React.FC = () => {
    const [weather, setWeather] = useState<any>(null);
    const [forecast, setForecast] = useState<any>(null);

    const fetchCityCoordinates = async (city: string) => {
        try {
            const response = await axios.get(GEO_BASE_URL, {
                params: {
                    q: city,
                    limit: 1,
                    appid: API_KEY,
                },
            });

            if (response.data.length === 0) {
                throw new Error('City not found. Please check the name.');
            }

            const { lat, lon } = response.data[0];
            return { lat, lon };
        } catch (error: any) {
            console.error('Error fetching city coordinates:', error.message);
            throw error;
        }
    };

    const fetchCurrentWeather = async (lat: number, lon: number) => {
        try {
            const response = await axios.get(`${WEATHER_BASE_URL}/weather`, {
                params: {
                    lat,
                    lon,
                    appid: API_KEY,
                    units: 'metric',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching current weather:', error.message);
            throw error;
        }
    };

    const fetchWeatherForecast = async (lat: number, lon: number) => {
        try {
            const response = await axios.get(`${WEATHER_BASE_URL}/onecall`, {
                params: {
                    lat,
                    lon,
                    appid: API_KEY,
                    units: 'metric',
                    exclude: 'current,minutely,hourly,alerts', // Exclude unnecessary data
                },
            });
            return response.data.daily; // Return daily forecasts
        } catch (error) {
            console.error('Error fetching weather forecast:', error.message);
            throw error;
        }
    };

    const handleCitySelect = async (city: string) => {
        try {
            const { lat, lon } = await fetchCityCoordinates(city);

            const currentWeather = await fetchCurrentWeather(lat, lon);
            setWeather(currentWeather);

            const weatherForecast = await fetchWeatherForecast(lat, lon);
            setForecast(weatherForecast.slice(0, 7)); // Limit to 7 days
        } catch (error: any) {
            console.error('Error handling city select:', error.message);
        }
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async ({ coords }) => {
            const { latitude, longitude } = coords;

            try {
                const currentWeather = await fetchCurrentWeather(latitude, longitude);
                setWeather(currentWeather);

                const weatherForecast = await fetchWeatherForecast(latitude, longitude);
                setForecast(weatherForecast.slice(0, 7)); // Limit to 7 days
            } catch (error) {
                console.error('Error fetching weather data for current location:', error.message);
            }
        });
    }, []);

    return (
        <div className="p-4">
            <SearchBar onCitySelect={handleCitySelect} />
            {weather && (
                <WeatherCard
                    temperature={weather.main.temp}
                    description={weather.weather[0].description}
                    city={weather.name}
                />
            )}
            {forecast && (
                <ForecastCard
                    forecast={forecast.map((day: any) => ({
                        day: new Date(day.dt * 1000).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        }), // Full date
                        temperature: day.temp.day, // Daily temperature
                        description: day.weather[0].description,
                    }))}
                />
            )}
        </div>
    );
};

export default Dashboard;
