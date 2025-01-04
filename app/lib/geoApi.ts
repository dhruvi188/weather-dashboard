import axios from 'axios';

const geoApi = axios.create({
    baseURL: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
    headers: {
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_GEODB_API_KEY!,
        'X-RapidAPI-Host': process.env.NEXT_PUBLIC_GEODB_HOST!,
    },
});

export const fetchCities = async (query: string) => {
    const response = await geoApi.get('', {
        params: { namePrefix: query, limit: 5 },
    });
    return response.data.data;
};
