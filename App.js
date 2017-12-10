import React from 'react';
import {AsyncStorage, StatusBar, StyleSheet, View} from 'react-native';
import Home from "./app/components/screens/Home";
import {applyMiddleware, compose, createStore} from "redux";
import {reducer} from "./app/redux/DataStore";
import thunk from "redux-thunk";
import {logger} from "redux-logger";
import {Provider} from "react-redux";
import * as Images from "./app/Images";
import {persistCombineReducers, persistStore} from "redux-persist";
import {PersistGate} from "redux-persist/es/integration/react";

const config = {
  key: 'primary',
  storage: AsyncStorage
};

const store = createStore(
  persistCombineReducers(
    config,
    {rootReducer: reducer},
  ),
  undefined,
  compose(
    applyMiddleware(
      thunk,
      // logger
    ),
  )
);

const persistor = persistStore(
  store,
  null,
  () => {
  }
);

function DelayPromise(delay) {
  //return a function that accepts a single variable
  return function (data) {
    //this function returns a promise.
    return new Promise(function (resolve, reject) {
      console.log("Promising");
      setTimeout(function () {
        console.log("Timeout");
        //a promise that is resolved after "delay" milliseconds with the data provided
        resolve(data);
      }, delay);
    });
  }
}

export default class App extends React.Component {
  state = {
    isReady: false,
  };

  render() {
    return (
      <Provider store={store}>
        <PersistGate
          onBeforeLift={Images.loadAssetsAsync}
          persistor={persistor}
        >
          <View style={styles.container}>
            <StatusBar
              backgroundColor="red"
              barStyle="light-content"
              hidden={false}
            />
            <Home/>
          </View>
        </PersistGate>
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
