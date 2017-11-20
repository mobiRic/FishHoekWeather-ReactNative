import React from 'react';
import {Image, RefreshControl, ScrollView, StyleSheet, Text} from "react-native";
import AStyledWeatherPage, {SharedWeatherPageStyles} from "./AStyledWeatherPage";
import {connect} from "react-redux";
import {DAY_WIND, DAY_WIND_DIR, fetchWeather, WEEK_WIND, WEEK_WIND_DIR} from "../redux/DataStore";
import {bindActionCreators} from "redux";

const TAG_WIND_KNOTS = " knots";
const TAG_WIND_DEGREES = "&#176;";
const COMPASS_DIRECTIONS =
  ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N",];

@connect(
  state => ({
    weather: state.weather,
    lastUpdated: state.lastUpdated,
    cacheBuster: state.cacheBuster,
    refreshing: state.refreshing,
  }),
  dispatch => ({
    actions: {
      ...bindActionCreators(
        {fetchWeather},
        dispatch)
    }
  }),
)

export default class PageWind extends AStyledWeatherPage {

  windSpeed: Number;
  windDir: Number;
  windCompass: String;

  constructor() {
    super();

    this.windSpeed = 0;
    this.windDir = 0;
    this.windCompass = COMPASS_DIRECTIONS[0];
  }

  _onWeatherUpdated(weather) {
    if (weather.windSpeed && weather.windDir) {
      this._setWind(weather.windSpeed, weather.windDir);
    }
  }

  _setWind(windSpeedStr, windDirStr) {
    this.windSpeed = this._parseSpeedStr(windSpeedStr);

    const realWindDir = parseFloat(this._parseDirStr(windDirStr));
    const fakeWindDir = parseFloat(realWindDir + ((Math.random() * 90) - 45));
    console.log(`Mapping wind ${realWindDir} --> ${fakeWindDir}`);
    this.windDir = fakeWindDir;

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
      <ScrollView
        contentContainerStyle={styles.pageContainer}
        refreshControl={this._getRefreshControl()}
      >
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
          source={this.getImage(DAY_WIND)}/>
        <Text>24 hour wind direction</Text>
        <Image
          style={styles.graph}
          source={this.getImage(DAY_WIND_DIR)}/>
        <Text>7 day wind speed</Text>
        <Image
          style={styles.graph}
          source={this.getImage(WEEK_WIND)}/>
        <Text>7 day wind direction</Text>
        <Image
          style={styles.graph}
          source={this.getImage(WEEK_WIND_DIR)}/>
      </ScrollView>
    );
  }

};


const styles = StyleSheet.create({
  ...SharedWeatherPageStyles,
});