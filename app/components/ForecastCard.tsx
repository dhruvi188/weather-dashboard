interface Forecast {
    day: string; // Full date as a string
    temperature: number;
    description: string;
}

interface ForecastCardProps {
    forecast: Forecast[];
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
    return (
        <div className="forecast-grid">
            {forecast.map((item, index) => (
                <div key={index} className="forecast-item">
                    <h3>{item.day}</h3>
                    <p>{item.temperature}°C</p>
                    <p>{item.description}</p>
                </div>
            ))}
        </div>
    );
};

export default ForecastCard;
