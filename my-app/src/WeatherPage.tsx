import React, {useEffect, useState} from 'react';
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
            window.location.reload();
            return;
        }
        const apiKey: string = '210bfc73cf2569847aed82d7dea149c4';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                window.location.reload()
                alert("Please Enter Valid City Name")
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: WeatherData = await response.json();
            setWeatherData(data);
        } catch (error) {
            console.error('There was an error fetching the weather data:', error);
        }
    };

    useEffect(() => {
        let element = document.getElementById('searchWeather');
        if(element) element.focus()
    }, []);


    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            getWeather();
        }
    };

    const handleRefresh = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            window.location.reload()
        }
    };

    return (
        <body className="Body">
            <div className="Title">
                <p style={{color : "#D7DAE5", marginRight : 15}}>Weather In</p>
                <p style={{color : "#C65BCF"}}>{weatherData?.name? weatherData?.name : 'Yerevan'}</p>
            </div>
            <div className="Main">
                <div className="Input">
                    <div className="Search_position">
                        <input
                            id='searchWeather'
                            className={`${weatherData ? 'hidden' : 'Search'}`}
                            placeholder="Search Weather"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button onClick={getWeather} className={`${weatherData ? 'hidden' : 'Button'}`}>Search</button>
                        {weatherData && (
                            <div className='data_wrap'>
                                <p>{weatherData.name}</p>
                                <p>{weatherData?.main ? Math.round(weatherData.main.temp - 273.15) : ''}°C</p>
                                <p>{weatherData?.weather?.[0]?.description ?? ''}</p>
                                <img style={{backgroundColor: '#C65BCF', borderRadius: '50%', margin: '1rem'}}
                                     src={weatherData?.weather?.[0]?.icon ? `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png` : ''}
                                     alt={weatherData?.weather?.[0]?.description ?? 'Weather icon'}
                                />
                            </div>
                        )}
                        <button id='button_refresh' className={`${weatherData? 'Button' : 'hidden'}`} onClick={()=> window.location.reload()}>Search Again</button>
                    </div>
                </div>
            </div>
        </body>
    );
}

export default WeatherPage;
