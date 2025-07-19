import { logger } from '../utils/logger.js'

export class WeatherService {
  static async fetchWeatherData(city: string): Promise<string> {
    logger.info(`🌤️  Fetching weather for: ${city}`)

    // In a real implementation, you'd call a weather API
    // For demo purposes, we'll return mock data
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay

    const mockWeather = {
      temperature: Math.floor(Math.random() * 30) + 10,
      condition: ['sunny', 'cloudy', 'rainy', 'snowy'][
        Math.floor(Math.random() * 4)
      ],
      humidity: Math.floor(Math.random() * 40) + 40,
    }

    const weatherData = `Weather in ${city}: ${mockWeather.temperature}°C, ${mockWeather.condition}, ${mockWeather.humidity}% humidity`
    logger.info(`✅ Weather data retrieved for ${city}`)

    return weatherData
  }

  static async getForecast(city: string, days: number = 5): Promise<string[]> {
    logger.info(`🌤️  Fetching ${days}-day forecast for: ${city}`)

    await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API delay

    const forecast: string[] = []
    const conditions = ['sunny', 'cloudy', 'rainy', 'snowy', 'partly cloudy']

    for (let i = 0; i < days; i++) {
      const temp = Math.floor(Math.random() * 25) + 10
      const condition =
        conditions[Math.floor(Math.random() * conditions.length)]
      const date = new Date()
      date.setDate(date.getDate() + i + 1)

      forecast.push(`${date.toDateString()}: ${temp}°C, ${condition}`)
    }

    logger.info(`✅ ${days}-day forecast retrieved for ${city}`)
    return forecast
  }
}
