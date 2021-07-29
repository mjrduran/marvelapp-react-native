/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, View, StyleSheet, Text} from 'react-native';
import {Provider} from 'react-redux';
import store from './src/redux';
import Home from './src/screens/Home/Home';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <SafeAreaView style={styles.container}>
          <View>
            <Home />
          </View>
        </SafeAreaView>
      </Provider>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
