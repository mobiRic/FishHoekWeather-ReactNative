import React from 'react';
import {Animated, Image, ImageBackground, ScrollView, StyleSheet, Text} from "react-native";
import {connect} from "react-redux";
import AStyledWeatherPage, {SharedWeatherPageStyles} from "./AStyledWeatherPage";
import {DAY_BAROMETER, fetchWeather, WEEK_BAROMETER} from "../redux/DataStore";
import bindActionCreators from "redux/es/bindActionCreators";

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
    weather: state.rootReducer.weather,
    lastUpdated: state.rootReducer.lastUpdated,
    cacheBuster: state.rootReducer.cacheBuster,
    refreshing: state.rootReducer.refreshing,
  }),
  dispatch => ({
    actions: {
      ...bindActionCreators(
        {fetchWeather},
        dispatch)
    }
  }),
)

export default class PageBarometer extends AStyledWeatherPage {

  pressure: Number;

  constructor() {
    super();

    // weather
    this.pressure = MIN_PRESSURE_MBARS;

    // animation
    this.previousAnimationEndValue = MIN_PRESSURE_MBARS;
    this._initAnimation();
  }

  _initAnimation() {
    if (this.animatedValue) {
      this.animatedValue.stopAnimation((value) => {
        this.previousAnimationEndValue = value;
      });
    }
    this.animatedValue = new Animated.Value(this.previousAnimationEndValue);
    this.interpolator = this.animatedValue.interpolate({
      inputRange: [MIN_PRESSURE_MBARS, MAX_PRESSURE_MBARS],
      outputRange: ['0deg', '360deg']
    });
  }

  _animateTo(toDegrees) {
    if (this.previousAnimationEndValue === toDegrees) {
      return;
    }

    this._initAnimation();
    Animated.timing(
      this.animatedValue,
      {
        toValue: toDegrees,
        duration: this.ANIMATION_DURATION,
        useNativeDriver: false,
      }
    ).start(() => {
      this.previousAnimationEndValue = toDegrees;
    });
  }

  _onWeatherUpdated(weather) {
    if (weather.barometer) {
      this._setPressure(weather.barometer);
    }
  }

  _setPressure(barometer) {
    this.pressure = this._parsePressureStr(barometer);
    this._animateTo(parseFloat(this.pressure));
  }

  _parsePressureStr(barometer) {
    const n = barometer.indexOf(TAG_BAROMETER_PRESSURE);
    return barometer.substring(0, n);
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={styles.pageContainer}
        refreshControl={this._getRefreshControl()}
      >
        <Text>{`Pressure is ${this.pressure} mbar`}</Text>
        <ImageBackground
          style={styles.widget}
          source={require('../../imgs/widgets/barometer.png')}>
          <Animated.Image
            style={[
              styles.widget,
              {transform: [{rotate: this.interpolator}]}
            ]}
            source={require('../../imgs/widgets/arrow_barometer.png')}
          />
        </ImageBackground>
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
