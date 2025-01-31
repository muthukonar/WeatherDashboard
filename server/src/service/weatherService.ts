import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  city: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescription: string;
  date: string;
  constructor(city: string, tempF: number, windSpeed: number, humidity: number, icon: string, iconDescription: string, date: string) {
    this.city = city;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.date = date;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL?: string;
  private apiKey?: string;
  // TODO: Define the baseURL, API key, and city name properties
  constructor() {
    // this.baseURL =  'http://api.openweathermap.org';
    // this.apiKey =  '2b72e47388cee763d944259a8bdff6fd';

    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }
  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const url = `${this.baseURL}/data/2.5/weather?q=${query}&appid=${this.apiKey}`;
    console.log(url);

    try {
      const response = await axios.get(url);


      if (!response.data.coord) {
        throw new Error('Location data not found.');
      }

      return {
        lat: response.data.coord.lat,
        lon: response.data.coord.lon,
      };
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw new Error('Location not found or invalid API key.');
    }
  }

  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}

  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}


  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}

  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await axios.get(url);
    console.log(coordinates);
    return response.data;
  }

  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(response: any): Weather {
    const { name: city, main, wind, weather, dt } = response;
    const tempF = main.temp;
    const windSpeed = wind.speed;
    const humidity = main.humidity;
    const icon = weather[0].icon;
    const iconDescription = weather[0].description;
    console.log(city,
      main.temp,
      wind.speed,
      main.humidity,
      weather[0].icon,
      weather[0].description,
      new Date(dt * 1000).toLocaleDateString('en-US', {
    timeZone: process.env.TZ || 'UTC', 
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }));


    const date = new Date(dt * 1000).toLocaleDateString();
    return new Weather(city, tempF, windSpeed, humidity, icon, iconDescription, date);
  }
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}



  // Code updated for 5 Days forecast weather report

  private buildForecastQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  private async fetchForecastData(coordinates: Coordinates): Promise<any> {
    const url = this.buildForecastQuery(coordinates);
    const response = await axios.get(url);
    return response.data;
  }


  private parseForecastData(currentWeather: Weather, forecastData: any[]): Weather[] {
    const forecast: Weather[] = [];
    const days: { [key: string]: any[] } = {};

    forecastData.forEach((data: any) => {
      const date = new Date(data.dt * 1000);
      const day = date.toLocaleDateString('en-US', {
    timeZone: process.env.TZ || 'UTC', 
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }); 
      if (!days[day]) {
        days[day] = [];
      }
      days[day].push(data);
    });

    const dayKeys = Object.keys(days).slice(1, 6);

    dayKeys.forEach(day => {
      const data = days[day][0];  
      forecast.push(new Weather(
        currentWeather.city,
        data.main.temp,
        data.wind.speed,
        data.main.humidity,
        data.weather[0].icon,
        data.weather[0].description,
        day
      ));
    });

    return forecast;
  }

  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}

  async getWeatherForCity(city: string): Promise<Weather[]> {
    try {
      const coordinates = await this.fetchLocationData(city);
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData);
      const forecastData = await this.fetchForecastData(coordinates);
      const forecast = this.parseForecastData(currentWeather, forecastData.list);
      return [currentWeather, ...forecast];
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Unable to fetch weather data.');
    }
  }
}

export default new WeatherService();