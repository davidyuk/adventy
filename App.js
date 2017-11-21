import React from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableHighlight, Image, ListView,
} from 'react-native';
import { Camera, MapView, Font } from 'expo';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.takePicture = this.takePicture.bind(this);
    this.goToPlace = this.goToPlace.bind(this);
    this.state = {
      fontLoaded: false,
      userName: '',
      userPhoto: '',
      place: null,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      'poiret-one': require('./assets/fonts/PoiretOne-Regular.ttf'),
      satisfy: require('./assets/fonts/Satisfy-Regular.ttf'),
      ubuntu: require('./assets/fonts/Ubuntu-Regular.ttf'),
    });
    this.setState({ fontLoaded: true });
  }

  async takePicture() {
    const userPhoto = await this.camera.takePictureAsync();
    this.setState({ userPhoto });
  }

  goToPlace() {
    const { userName, userPhoto } = this.state;
    if (!userName || !userPhoto) return;
    this.setState({ place: {
      address: 'Neybuta, 503',
      participants: [
        { name: userName, photo: userPhoto },
        { name: 'Мишган', photo: userPhoto },
        { name: 'Куропатов', photo: userPhoto },
        { name: 'Вепрь', photo: userPhoto },
      ],
    } });
  }

  renderRegistration() {
    const { userName, userPhoto } = this.state;

    return (
      <View style={styles.centered}>
        <TextInput
          style={styles.nameInput}
          placeholder="What is your name. dude?"
          onChangeText={(userName) => this.setState({ userName })}
          value={userName}
          underlineColorAndroid="transparent"
          placeholderTextColor="#000"
        />
        {userPhoto
          ? <Image style={styles.camera} source={userPhoto} />
          : (
            <View style={styles.centered}>
              <Camera
                style={styles.camera}
                type={Camera.Constants.Type.front}
                ratio="4:3"
                ref={(camera) => { this.camera = camera; }}
              />
              <TouchableHighlight
                onPress={this.takePicture}
                underlayColor="#f7e5f0" activeOpacity={.5}
              >
                <Text style={styles.cameraButton}>Pick your face</Text>
              </TouchableHighlight>
            </View>
          )}
        <TouchableHighlight
          onPress={this.goToPlace}
          underlayColor="#f7e5f0" activeOpacity={.5}
        >
          <Text style={styles.goToPlaceButton}>Ready to go!</Text>
        </TouchableHighlight>
      </View>
    );
  }

  renderPlace() {
    const { place: { address, participants } } = this.state;

    return (
      <View style={styles.centered}>
        <Text style={styles.addressHeader}>And you go to..</Text>
        <Text style={styles.address}>{address}</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 43.10807934723224,
            longitude: 131.91619148879158,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        />
        <Text style={styles.listTitle}>
          Other people hanging out there..
        </Text>
        <ListView
          dataSource={(new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}))
            .cloneWithRows(participants)}
          renderRow={participant => <View style={styles.listItem}>
            <Text style={styles.listItemText}>{participant.name}</Text>
            <Image source={participant.photo} style={styles.listItemImage} />
          </View>}
        />
      </View>
    );
  }

  render() {
    const { fontLoaded, place } = this.state;

    return fontLoaded ? <View style={[styles.centered, styles.container]}>
      <Text style={styles.title}>Adventy</Text>
      <Text style={styles.subTitle}>a random meeting app</Text>
      {place
        ? this.renderPlace()
        : this.renderRegistration()}
    </View> : <Text>Loading...</Text>;
  }
}

const baseMarginVertical = 6;

const buttonStyle = {
  borderWidth: 1,
  borderColor: '#000',
  padding: 6,
  borderRadius: 5,
  textAlign: 'center',
  fontSize: 25,
  marginVertical: baseMarginVertical,
  minWidth: 250,
  fontFamily: 'poiret-one',
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#f7e5f0',
  },
  title: {
    fontSize: 36,
    marginTop: 50,
    textAlign: 'center',
    fontFamily: 'poiret-one',
  },
  subTitle: {
    fontSize: 24,
    marginTop: 6,
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'satisfy',
  },

  nameInput: {
    ...buttonStyle,
    backgroundColor: '#fff',
    width: 320,
  },
  camera: {
    width: 206,
    height: 275,
    marginVertical: baseMarginVertical,
  },
  cameraButton: {
    ...buttonStyle,
    marginVertical: baseMarginVertical,
    backgroundColor: '#e6f6e6',
  },
  goToPlaceButton: {
    ...buttonStyle,
    marginVertical: 50,
    backgroundColor: '#f7fbdc',
  },

  addressHeader: {
    fontSize: 36,
    textAlign: 'center',
    fontFamily: 'poiret-one',
  },
  address: {
    fontSize: 36,
    textAlign: 'center',
    fontFamily: 'ubuntu',
    color: '#47618d',
    marginVertical: 5,
  },
  map: {
    width: 275,
    height: 206,
  },
  listTitle: {
    fontSize: 26,
    marginVertical: 20,
    textAlign: 'center',
    fontFamily: 'poiret-one',
  },
  listItem: {
    width: 280,
    height: 90,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemText: {
    flexGrow: 1,
    fontFamily: 'poiret-one',
    fontSize: 25,
    margin: 5,
  },
  listItemImage: {
    height: 80,
    width: 60,
    margin: 5,
  },
});
