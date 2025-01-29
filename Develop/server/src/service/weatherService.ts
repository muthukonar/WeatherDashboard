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
  cityName: string;
  temperature: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescription: string;
  date: string;
  constructor(cityName: string, temperature: number, windSpeed: number, humidity: number, icon: string, iconDescription: string, date: string) {
    this.cityName = cityName;
    this.temperature = temperature;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.date = date;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string;
  // TODO: Define the baseURL, API key, and city name properties
  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
    this.apiKey = process.env.OPENWEATHER_API_KEY || '2b72e47388cee763d944259a8bdff6fd';
  }
  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const url = `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
    const response = await axios.get(url);
    if (response.data.length === 0) throw new Error('Location not found.');
    return {
      lat: response.data[0].lat,
      lon: response.data[0].lon
    };
  }

  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return locationData;
  }

  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  // private buildGeocodeQuery(cityName: string): string {
  //   return `${this.baseURL}/geo/1.0/direct?q=${cityName}&limit=1&appid=${this.apiKey}`;
  // }

  
  
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await axios.get(url);
    return response.data;
  }
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(response: any): Weather {
    const { name: cityName, main, wind, weather, dt } = response;
    const temperature = main.temp;
    const windSpeed = wind.speed;
    const humidity = main.humidity;
    const icon = weather[0].icon;
    const iconDescription = weather[0].description;

    // Convert Unix timestamp to human-readable date
    const date = new Date(dt * 1000).toLocaleDateString();
    return new Weather(cityName, temperature, windSpeed, humidity, icon, iconDescription, date);
  }
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecast = weatherData.map((data: any) => {
      return new Weather(
        currentWeather.cityName,
        data.main.temp,
        data.wind.speed,
        data.main.humidity,
        data.weather[0].icon,
        data.weather[0].description,
        new Date(data.dt * 1000).toLocaleDateString()
      );
    });

    return forecast;
  }
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  async getWeatherForCity(city: string): Promise<Weather[]> {
    try {
      const coordinates = await this.fetchAndDestructureLocationData(city);
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData);
      const forecastData = weatherData.list;
      const forecast = this.buildForecastArray(currentWeather, forecastData);
      return [currentWeather, ...forecast];
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Unable to fetch weather data.');
    }
  }
}

export default new WeatherService();
