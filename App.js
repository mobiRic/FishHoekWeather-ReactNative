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

export default class App extends React.Component {
  state = {
    isReady: false,
  };

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={Images.loadAssetsAsync}
          onFinish={() => {
            this.setState({isReady: true});
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
