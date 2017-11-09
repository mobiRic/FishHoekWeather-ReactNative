import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import TabIndicatorPage from "./app/pages/TabIndicatorPage";

export default class App extends React.Component {
  render() {
    console.log("render");

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="red"
          barStyle="light-content"
          hidden={false}
        />
        <TabIndicatorPage/>
      </View>
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
