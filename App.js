import { StatusBar } from 'expo-status-bar';
import { AppLoading } from 'expo';
import { Container, Text } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import React, {useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
// Location Info and Permissions
import * as Location from 'expo-location';
// API
import axios from 'axios';
//components
import WeatherInfo from './components/WeatherInfo';
import UnitsPicker from './components/UnitsPicker';
import ReloadIcon from './components/ReloadIcon';
import WeatherDetails from './components/WeatherDetails';
import {colors} from './utils';


const WEATHER_API_KEY = "123ffd85dddf85ffc366a4325f4aa34b"
const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?"

export default function App() {
  


const [errorMessage, setErrorMessage] = useState(null);
const [currentWeather, setCurrentWeather] = useState(null);
//set to celcius
const [unitsSystem, setUnitsSystem] = useState('metric');

  useEffect(() => {
    load()
  }, [unitsSystem])

  async function load(){
    setCurrentWeather(null)
    try{
      let { status } = await Location.requestPermissionsAsync()

      if (status !== 'granted'){
        setErrorMessage('Access to location is needed to use this app');
        return
      }
      const location = await Location.getCurrentPositionAsync();
      
      const {latitude, longitude} = location.coords;


      const weatherUrl =
      `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_KEY}`;
      // const weatherUrl= "https://api.openweathermap.org/data/2.5/weather?lat=51.449720&lon=-0.003070&units=metric&appid=123ffd85dddf85ffc366a4325f4aa34b"

      const response = await fetch(weatherUrl)

      const result = await response.json()



      if(response.ok){
        setCurrentWeather(result)
      } else {
        setErrorMessage(result.message)
      }

    } catch(error){
      setErrorMessage(error.message)
    }
  }

if(currentWeather){
  //grab main and temp from main
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.main}>
        <View style={styles.weatherInfo}>
          <UnitsPicker  unitsSystem={unitsSystem} setUnitsSystem={setUnitsSystem} />
          <WeatherInfo currentWeather={currentWeather} />
          <ReloadIcon load={load}/>
        </View>
        <View style={styles.weatherDetails}>
          <WeatherDetails currentWeather={currentWeather} unitsSystem={unitsSystem} />
        </View>
      </View>

    </View>
  ) 
} else if(errorMessage){
  return (
    <View style={styles.container}>
      <Text style={{color: 'red'}}>{errorMessage}</Text>
      <StatusBar style="auto" />
    </View>
  ) 
} else {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.PRIMARY} />
      <StatusBar style="auto" />
    </View>
  ) 
}


  
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
  },
  main: {
      justifyContent: 'center',
      flex: 1,
  },
});
