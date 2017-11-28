import React from 'react';
import {AsyncStorage, StatusBar} from 'react-native';
import Home from "./app/components/Home";
import {applyMiddleware, compose, createStore} from "redux";
import {reducer} from "./app/redux/DataStore";
import thunk from "redux-thunk";
import {logger} from "redux-logger";
import {Provider} from "react-redux";
import {StackNavigator} from 'react-navigation';
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
      logger
    ),
  )
);

const persistor = persistStore(
  store,
  null,
  () => {
  }
);


/**
 * Define the navigation roots as children of the Navigation Bar.
 */
const RootNavigator = StackNavigator({
    Home: {screen: Home},
  },
  {
    // default options for all screens - can be overridden
    navigationOptions: {
      headerTintColor: 'blue',
      headerStyle: {
        // this prevents the Navigation Bar from going behind the Status Bar
        marginTop: StatusBar.currentHeight,
      },
    },
  },
);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate
          onBeforeLift={Images.loadAssetsAsync}
          persistor={persistor}
        >
          <RootNavigator/>
        </PersistGate>
      </Provider>
    );
  }
};
