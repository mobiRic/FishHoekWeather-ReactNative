import React from 'react';
import {AsyncStorage, StatusBar, StyleSheet, View} from 'react-native';
import Home from "./app/components/Home";
import {applyMiddleware, compose, createStore} from "redux";
import {reducer} from "./app/redux/DataStore";
import thunk from "redux-thunk";
import {logger} from "redux-logger";
import {Provider} from "react-redux";
import {persistCombineReducers, persistStore} from "redux-persist";

const config = {
  key: 'primary',
  storage: AsyncStorage
}

const store = createStore(
  persistCombineReducers(
    config,
    {rootReducer: reducer},
  ),
  undefined,
  compose(
    applyMiddleware(
      thunk,
      logger
    ),
  )
);

persistStore(
  store,
  null,
  () => {
    console.log("----------------------------");
    console.log(store.getState());
    console.log("----------------------------");
  }
);


export default class App extends React.Component {
  render() {
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
