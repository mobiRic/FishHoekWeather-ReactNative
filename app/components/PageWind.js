import React, {Component} from 'react';
import {Image, ScrollView, StyleSheet, Text} from "react-native";

export default class PageWind extends Component {

  windSpeed: Number;
  windDir: Number;

  constructor() {
    super();

    this.windSpeed = 18.3;
    this.windDir = 283;
  }


  render() {
    return (
      <ScrollView contentContainerStyle={styles.pageContainer}>
        <Text>{`Wind is ${this.windSpeed} knots from ${this.windDir}° (SSE)`}</Text>
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
