import React, {Component} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from "react-native";
import {connect} from "react-redux";

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
  }),
)

export default class PageRain extends Component {

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.weather) {
      this._onWeatherUpdated(nextProps.weather);
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
      <ScrollView contentContainerStyle={styles.pageContainer}>
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
          source={require('../../imgs/graphs/dayrain.png')}/>
        <Text>30 day rain</Text>
        <Image
          style={styles.graph}
          source={require('../../imgs/graphs/monthrain.png')}/>
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
