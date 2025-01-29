// import express, { type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';

// TODO: Define a City class with name and id properties
class City {
  cityId: string;
  cityName: string;
  constructor(cityId: string, cityName: string) {
    this.cityId = cityId;
    this.cityName = cityName
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  filePath: string;
  

  constructor() {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    this.filePath = path.join(__dirname, 'searchHistory.json');
  }
  private async read(): Promise<City[]> {
    try{
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error){
      throw error;
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}

  private async write(cities: City[]) {
    try {
      const data = JSON.stringify(cities, null, 2);
      await fs.promises.writeFile(this.filePath, data, 'utf-8');
    } catch (error) {
      throw error;
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  async getCities(): Promise<City[]> {
    const cities = await this.read();
    return cities;
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  async addCity(cityName: string): Promise<void> {
    const cities = await this.read();
    const newCity = new City(Date.now().toString(), cityName); // Create a new city with a unique ID
    cities.push(newCity);
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
  async removeCity(cityId: string): Promise<void> {
    const cities = await this.read();
    const updatedCities = cities.filter((city) => city.cityId !== cityId);
    await this.write(updatedCities);
  }
}

export default new HistoryService();
