import React from 'react';
import {Image, ScrollView, StyleSheet, Text} from "react-native";
import {connect} from "react-redux";
import AStyledWeatherPage, {SharedWeatherPageStyles} from "./AStyledWeatherPage";
import {DAY_BAROMETER, WEEK_BAROMETER} from "../redux/DataStore";

/**
 * Assumed maximum pressure the barometer will show.
 */
const MAX_PRESSURE_MBARS = 1050;
/**
 * Assumed minimum pressure the barometer will show.
 */
const MIN_PRESSURE_MBARS = 950;
const TAG_BAROMETER_PRESSURE = " mbar";

@connect(
  state => ({
    weather: state.weather,
  }),
)

export default class PageBarometer extends AStyledWeatherPage {

  pressure: Number;
  degrees: Number;

  constructor() {
    super();

    this.pressure = MIN_PRESSURE_MBARS;
    this.degrees = this._calcDegreesForPressure(this.pressure);
  }

  _onWeatherUpdated(weather) {
    if (weather.barometer) {
      this._setPressure(weather.barometer);
    }
  }

  _setPressure(barometer) {
    this.pressure = this._parsePressureStr(barometer);
    this.degrees = this._calcDegreesForPressure(this.pressure);
  }

  _parsePressureStr(barometer) {
    const n = barometer.indexOf(TAG_BAROMETER_PRESSURE);
    return barometer.substring(0, n);
  }

  /**
   * Calculates the angle of the barometer arrow for a given pressure.
   *
   * @param mBars barometer pressure
   * @return angle for the arrow
   */
  _calcDegreesForPressure(mBars) {
    let degrees =
      (mBars - MIN_PRESSURE_MBARS) * 360 / (MAX_PRESSURE_MBARS - MIN_PRESSURE_MBARS);
    return degrees;
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.pageContainer}>
        <Text>{`Pressure is ${this.pressure} mbar`}</Text>
        <Image
          style={styles.widget}
          source={require('../../imgs/widgets/barometer.png')}>
          <Image
            style={styles.widget}
            transform={[{rotate: `${this.degrees}deg`}]}
            source={require('../../imgs/widgets/arrow_barometer.png')}
          />
        </Image>
        <Text>24 hour barometer</Text>
        <Image
          style={styles.graph}
          source={this.getImage(DAY_BAROMETER)}/>
        <Text>7 day barometer</Text>
        <Image
          style={styles.graph}
          source={this.getImage(WEEK_BAROMETER)}/>
      </ScrollView>
    );
  }

};


const styles = StyleSheet.create({
  ...SharedWeatherPageStyles,
});
