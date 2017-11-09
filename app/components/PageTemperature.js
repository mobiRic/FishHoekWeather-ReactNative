import React, {Component} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from "react-native";

/**
 * Assumed maximum temperature the thermometer will show.
 */
const MAX_TEMP_RANGE = 40;
/**
 * Assumed minimum temperature the thermometer will show.
 */
const MIN_TEMP_RANGE = -15;

export default class PageTemperature extends Component {

  temperature: Number;
  offset: Number;

  constructor() {
    super();

    this.temperature = 18.6;
    this.offset = this.calcOffsetForDegrees(this.temperature);
  }

  /**
   * Calculates the offset of the red thermometer background view, based on a given temperature.
   *
   * @param degrees temperature
   * @return offset for the view
   */
  calcOffsetForDegrees(degrees) {
    let heightRed =
      (degrees - MIN_TEMP_RANGE) * 200
      / (MAX_TEMP_RANGE - MIN_TEMP_RANGE);
    let topOffset = 200 - heightRed;
    return topOffset;
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.pageContainer}>
        <Text>{`Temperature is ${this.temperature}°C`}</Text>
        <View style={styles.widgetBackground}>
          <Image
            style={styles.tintableBackground}
            tintColor={'#fb0000'}
            transform={[{translateY: this.offset}]}
            source={require('../../imgs/widgets/tintable_background.png')}>
            <Image
              style={styles.widget}
              source={require('../../imgs/widgets/thermometer.png')}
            />
          </Image>
        </View>
        <Text>24 hour temperature</Text>
        <Image
          style={styles.graph}
          source={require('../../imgs/graphs/daytempdew.png')}/>
        <Text>7 day temperature</Text>
        <Image
          style={styles.graph}
          source={require('../../imgs/graphs/weektempdew.png')}/>
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