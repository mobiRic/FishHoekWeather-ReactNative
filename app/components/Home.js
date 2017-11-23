import React, {Component} from 'react'
import {Animated, Dimensions, StyleSheet, View} from 'react-native'
import {IndicatorViewPager, PagerTabIndicator} from 'rn-viewpager'
import PageWind from "./PageWind";
import PageBarometer from "./PageBarometer";
import PageTemperature from "./PageTemperature";
import PageRain from "./PageRain";
import {connect} from "react-redux";
import {fetchWeather, onPageSelected} from "../redux/DataStore";
import {bindActionCreators} from "redux";

@connect(
  state => ({
    selectedPage: state.selectedPage,
    rehydrated: state.rehydrated,
  }),
  dispatch => ({
    actions: {
      ...bindActionCreators(
        {onPageSelected, fetchWeather},
        dispatch)
    }
  }),
)

export default class Home extends Component {
  // noinspection JSUnusedGlobalSymbols
  static navigationOptions = {
    // name at the top of the Navigation Bar
    title: 'Fish Hoek Weather',
  };

  constructor(props) {
    super(props);

    this.state = {
      bgOffset: new Animated.Value(0),
    };
    this._setBgOffset = Animated.event([{bgOffset: this.state.bgOffset}]);
    this._bgOffset = this.state.bgOffset.interpolate({
      inputRange: [0, 3],
      outputRange: [0, -500]
    });
  }

  componentWillReceiveProps(nextProps) {
    // delay initialisation until the props are rehydrated
    if (!this.props.rehydrated && nextProps.rehydrated) {
      this.props.actions.fetchWeather();
      if (nextProps.selectedPage) {
        this._setPage(nextProps.selectedPage);
      }
    }
  }

  render() {
    let {width, height} = Dimensions.get('window');
    return (
      <View style={{
        alignSelf: 'stretch',
        flex: 1,
        backgroundColor: 'transparent',
      }}>
        <Animated.Image
          style={{
            position: 'absolute',
            height: height,
            left: this._bgOffset,
            flex: 1,
            resizeMode: 'cover'
          }}
          source={require('../../imgs/background/false_bay.png')}
        />
        <IndicatorViewPager
          style={{flex: 1}}
          ref={(component) => {
            this._viewPager = component
          }}
          indicator={this._renderTabIndicator()}
          onPageScroll={this._onPageScroll.bind(this)}
          onPageSelected={this._onPageSelected.bind(this)}
          scrollEnabled={true}
          initialPage={this.props.selectedPage}
        >
          <View>
            {/*ViewPagerAndroid requires each page to be surrounded by a <View></View> tag*/}
            <PageWind/>
          </View>
          <View>
            <PageTemperature/>
          </View>
          <View>
            <PageBarometer/>
          </View>
          <View>
            <PageRain/>
          </View>
        </IndicatorViewPager>
      </View>
    )
  }

  _onPageScroll(scrollData) {
    let {offset, position} = scrollData;
    if (position < 0 || position >= 3) return;
    this._setBgOffset({bgOffset: offset + position});
  }

  _onPageSelected(nativeEvent) {
    let selectedPage = nativeEvent.position;
    this.props.actions.onPageSelected(selectedPage);
  }

  _setPage(newPage) {
    if (newPage !== this._viewPager._currentIndex) {
      this._viewPager.setPage(newPage);
    }
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