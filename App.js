import React from 'react';
import {AsyncStorage, StatusBar, StyleSheet, View} from 'react-native';
import Home from "./app/components/Home";
import {applyMiddleware, compose, createStore} from "redux";
import {INITIAL_STATE, reducer} from "./app/redux/DataStore";
import thunk from "redux-thunk";
import {logger} from "redux-logger";
import {autoRehydrate, persistStore} from "redux-persist";
import {Provider} from "react-redux";

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
    backgroundColor: '#f0f',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
