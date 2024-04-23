import React, { useState } from 'react';
import './WeatherPage.css';

interface WeatherData {
    cod: string;
    message?: string;
    name?: string;
    main?: {
        temp: number;
    };
    weather?: Array<{
        description: string;
        icon: string;
    }>;
}

const WeatherPage: React.FC = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

    const getWeather = async (): Promise<void> => {
        if (!city) {
            alert("Please enter the city");
            return;
        }
        const apiKey: string = '210bfc73cf2569847aed82d7dea149c4';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: WeatherData = await response.json();
            setWeatherData(data);
        } catch (error) {
            console.error('There was an error fetching the weather data:', error);
        }
    };
    return (
        <div className="Body">
            <div className="Title">
                Weather
            </div>
            <div className="Main">
                <div className="Input">
                    <div className="Search_position">
                        <input
                            className="Search"
                            placeholder="Search Weather"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                        <button onClick={getWeather} className="Button">Search</button>
                    </div>
                </div>
                {weatherData && (
                    <div>
                        <p>{weatherData.name}</p>
                        <p>{weatherData?.main ? Math.round(weatherData.main.temp - 273.15) : ''}°C</p>
                        <p>{weatherData?.weather?.[0]?.description ?? ''}</p>
                        <img
                            src={weatherData?.weather?.[0]?.icon ? `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png` : ''}
                            alt={weatherData?.weather?.[0]?.description ?? 'Weather icon'}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default WeatherPage;
