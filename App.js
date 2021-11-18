import { StatusBar } from 'expo-status-bar'
import React, { useState, useEffect } from 'react'
import MainCard from './components/MainCard'
import InfoCard from './components/InfoCard'
import getCurrentWeather from './api/ConsultApi'
import * as Location from 'expo-location'

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { EvilIcons } from '@expo/vector-icons'

export default function App() {
  const [darkTheme, setDarkTheme] = useState(true)
  const [currentTemperature, setCurrentTemperature] = useState('27')
  const [location, setLocation] = useState('BR, Teutônia')
  const [currentHour, setCurrentHour] = useState('13:00')

  const [wind, setWind] = useState('65')
  const [umidity, setUmidity] = useState('80')
  const [tempMin, setTempMin] = useState('21')
  const [tempMax, setTempMax] = useState('31')
  const [locationCoords, setLocationCoords] = useState([])

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkTheme ? '#232634' : '#f2f2f2',
      alignItems: 'center'
    },
    temperatura: {
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: 10
    },
    temperaturaText: {
      color: darkTheme ? '#e0e0e0' : 'black',
      fontSize: 50
    },
    refreshButton: {
      position: 'absolute',
      margin: 30,
      alignSelf: 'flex-start'
    },
    cardView: {
      color: darkTheme ? 'black' : 'white',
      margin: 10,
      flexDirection: 'row',
      alignItems: 'center'
    },
    info: {
      alignItems: 'center',
      backgroundColor: darkTheme ? '#393e54' : '#8f8f8f',
      borderRadius: 20,
      width: 350,
      height: 230
    },
    infoText: {
      color: darkTheme ? '#e0e0e0' : 'white',
      margin: 15,
      fontSize: 20,
      fontWeight: 'bold'
    },
    infoCard: {
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    themeButton: {
      margin: 10,
      marginLeft: 300,
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      height: 50,
      borderRadius: 25
    },
    squareButton: {
      backgroundColor: darkTheme ? '#f2f2f2' : '#8f8f8f',
      justifyContent: 'center',
      borderRadius: 20,
      marginRight: 20,
      width: 50,
      height: 25
    },
    circleButton: {
      alignSelf: darkTheme ? 'flex-end' : 'flex-start',
      backgroundColor: darkTheme ? '#232634' : '#f2f2f2',
      margin: 5,
      width: 20,
      height: 20,
      borderRadius: 50
    }
  })

  async function setCurrentWeather() {
    await getLocation()

    let date = new Date()
    setCurrentHour(date.getHours() + ':' + date.getMinutes())

    const data = await getCurrentWeather(locationCoords)

    setCurrentTemperature(convertKelvinInC(data[0]))
    setTempMin(convertKelvinInC(data[1]))
    setTempMax(convertKelvinInC(data[2]))
    setLocation(data[3])
    setWind(data[4])
    setUmidity(data[5])
  }

  function convertKelvinInC(kelvin) {
    return parseInt(kelvin - 273)
  }

  async function getLocation() {
    let { status } = await Location.requestPermissionsAsync()
    if (status !== 'granted') {
      setErrorMsg('Permissão negada')
    } else {
      let location = await Location.getCurrentPositionAsync({})
      await setLocationCoords(location.coords)
    }
  }

  useEffect(() => {
    setCurrentWeather()
    console.log(locationCoords)
    getCurrentWeather(locationCoords)
  }, [])

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setCurrentWeather()}
        style={styles.refreshButton}
      >
        <EvilIcons
          name="refresh"
          size={30}
          color={darkTheme ? 'white' : 'black'}
        />
      </TouchableOpacity>
      <Feather
        name="sun"
        size={40}
        color="black"
        style={{ marginTop: 55, color: 'orange' }}
      />
      <View style={styles.temperatura}>
        <Text style={styles.temperaturaText}>{currentTemperature}</Text>
        <Text style={[styles.temperaturaText, { fontSize: 14 }]}>°C</Text>
      </View>

      <Text style={[styles.temperaturaText, { fontSize: 14 }]}>
        {location}, {currentHour}
      </Text>

      <View style={styles.cardView}>
        <MainCard
          title={'Manhã'}
          backgroundColor={darkTheme ? '#ff873d' : '#cc6e30'}
          temperature={'24°'}
          icon={'morning'}
        />
        <MainCard
          title={'Tarde'}
          backgroundColor={darkTheme ? '#D29600' : '#FCC63F'}
          temperature={'31°'}
          icon={'afternoon'}
        />
        <MainCard
          title={'Noite'}
          backgroundColor={darkTheme ? '#008081' : '#38B7B8'}
          temperature={'21°'}
          icon={'night'}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.infoText}>Informações Adicionais</Text>
        <View style={styles.infoCard}>
          <InfoCard title={'Vento'} value={wind + ' m/h'}></InfoCard>
          <InfoCard title={'Umidade'} value={umidity + ' %'}></InfoCard>
          <InfoCard title={'Temp. Min'} value={tempMin + ' °'}></InfoCard>
          <InfoCard title={'Temp. Max'} value={tempMax + ' °'}></InfoCard>
        </View>
      </View>
      <View style={styles.themeButton}>
        <View style={styles.squareButton}>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() =>
              darkTheme ? setDarkTheme(false) : setDarkTheme(true)
            }
          ></TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
