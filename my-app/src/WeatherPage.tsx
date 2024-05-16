import React, {useEffect, useState} from 'react';
import './WeatherPage.css';
import ToggleSwitch from '../src/components/ToggleSwitch'

interface WeatherData {
    cod: string;
    message?: string;
    name?: string;
    lat?: number;
    lon?: number;
    main?: {
        temp: number;
    };
    weather?: Array<{
        description: string;
        icon: string;
    }>;
}

interface ForecastData {
    lat: number;
    lon: number;
    timezone: string;
    daily: Array<{
        dt: number;
        sunrise: number;
        sunset: number;
        temp: {
            day: number;
            min: number;
            max: number;
            night: number;
            eve: number;
            morn: number;
        };
        pressure: number;
        humidity: number;
        weather: Array<{
            id: number;
            main: string;
            description: string;
            icon: string;
        }>;
        speed: number;
        deg: number;
        gust: number;
        clouds: number;
        pop: number;
        rain: number;
    }>;
}


const WeatherPage: React.FC = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [forecastData, setForecastData] = useState<ForecastData | null>(null);
    const [toggleTitle, setToggleTitle] = useState('Day')
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

    const getWeatherWeek = async (): Promise<void> => {
        if (!city) {
            alert("Please enter the city");
            window.location.reload();
            return;
        }
        const apiKey: string = '3220944b399f650d38eeffbb0aa8c7d9';
        const urlForCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        console.log(urlForCity)

        try {
            let response = await fetch(urlForCity);

            if (!response.ok) {
                alert("Please Enter Valid City Name");
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const cityData = await response.json();
            const { lat, lon } = cityData.coord;

            const urlForForecast = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${apiKey}`;
            response = await fetch(urlForForecast);
            console.log(response, 12222222222222)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const forecastData: ForecastData = await response.json();
            setForecastData(forecastData);
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



    const handleToggle = (state: boolean) => {
        if(!state){
            setToggleTitle('Week')
        }else{
            setToggleTitle('Day')
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
                        <button onClick={toggleTitle === 'Day'? getWeather: getWeatherWeek} className={`${weatherData ? 'hidden' : 'Button'}`}>Search</button>
                        <div className={`${!weatherData? 'toggle_button' : 'hidden'}`}>
                            <ToggleSwitch initial={true} onChange={handleToggle}/>
                            <div className='toggle_title'>
                                {toggleTitle}
                            </div>
                        </div>
                        {weatherData && (
                            <div>
                                <div className={`${toggleTitle === "Day" ? 'data_wrap' : "hidden"}`}>
                                    <p>Day Forecast</p>
                                    <p>{weatherData.name}</p>
                                    <p>{weatherData?.main ? Math.round(weatherData.main.temp - 273.15) : ''}°C</p>
                                    <p>{weatherData?.weather?.[0]?.description ?? ''}</p>
                                    <img style={{backgroundColor: '#C65BCF', borderRadius: '50%', margin: '1rem'}}
                                         src={weatherData?.weather?.[0]?.icon ? `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png` : ''}
                                         alt={weatherData?.weather?.[0]?.description ?? 'Weather icon'}
                                    />
                                </div>
                            </div>
                        )}
                        {forecastData && (
                            <div className={`${toggleTitle === "Day" ? 'hidden' : 'data_wrap'}`}>
                                <p>Week Forecast</p>
                                {forecastData?.daily.map((day, index) => (
                                    <div key={index}>
                                        <p>{new Date(day.dt * 1000).toLocaleDateString()}</p>
                                        <p>{day.temp ? Math.round(day.temp.day - 273.15) : ''}°C</p>
                                        <p>{day.weather?.[0]?.description ?? ''}</p>
                                        <img style={{
                                            backgroundColor: '#C65BCF',
                                            borderRadius: '50%',
                                            margin: '1rem'
                                        }}
                                             src={day.weather?.[0]?.icon ? `https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png` : ''}
                                             alt={day.weather?.[0]?.description ?? 'Weather icon'}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <button id='button_refresh' className={`${weatherData ? 'Button' : 'hidden'}`}
                                onClick={() => window.location.reload()}>Search Again
                        </button>
                    </div>
                </div>
            </div>
        </body>
    );
}

export default WeatherPage;
