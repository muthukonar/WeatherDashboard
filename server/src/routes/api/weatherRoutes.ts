import { Router, type Request, type Response } from 'express';
const router = Router();

import WeatherService from '../../service/weatherService.js';
import HistoryService from '../../service/historyService.js';


// TODO: POST Request with city name to retrieve weather data
// router.post('/', async (req, res) => {

router.post('/', async (req: Request, res: Response) => {
  const { cityName } = req.body;


  if (!cityName) {
    return res.status(400).json({ error: 'City name is required - weatherRoute1' });
  }

  try {
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    console.log(weatherData);
    await HistoryService.addCity(cityName);
    return res.status(200).json(weatherData);  
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ error: 'Unable to fetch weather data.-weatherRoute 2'  });
  }
});


// TODO: GET search history
// router.get('/history', async (req, res) => {});
router.get('/history', async (_req: Request, res: Response) => {
  try {
    // Retrieve cities from search history
    const cities = await HistoryService.getCities();
    res.status(200).json(cities);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Unable to fetch search history.' });
  }
});

// * BONUS TODO: DELETE city from search history
// router.delete('/history/:id', async (req, res) => {});


router.delete('/history/:cityId', async (req: Request, res: Response) => {
  const { cityId } = req.params;

  if (!cityId) {
    return res.status(400).json({ error: 'City ID is required' });
  }

  try {
    await HistoryService.removeCity(cityId);
    return res.status(200).json({ message: 'City removed from search history' });
  } catch (error) {
    console.error('Error removing city from search history:', error);
    return res.status(500).json({ error: 'Unable to remove city from search history.' });
  }
});



export default router;

