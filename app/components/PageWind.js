import React, {Component} from 'react';
import {Image, ScrollView, StyleSheet, Text} from "react-native";
import {connect} from "react-redux";

const TAG_WIND_KNOTS = " knots";
const TAG_WIND_DEGREES = "&#176;";
const COMPASS_DIRECTIONS =
  ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N",];

@connect(
  state => ({
    weather: state.weather,
  }),
)

export default class PageWind extends Component {

  windSpeed: Number;
  windDir: Number;
  windCompass: String;

  constructor() {
    super();

    this.windSpeed = 0;
    this.windDir = 0;
    this.windCompass = COMPASS_DIRECTIONS[0];
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.weather) {
      this._onWeatherUpdated(nextProps.weather);
    }
  }

  _onWeatherUpdated(weather) {
    if (weather.windSpeed && weather.windDir) {
      this._setWind(weather.windSpeed, weather.windDir);
    }
  }

  _setWind(windSpeedStr, windDirStr) {
    this.windSpeed = this._parseSpeedStr(windSpeedStr);
    this.windDir = this._parseDirStr(windDirStr);
    this.windCompass = this._getCompass(this.windDir);
  }

  _parseSpeedStr(windSpeedStr) {
    const n = windSpeedStr.indexOf(TAG_WIND_KNOTS);
    return windSpeedStr.substring(0, n);
  }

  _parseDirStr(windDirStr) {
    const n = windDirStr.indexOf(TAG_WIND_DEGREES);
    return windDirStr.substring(0, n);
  }

  _getCompass(windDirDegrees) {
    const i = Math.round((parseFloat(windDirDegrees) % 360) / 22.5);
    return COMPASS_DIRECTIONS[i];
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.pageContainer}>
        <Text>{`Wind is ${this.windSpeed} knots from ${this.windDir}° (${this.windCompass})`}</Text>
        <Image
          style={styles.widget}
          source={require('../../imgs/widgets/windrose.png')}>
          <Image
            style={styles.widget}
            transform={[{rotate: `${this.windDir}deg`}]}
            source={require('../../imgs/widgets/arrow_wind_direction.png')}
          />
        </Image>
        <Text>24 hour wind speed</Text>
        <Image
          style={styles.graph}
          source={require('../../imgs/graphs/daywind.png')}/>
        <Text>24 hour wind direction</Text>
        <Image
          style={styles.graph}
          source={require('../../imgs/graphs/daywinddir.png')}/>
        <Text>7 day wind speed</Text>
        <Image
          style={styles.graph}
          source={require('../../imgs/graphs/weekwind.png')}/>
        <Text>7 day wind direction</Text>
        <Image
          style={styles.graph}
          source={require('../../imgs/graphs/weekwinddir.png')}/>
      </ScrollView>
    );
  }

};


const styles = StyleSheet.create({
  pageContainer: {
    alignItems: 'center',
    paddingTop: 38,
    paddingBottom: 16,
  },
  widget: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  graph: {
    flex: 1,
    resizeMode: 'contain',
  },
});
