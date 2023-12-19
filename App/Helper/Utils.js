import NetInfo from '@react-native-community/netinfo';
import {Alert, Platform} from 'react-native';
import PrefManager from './PrefManager';

export default class Utils {
  static isConnected = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        return true;
      } else {
        Alert.alert('Alert', 'Not internet connection available', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      }
    });
  };

  static setCurrentUser = async loginUser => {
    PrefManager.setValue('@user', loginUser);
  };

  static getCurrentUser = async () => {
    try {
      let user = (await PrefManager.getValue('@user'))
        ? JSON.parse(PrefManager.getValue('@user'))
        : null;
      return user;
    } catch (error) {
      console.log('getCurrentUser catch >>> ', error);
    }
  };

  static setCurrentUserToken = async token => {
    console.log('token==> ' + JSON.stringify(token));
    PrefManager.setValue('@token', token);
    console.log('Saved token >>>>>>>>> ', token);
  };

  static getCurrentUserToken = async () => {
    let token = PrefManager.getValue('@token');
    console.log('get token==>', token);
    return token;
  };

  static async isNetworkAvailable() {
    const response = await NetInfo.fetch();
    try {
      return response.isConnected;
    } catch {
      Alert.alert('Alert', 'Please Connect Your Internet Connections');
    }
  }

  static DialogBox = (text, text1) => {
    setTimeout(
      () => {
        Alert.alert('', text1, [{text: 'OK', onPress: () => {}}]);
      },
      Platform.OS === 'ios' ? 500 : 0,
    );
  };

  static isValidEmailAddress = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
  };

  static isStringNull = text => {
    if (text === null || text === '' || text === '[]' || text === 'null') {
      return true;
    } else {
      return false;
    }
  };

  static convertHMS = value => {
    const sec = parseInt(value * 60, 10); // convert value to number if it's string
    let hours = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
    let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 1) {
      minutes = '0' + minutes;
    }
    if (seconds < 1) {
      seconds = '0' + seconds;
    }

    let date =
      hours > 0 ? hours + ' hr ' + minutes + ' mins' : minutes + ' mins';
    return date; // Return is  HH : MM : SS
  };

  static isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  static validatePhoneNumber = enteredPhonenumber => {
    let reg = /^[0-9]{10}$/;
    if (reg.test(enteredPhonenumber) === false) {
      return false;
    } else {
      return true;
    }
  };

  static isPasswordValid = password => {
    let passwordTest = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{7,}$/;
    if (passwordTest.test(password) === false) {
      return false;
    } else {
      return true;
    }
  };

  static isNameValid = name => {
    let nameTest = /^[a-zA-Z ]{2,40}$/;
    if (nameTest.test(name) === false) {
      return false;
    } else {
      return true;
    }
  };

  static validConfirmpassword = (password, confirmpassword) => {
    if (password != confirmpassword) {
      return false;
    } else {
      return true;
    }
  };
}
