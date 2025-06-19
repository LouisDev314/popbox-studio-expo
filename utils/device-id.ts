import * as Application from 'expo-application';
import { Platform } from 'react-native';

const retrieveDeviceId = async () => {
  let deviceId;
  if (Platform.OS === 'ios') {
    deviceId = await Application.getIosIdForVendorAsync();
  } else if (Platform.OS === 'android') {
    deviceId = Application.getAndroidId();
  }
  return deviceId;
};

export default retrieveDeviceId;
