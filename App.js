import React from 'react';
import {AsyncStorage, StatusBar} from 'react-native';
import {applyMiddleware, compose, createStore} from "redux";
import {INITIAL_STATE, reducer} from "./app/redux/DataStore";
import thunk from "redux-thunk";
import {logger} from "redux-logger";
import {autoRehydrate, persistStore} from "redux-persist";
import {Provider} from "react-redux";
import {StackNavigator} from 'react-navigation';
import Home from "./app/components/Home";

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
        <RootNavigator/>
      </Provider>
    );
  }
};