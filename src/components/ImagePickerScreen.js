import React, { Component } from 'react';
import {
  Image,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Ocr from 'react-native-tesseract-ocr';
import styles from '../../styles';

const Button = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableOpacity;

const imagePickerOptions = {
  quality: 1.0,
  storageOptions: {
    skipBackup: true,
  },
};
const tessOptions = {
  whitelist: null,
  blacklist: null
};

class ImagePickerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSource: null,
      text: ''
    };
    this.selectImage = this.selectImage.bind(this);
  }

  selectImage() {

    ImagePicker.showImagePicker(imagePickerOptions, (response) => {
      if (!response.didCancel) {
        const source = { uri: response.uri };
        this.setState({ imageSource: source });
        this.extractText(response.path);
      }
    });
  }

  extractText(imgPath) {
    Ocr.recognize(imgPath, 'LANG_ENGLISH', tessOptions)
    .then((res) => this.setState({ text: res }));
  }

  render() {
    const { imageSource } = this.state;
    return (
      <View style={styles.container}>
        <Button onPress={this.selectImage} >
          <View style={[styles.image, styles.imageContainer, !imageSource && styles.rounded]}>
            {
              imageSource === null
                ? <Text>Tap me!</Text>
                : <Image style={styles.image} source={imageSource} />
            }
          </View>
        </Button>
        <Text>{this.state.text}</Text>
      </View>
    );
  }
}

ImagePickerScreen.navigationOptions = {
  title: 'Image Picker Example',
};

export default ImagePickerScreen;
