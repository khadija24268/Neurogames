// App.js
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import styles from './Styles';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

// Import all screens
import Home from './Screens/Home';
import SDMT from './Screens/SDMT';
import TwoFlash from './Screens/TwoFlash';
import TwoFlashStandard from './Screens/TwoFlashStandard'; // Import the new game
import TwoFlashScore from './Screens/TwoFlashScore';
import SDMTScore from './Screens/SDMTScore';
import UserTypeSelection from './Screens/UserTypeSelection';
import PatientSignUp from './Screens/PatientSignUp';
import PatientLogin from './Screens/PatientLogin';
import DoctorLogin from './Screens/DoctorLogin';
import DoctorHome from './Screens/DoctorHome';
import PatientDetails from './Screens/PatientDetails';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('UserTypeSelection');
  const [navigationParams, setNavigationParams] = useState({});

  const navigate = (screenName, params = {}) => {
    setCurrentScreen(screenName);
    setNavigationParams(params);
  };

  const [fontsLoaded] = useFonts({
    'DMSans': require('./assets/fonts/DMSans-VariableFont_opsz,wght.ttf'),
    'DMSansItalic': require('./assets/fonts/DMSans-Italic-VariableFont_opsz,wght.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Handle user state
    });
    return unsubscribe;
  }, []);

  let ScreenComponent;
  switch (currentScreen) {
    case 'Home':
      ScreenComponent = <Home navigate={navigate} />;
      break;
    case 'SDMT':
      ScreenComponent = <SDMT navigate={navigate} />;
      break;
    case 'TwoFlash':
      ScreenComponent = <TwoFlash navigate={navigate} />;
      break;
    case 'TwoFlashStandard':
      ScreenComponent = <TwoFlashStandard navigate={navigate} />;
      break;
    case 'SDMTScore':
      ScreenComponent = <SDMTScore navigate={navigate} route={{ params: navigationParams }} />;
      break;
    case 'TwoFlashScore':
      ScreenComponent = <TwoFlashScore navigate={navigate} route={{ params: navigationParams }} />;
      break;
    case 'UserTypeSelection':
      ScreenComponent = <UserTypeSelection navigate={navigate} />;
      break;
    case 'PatientSignUp':
      ScreenComponent = <PatientSignUp navigate={navigate} />;
      break;
    case 'PatientLogin':
      ScreenComponent = <PatientLogin navigate={navigate} />;
      break;
    case 'DoctorLogin':
      ScreenComponent = <DoctorLogin navigate={navigate} />;
      break;
    case 'DoctorHome':
      ScreenComponent = <DoctorHome navigate={navigate} />;
      break;
    case 'PatientDetails':
      ScreenComponent = <PatientDetails navigate={navigate} route={{ params: navigationParams }} />;
      break;
    default:
      ScreenComponent = <UserTypeSelection navigate={navigate} />;
  }

  return <View style={{ flex: 1 }}>{ScreenComponent}</View>;
}
