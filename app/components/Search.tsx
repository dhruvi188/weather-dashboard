'use client'

import { useState } from 'react';
import { fetchCities } from '../lib/geoApi'

type City = {
    name: string;
    country: string;
};

type SearchBarProps = {
    onCitySelect: (city: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onCitySelect }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<City[]>([]);

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        if (value.length > 2) {
            const cities = await fetchCities(value);
            setSuggestions(cities);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (city: string) => {
        setQuery(city);
        setSuggestions([]);
        onCitySelect(city);
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search for a city..."
                className="border p-2 w-full"
            />
            <ul className="absolute border bg-white w-full">
                {suggestions.map((city, index) => (
                    <li
                        key={index}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSuggestionClick(city.name)}
                    >
                        {city.name}, {city.country}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchBar;
