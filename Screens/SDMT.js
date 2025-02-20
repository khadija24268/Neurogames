// Screens/SDMT.js
import React, { useState, useEffect } from 'react';
import { View, BackHandler, Alert } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import GameBar from '../Components/GameBar';
import NumKey from '../Components/NumKey';
import Box from '../Components/Box';
import RandomSym from '../Components/RandomSym';
import styles from '../Styles';
import { firestore, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function SDMT({ navigate }) {
  // State variables
  const [score, setScore] = useState(0);
  const [boxNum, setBoxNum] = useState(0);
  const [round, setRound] = useState(1);
  const [errors, setErrors] = useState(0);
  const [prevTime, setPrevTime] = useState(60);
  const [times, setTimes] = useState([]);
  const [nextRoundPoss, setNextRoundPoss] = useState(false);
  const [title, setTitle] = useState('S.D.M.T - Round ');
  const [color, setColor] = useState('#C8C8C8');
  const [colortxt, setColortxt] = useState('#5A5A5A');
  const [numKeyPressed, setNumKeyPressed] = useState(['', '', '', '', '']);
  const [myDuration, setMyDuration] = useState(60);
  const [symbols, setSymbols] = useState([]);
  const [displaySymbols, setDisplaySymbols] = useState([]);
  const [gameEnded, setGameEnded] = useState(false);

  // Per-round correct/incorrect
  const [currentRoundCorrect, setCurrentRoundCorrect] = useState(0);
  const [currentRoundIncorrect, setCurrentRoundIncorrect] = useState(0);

  // Store per-round results
  const [perRoundResults, setPerRoundResults] = useState([]);

  useEffect(() => {
    // Lock orientation to landscape
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };
    lockOrientation();

    // Disable back button on Android
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    // Initialize symbols
    const randomSym = new RandomSym();
    setSymbols(randomSym.symbols);
    setDisplaySymbols(randomSym.displaySymbols);

    // Start countdown
    const timer = setInterval(() => {
      setMyDuration((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      backHandler.remove();
      ScreenOrientation.unlockAsync(); // optional: unlock on exit
    };
  }, []);

  // Check if time is up
  useEffect(() => {
    if (myDuration <= 0 && !gameEnded) {
      saveGameResults(perRoundResults);
    }
  }, [myDuration, gameEnded]);

  // Update button color based on input completion
  useEffect(() => {
    if (!numKeyPressed.includes('')) {
      setColor('#679186');
      setColortxt('#FDEBD3');
      setNextRoundPoss(true);
    } else {
      setColor('#C8C8C8');
      setColortxt('#5A5A5A');
      setNextRoundPoss(false);
    }
  }, [numKeyPressed]);

  // Handle number key press
  const handleNumKeyPress = (num) => {
    if (boxNum < 5) {
      const newNumKeyPressed = [...numKeyPressed];
      newNumKeyPressed[boxNum] = num;
      setNumKeyPressed(newNumKeyPressed);

      if (displaySymbols[boxNum].n === num) {
        setCurrentRoundCorrect((prev) => prev + 1);
      } else {
        setErrors((prev) => prev + 1);
        setCurrentRoundIncorrect((prev) => prev + 1);
      }
      setBoxNum((prev) => prev + 1);
    }
  };

  // Handle delete key press
  const handleDelPress = () => {
    if (boxNum > 0) {
      const newBoxNum = boxNum - 1;
      const deletedNum = numKeyPressed[newBoxNum];
      const isCorrect = displaySymbols[newBoxNum].n === deletedNum;

      if (isCorrect) {
        setCurrentRoundCorrect((prev) => prev - 1);
      } else {
        setErrors((prev) => (prev > 0 ? prev - 1 : 0));
        setCurrentRoundIncorrect((prev) => prev - 1);
      }

      const newNumKeyPressed = [...numKeyPressed];
      newNumKeyPressed[newBoxNum] = '';
      setNumKeyPressed(newNumKeyPressed);
      setBoxNum(newBoxNum);
    }
  };

  // Handle continue button press
  const handleContinuePress = () => {
    if (nextRoundPoss) {
      const timeTaken = prevTime - myDuration;
      setPerRoundResults((prevResults) => [
        ...prevResults,
        {
          round: round,
          timeTaken: timeTaken,
          correct: currentRoundCorrect,
          incorrect: currentRoundIncorrect,
        },
      ]);

      // Reset per-round counts
      setCurrentRoundCorrect(0);
      setCurrentRoundIncorrect(0);

      // Prepare next round
      const randomSym = new RandomSym();
      setSymbols(randomSym.symbols);
      setDisplaySymbols(randomSym.displaySymbols);
      setNumKeyPressed(['', '', '', '', '']);
      setBoxNum(0);
      setTimes((prev) => [...prev, timeTaken]);
      setPrevTime(myDuration);

      if (round < 10) {
        setRound((r) => r + 1);
      } else if (!gameEnded) {
        saveGameResults();
      }
    }
  };

  // Save game results to Firestore
  const saveGameResults = async () => {
    if (gameEnded) return;
    setGameEnded(true);

    const completedRounds = perRoundResults.length;
    const totalCorrect = perRoundResults.reduce((sum, res) => sum + res.correct, 0);
    const totalIncorrect = perRoundResults.reduce((sum, res) => sum + res.incorrect, 0);

    const averageTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    const bestTime = times.length > 0 ? Math.min(...times) : 0;

    const results = {
      averageTime,
      bestTime,
      totalErrors: totalIncorrect,
      totalRounds: completedRounds,
      perRoundData: perRoundResults,
      timestamp: serverTimestamp(),
    };

    try {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const resultsRef = collection(firestore, 'patients', uid, 'SDMTResults');
        const docRef = await addDoc(resultsRef, results);
        console.log('Document written with ID: ', docRef.id);
        Alert.alert('Success', 'Game results saved successfully!');
      } else {
        Alert.alert('Error', 'User not logged in.');
      }
    } catch (error) {
      console.error('Error saving game results:', error);
      Alert.alert('Error', 'Failed to save game results.');
    }

    navigate('SDMTScore', {
      round: completedRounds,
      errors: totalIncorrect,
      times,
      perRoundResults,
    });
  };

  return (
    <View style={styles.containerLandscape}>
      <GameBar
        text={title + round.toString()}
        timer={`${Math.floor(myDuration / 60)}:${('0' + (myDuration % 60)).slice(-2)}`}
        navigate={navigate}
      />
      <View style={styles.sdmtMainLandscape}>
        {/* Left side: symbol panels */}
        <View style={styles.sdmtLeftContainer}>
          {/* Top symbols row */}
          <View style={[styles.sdmtSymbolRow, { backgroundColor: '#679186' }]}>
            {symbols.map((symbol, index) => (
              <Box key={index} text={symbol.s} />
            ))}
          </View>
          {/* Matching numbers row */}
          <View style={[styles.sdmtSymbolRow, { backgroundColor: '#679186' }]}>
            {symbols.map((symbol, index) => (
              <Box key={index} clr="#ECCDC8" text={symbol.n} />
            ))}
          </View>
          {/* Divider */}
          <View style={styles.divider} />
          {/* Display symbols (for user to match) */}
          <View style={[styles.sdmtSymbolRow, { backgroundColor: '#264E70' }]}>
            {displaySymbols.map((symbol, index) => (
              <Box key={index} text={symbol.s} />
            ))}
          </View>
          {/* User input row */}
          <View style={[styles.sdmtSymbolRow, { backgroundColor: '#264E70' }]}>
            {numKeyPressed.map((num, index) => (
              <Box key={index} clr="#ECCDC8" text={num} />
            ))}
          </View>
        </View>

        {/* Right side: numeric keypad */}
        <View style={styles.sdmtRightContainer}>
          <View style={styles.sdmtNumKeypad}>
            <View style={styles.sdmtNumKeyRow}>
              <NumKey text="1" onPress={() => handleNumKeyPress('1')} />
              <NumKey text="2" onPress={() => handleNumKeyPress('2')} />
            </View>
            <View style={styles.sdmtNumKeyRow}>
              <NumKey text="3" onPress={() => handleNumKeyPress('3')} />
              <NumKey text="4" onPress={() => handleNumKeyPress('4')} />
            </View>
            <View style={styles.sdmtNumKeyRow}>
              <NumKey text="5" onPress={() => handleNumKeyPress('5')} />
              <NumKey text="DEL" onPress={handleDelPress} />
            </View>
            <View style={styles.sdmtNumKeyRow}>
              <NumKey
                text="CONTINUE"
                onPress={handleContinuePress}
                clr={color}
                clrtxt={colortxt}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
