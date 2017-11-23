import React from 'react';
import {AsyncStorage, StatusBar, StyleSheet, View} from 'react-native';
import Home from "./app/components/Home";
import {applyMiddleware, compose, createStore} from "redux";
import {INITIAL_STATE, reducer} from "./app/redux/DataStore";
import thunk from "redux-thunk";
import {logger} from "redux-logger";
import {autoRehydrate, persistStore} from "redux-persist";
import {Provider} from "react-redux";
import {AppLoading, Asset} from "expo";
import * as Images from "./app/Images";

const store = createStore(
  reducer,
  INITIAL_STATE,  // possibly use undefined here instead
  compose(
    applyMiddleware(
      thunk,
      logger
    ),
    autoRehydrate()
  )
);

persistStore(store, {storage: AsyncStorage});

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class App extends React.Component {
  state = {
    isReady: false,
  };

  async _loadAssetsAsync() {
    const imageAssets = cacheImages([
      Images.WIND_GAUGE,
      Images.WIND_ARROW,
      Images.THERMOMETER,
      Images.BAROMETER,
      Images.BAROMETER_ARROW,
      Images.RAIN_GAUGE,
      Images.LOCAL_DAY_WIND,
      Images.LOCAL_DAY_WIND_DIR,
      Images.LOCAL_WEEK_WIND,
      Images.LOCAL_WEEK_WIND_DIR,
      Images.LOCAL_DAY_TEMP_DEW,
      Images.LOCAL_WEEK_TEMP_DEW,
      Images.LOCAL_DAY_BAROMETER,
      Images.LOCAL_WEEK_BAROMETER,
      Images.LOCAL_DAY_RAIN,
      Images.LOCAL_MONTH_RAIN,
    ]);

    await Promise.all([...imageAssets]);
  }

  render() {
    if (!this.state.isReady) {
      console.log("Loading..................");
      return (
        <AppLoading
          startAsync={this._loadAssetsAsync}
          onFinish={() => {
            this.setState({isReady: true});
            console.log("READY!");
          }}
          onError={console.warn}
        />
      );
    }

    return (
      <Provider store={store}>
        <View style={styles.container}>
          <StatusBar
            backgroundColor="red"
            barStyle="light-content"
            hidden={false}
          />
          <Home/>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
