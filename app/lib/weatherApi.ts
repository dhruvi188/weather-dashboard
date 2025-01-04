import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY; // Make sure it's defined in .env.local
const BASE_URL = 'https://api.openweathermap.org/data/3.0/onecall/timemachine';

export const fetchHistoricalWeather = async (
    lat: number,
    lon: number,
    time: number
): Promise<any> => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                lat,
                lon,
                dt: time, // UNIX timestamp
                appid: API_KEY,
                units: 'metric', // Optional: Use 'imperial' for Fahrenheit
            },
        });
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            console.error('Location not found or invalid request.');
            alert('Location not found or invalid request. Please try again.');
        } else {
            console.error('Error fetching weather:', error.message);
        }
        throw error; // Re-throw error for further handling
    }
};
