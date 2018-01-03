import React from 'react';
import {
  StyleSheet,
  Text,
  Animated,
  View,
  Image,
  Alert,
  Easing,
  Button
} from 'react-native';
import {
  StackNavigator
} from 'react-navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff'
  },
  image: {
    width: 200,
    height: 200,
    borderWidth: 5,
    borderColor: '#fff',
    marginTop: 30
  }
});

class MyText extends React.Component {
  render () {
    return (
      <Text style={styles.text}>{this.props.content}</Text>
    )
  }
}

class HomeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fadeAnim: new Animated.Value(0)
    }
  }

  componentDidMount () {
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 2000
    }).start()
  }

  render() {
    return (
      <Animated.View style={styles.container} opacity={this.state.fadeAnim}>
        <MyText content='Welcome Fenrir' />
        <Image
          source={{uri: 'https://www.zooportraits.com/wp-content/uploads/2017/10/Gray-Wolf-Canis-Lupus.jpg'}}
          style={styles.image}
        />
        <Button
          onPress={() => this.props.navigation.navigate('Inner', { param: 'paramValue'})}
          title='Enter'
          style={{ backgroundColor: '#f80', color: '#fff'}}
        />
      </Animated.View>
    );
  }
}

class InnerScreen extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          The Inside World
        </Text>
        <Button
          onPress={() => this.props.navigation.goBack()}
          title='Go Back?'
          style={{ backgroundColor: '#c10', color: '#fff'}}
        />
      </View>
    )
  }
}

export default App = StackNavigator({
  Home: { screen: HomeScreen },
  Inner: { screen: InnerScreen }
}, { headerMode: 'none' })
