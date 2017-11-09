/**
 * Created by tangzhibin on 16/3/24.
 */


'use strict';

import React, {Component} from 'react'
import {Animated, StyleSheet, View} from 'react-native'
import {IndicatorViewPager, PagerTabIndicator} from 'rn-viewpager'
import {TrianglePagerView} from '../components/PagerItemView'
import PageWind from "../components/PageWind";
import PageBarometer from "../components/PageBarometer";
import PageTemperature from "../components/PageTemperature";

export default class TabIndicatorPage extends Component {
  state = {
    bgColor: new Animated.Value(0)
  };

  _setBgColor = Animated.event([{bgColor: this.state.bgColor}]);

  _bgColor = this.state.bgColor.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: ['hsl(187, 74%, 47%)', 'hsl(89, 47%, 54%)', 'hsl(12, 97%, 59%)', 'hsl(120, 60%, 47%)']
  });

  render() {
    return (
      <Animated.View style={{alignSelf: 'stretch', flex: 1, backgroundColor: this._bgColor}}>

        <IndicatorViewPager
          style={{flex: 1}}
          indicator={this._renderTabIndicator()}
          onPageScroll={this._onPageScroll.bind(this)}
          scrollEnabled={true}
          initialPage={0}
        >
          <View>
            <PageWind/>
          </View>
          <View>
            <PageTemperature/>
          </View>
          <View>
            <PageBarometer/>
          </View>
          {TrianglePagerView()}
        </IndicatorViewPager>
      </Animated.View>
    )
  }

  _onPageScroll(scrollData) {
    let {offset, position} = scrollData;
    if (position < 0 || position >= 3) return;
    this._setBgColor({bgColor: offset + position});
  }

  _renderTabIndicator() {
    let tabs = [
      {
        text: 'Wind',
        iconSource: require('../../imgs/ic_tab_wind.png'),
        selectedIconSource: require('../../imgs/ic_tab_wind.png')
      },
      {
        text: 'Temp',
        iconSource: require('../../imgs/ic_tab_temp.png'),
        selectedIconSource: require('../../imgs/ic_tab_temp.png')
      },
      {
        text: 'Baro',
        iconSource: require('../../imgs/ic_tab_baro.png'),
        selectedIconSource: require('../../imgs/ic_tab_baro.png')
      },
      {
        text: 'Rain',
        iconSource: require('../../imgs/ic_tab_rain.png'),
        selectedIconSource: require('../../imgs/ic_tab_rain.png')
      }
    ];
    return (
      <PagerTabIndicator
        style={styles.indicatorContainer}
        iconStyle={styles.tabIcon}
        selectedIconStyle={styles.selectedTabIcon}
        textStyle={styles.tabTxt}
        selectedTextStyle={styles.selectedTabTxt}
        itemStyle={styles.tabItem}
        selectedItemStyle={styles.selectedTabItem}
        tabs={tabs}
      />
    );
  }

}

const styles = StyleSheet.create({
  indicatorContainer: {
    backgroundColor: 0xFFFFFFFF,
    borderTopWidth: 0,
    height: 64,
    paddingTop: 0,
    paddingBottom: 0
  },
  tabIcon: {
    width: 24,
    height: 32,
    tintColor: '#7F8C8D',
    resizeMode: 'contain'
  },
  selectedTabIcon: {
    width: 32,
    height: 32,
    tintColor: '#2C3E50',
    resizeMode: 'contain'
  },
  tabTxt: {
    color: '#34495E',
    marginTop: 0,
    fontSize: 10.5
  },
  selectedTabTxt: {
    color: '#2C3E50',
    marginTop: 0,
    fontSize: 12
  },
  tabItem: {
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingTop: 8
  },
  selectedTabItem: {
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingTop: 6
  }

});