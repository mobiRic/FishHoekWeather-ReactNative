import React, {Component} from 'react';
import {Image, ScrollView, StyleSheet, Text} from "react-native";

/**
 * Assumed maximum pressure the barometer will show.
 */
const MAX_PRESSURE_MBARS = 1050;
/**
 * Assumed minimum pressure the barometer will show.
 */
const MIN_PRESSURE_MBARS = 950;

export default class PageBarometer extends Component {

  pressure: Number;
  degrees: Number;

  constructor() {
    super();

    this.pressure = 1040;
    this.degrees = this.calcDegreesForPressure(this.pressure);
  }

  /**
   * Calculates the angle of the barometer arrow for a given pressure.
   *
   * @param mBars barometer pressure
   * @return angle for the arrow
   */
  calcDegreesForPressure(mBars) {
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
          source={require('../../imgs/graphs/daybarometer.png')}/>
        <Text>7 day barometer</Text>
        <Image
          style={styles.graph}
          source={require('../../imgs/graphs/weekbarometer.png')}/>
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