import AsyncStorage from '@react-native-async-storage/async-storage';
const PrefManager = {
  setValue: function (key, value) {
    AsyncStorage.setItem(key, value);
  },
  getValue: async key => {
    let value = '';
    try {
      value = (await AsyncStorage.getItem(key)) || '';
    } catch (error) {}
    return value ? value : value;
  },
  removeValue: async key => {
    await AsyncStorage.removeItem(key);
  },
};
export default PrefManager;
