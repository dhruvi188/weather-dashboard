type WeatherProps = {
    temperature: number;
    description: string;
    city: string;
};

const WeatherCard: React.FC<WeatherProps> = ({ temperature, description, city }) => (
    <div className="border p-4">
        <h2>{city}</h2>
        <p>{description}</p>
        <p>{temperature}°C</p>
    </div>
);

export default WeatherCard;
