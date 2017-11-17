import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from "react-native";
import {connect} from "react-redux";
import AStyledWeatherPage, {SharedWeatherPageStyles} from "./AStyledWeatherPage";
import {DAY_RAIN, fetchWeather, MONTH_RAIN} from "../redux/DataStore";
import bindActionCreators from "redux/es/bindActionCreators";

/**
 * Assumed maximum rain rate the meter will show.
 */
const MAX_RAIN_RANGE = 15;
/**
 * Assumed minimum rain rate the meter will show.
 */
const NO_RAIN = parseFloat(0.0);
const MIN_RAIN_RANGE = NO_RAIN;
const TAG_RAIN_MILLIS = " mm/hr";

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

export default class PageRain extends AStyledWeatherPage {

  rainMillis: Number;
  offset: Number;
  rainTitle: String;

  constructor() {
    super();

    this.rainMillis = MIN_RAIN_RANGE;
    this.offset = this._calcOffsetForRain(this.rainMillis);
    if (parseFloat(this.rainMillis) === NO_RAIN) {
      this.rainTitle = "No rain";
    } else {
      this.rainTitle = `Raining at ${this.rainMillis} mm/hr`;
    }
  }

  _onWeatherUpdated(weather) {
    if (weather.rainRateNow) {
      this._setRain(weather.rainRateNow);
    }
  }

  _setRain(rainRate) {
    this.rainMillis = this._parseRainStr(rainRate);
    this.offset = this._calcOffsetForRain(this.rainMillis);
  }

  _parseRainStr(outTempStr) {
    const n = outTempStr.indexOf(TAG_RAIN_MILLIS);
    return outTempStr.substring(0, n);
  }

  /**
   * Calculates the offset of the blue rain meter background view, based on a given rain rate.
   *
   * @param millis rain rate mm/hr
   * @return offset for the view
   */
  _calcOffsetForRain(millis) {
    let heightBlue =
      (millis - MIN_RAIN_RANGE) * 200
      / (MAX_RAIN_RANGE - MIN_RAIN_RANGE);
    let topOffset = 200 - heightBlue;
    return topOffset;
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={styles.pageContainer}
        refreshControl={this._getRefreshControl()}
      >
        <Text>{this.rainTitle}</Text>
        <View style={styles.widgetBackground}>
          <Image
            style={styles.tintableBackground}
            tintColor={'#1ab6d7'}
            transform={[{translateY: this.offset}]}
            source={require('../../imgs/widgets/tintable_background.png')}>
            <Image
              style={styles.widget}
              source={require('../../imgs/widgets/raindrop.png')}
            />
          </Image>
        </View>
        <Text>24 hour rain</Text>
        <Image
          style={styles.graph}
          source={this.getImage(DAY_RAIN)}/>
        <Text>30 day rain</Text>
        <Image
          style={styles.graph}
          source={this.getImage(MONTH_RAIN)}/>
      </ScrollView>
    );
  }

};


const styles = StyleSheet.create({
  ...SharedWeatherPageStyles,
  widgetBackground: {
    width: 200,
    height: 200,
    backgroundColor: '#cccccc',
  },
  tintableBackground: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
