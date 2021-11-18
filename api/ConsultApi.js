export default async function getCurrentWeather(locationCoords) {
  const axios = require('axios')

  const lat = locationCoords.latitude

  const log = locationCoords.longitude

  var result = []
  console.log(
    `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${log}&appid=74752287b83f2da3e0da54ad9db4b5cc`
  )

  await axios
    .get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${log}&appid=74752287b83f2da3e0da54ad9db4b5cc`
    )
    .then(response => {
      const data = response.data
      const locationName = data.sys.country + ' , ' + data.name
      const temperatureMin = data.main.temp_min
      const temperatureMax = data.main.temp_max
      const wind = data.wind.speed
      const humidity = data.main.humidity
      const currentTemperature = data.main.temp_max

      result = [
        currentTemperature,
        temperatureMin,
        temperatureMax,
        locationName,
        wind,
        humidity
      ]
    })
    .catch(error => {
      console.log(error)
    })
  return result
}
