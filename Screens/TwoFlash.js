// Screens/TwoFlash.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Alert,
  BackHandler,
  LayoutAnimation,
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import GameBar from '../Components/GameBar';
import TwoFlashButton from '../Components/TwoFlashButton';
import styles from '../Styles';
import { auth, firestore } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function TwoFlash({ navigate }) {
  const [correct, setCorrect] = useState([0, 0, 0, 0, 0]);
  const [incorrect, setIncorrect] = useState([0, 0, 0, 0, 0]);
  const [round, setRound] = useState(1);
  const [oneOrTwo, setOneOrTwo] = useState(1);
  const [numOfFrames, setNumOfFrames] = useState(0);
  const [flashX, setFlashX] = useState(0);
  const [flashY, setFlashY] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const [showPlus, setShowPlus] = useState(true);
  const [timerDuration, setTimerDuration] = useState(6);
  const [timerInterval, setTimerInterval] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [startTime, setStartTime] = useState(0);

  // Adaptive difficulty
  const [difficultyLevel, setDifficultyLevel] = useState(0);
  const maxDifficultyLevel = 4;

  const [perRoundResults, setPerRoundResults] = useState([]);

  // Container dimensions to randomize flashes inside
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // New flag: wait for orientation lock to finish
  const [orientationLocked, setOrientationLocked] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Not logged in', 'Please log in to continue.', [
        { text: 'OK', onPress: () => navigate('PatientLogin') },
      ]);
      return;
    }

    // Lock orientation to landscape BEFORE rendering UI
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      setOrientationLocked(true); // now we can safely render
    };
    lockOrientation();
  }, []);

  // Once orientation is locked, do initial setup
  useEffect(() => {
    if (!orientationLocked) return; // wait until orientation is locked

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    // Start the first round
    startRound();

    return () => {
      backHandler.remove();
      stopTimer();
      ScreenOrientation.unlockAsync();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orientationLocked]);

  // Trigger new round until 30 rounds
  useEffect(() => {
    if (!orientationLocked) return; // wait until orientation locked
    if (gameEnded) return;

    if (round > 30) endGame();
    else if (round > 1) startRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, orientationLocked]);

  const startRound = () => {
    if (gameEnded) return;
    setTimerDuration(6);
    startTimer();
    runFlashSequence();
  };

  const startTimer = () => {
    stopTimer();
    const interval = setInterval(() => {
      setTimerDuration((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimerExpiry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerInterval(interval);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const handleTimerExpiry = () => {
    if (gameEnded) return;
    const trialIndex = getTrialIndex();
    setIncorrect((prev) => {
      const newArr = [...prev];
      newArr[trialIndex] += 1;
      return newArr;
    });
    setDifficultyLevel((prev) => Math.max(prev - 1, 0));
    setRound((prev) => prev + 1);
  };

  /** Container random flash logic */
  const runFlashSequence = async () => {
    if (gameEnded) return;

    // Show plus sign initially
    setShowPlus(true);
    setShowFlash(false);

    // Wait random 1-2 seconds
    const randomDelay = (Math.random() * 2 + 1) * 1000;
    await new Promise((resolve) => setTimeout(resolve, randomDelay));

    // Remove plus sign for 0.5 second
    setShowPlus(false);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Now show the flash(es)
    setStartTime(Date.now());

    let trialOneOrTwo = 1;
    let frameGap = 4;
    if (difficultyLevel >= 0 && difficultyLevel <= 2) {
      const frameGaps = [4, 3, 2];
      frameGap = frameGaps[difficultyLevel];
    } else if (difficultyLevel === 3) {
      frameGap = 1;
    } else if (difficultyLevel === 4) {
      trialOneOrTwo = Math.random() < 0.5 ? 1 : 0;
      frameGap = trialOneOrTwo === 1 ? 1 : 0;
    }
    setOneOrTwo(trialOneOrTwo);
    setNumOfFrames(frameGap);

    if (containerWidth > 0 && containerHeight > 0) {
      const maxX = containerWidth - 150;
      const maxY = containerHeight - 150;
      setFlashX(Math.random() * maxX);
      setFlashY(Math.random() * maxY);
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowFlash(true);
    await new Promise((resolve) => setTimeout(resolve, 16));
    setShowFlash(false);

    if (trialOneOrTwo === 1 && frameGap > 0) {
      await new Promise((resolve) => setTimeout(resolve, frameGap * 16));
      setShowFlash(true);
      await new Promise((resolve) => setTimeout(resolve, 16));
      setShowFlash(false);
    }
  };

  const getTrialIndex = () => {
    if (oneOrTwo === 0) return 0;
    switch (numOfFrames) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 3:
        return 3;
      case 4:
        return 4;
      default:
        return 4;
    }
  };

  const handleButtonPress = (buttonValue) => {
    if (gameEnded) return;
    stopTimer();

    const responseTime = (Date.now() - startTime) / 1000;
    const timeTaken = parseFloat(responseTime.toFixed(1));
    const trialIndex = getTrialIndex();
    const isCorrect = buttonValue - 1 === oneOrTwo;

    if (isCorrect) {
      setCorrect((prev) => {
        const newArr = [...prev];
        newArr[trialIndex] += 1;
        return newArr;
      });
      setDifficultyLevel((prev) => Math.min(prev + 1, maxDifficultyLevel));
    } else {
      setIncorrect((prev) => {
        const newArr = [...prev];
        newArr[trialIndex] += 1;
        return newArr;
      });
      setDifficultyLevel((prev) => Math.max(prev - 1, 0));
    }

    setPerRoundResults((prev) => [
      ...prev,
      {
        round,
        timeTaken,
        correct: isCorrect,
        trialType: trialIndex,
        oneOrTwo,
        frameGap: numOfFrames,
      },
    ]);

    setRound((r) => r + 1);
  };

  const endGame = () => {
    if (gameEnded) return;
    setGameEnded(true);
    stopTimer();
    saveGameResults();
    navigate('TwoFlashScore', { correct, incorrect, perRoundData: perRoundResults });
  };

  const saveGameResults = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }
      const uid = user.uid;
      const resultsRef = collection(firestore, 'patients', uid, 'TwoFlashResults');
      const sumCorrect = correct.reduce((a, b) => a + b, 0);
      const sumIncorrect = incorrect.reduce((a, b) => a + b, 0);
      const results = {
        correct,
        incorrect,
        sumCorrect,
        sumIncorrect,
        perRoundData: perRoundResults,
        timestamp: serverTimestamp(),
      };
      await addDoc(resultsRef, results);
      Alert.alert('Success', 'Game results saved successfully!');
    } catch (error) {
      console.error('Error saving game results:', error);
      Alert.alert('Error', 'Failed to save game results.');
    }
  };

  // Capture container layout after orientation is locked
  const onContainerLayout = (evt) => {
    const { width, height } = evt.nativeEvent.layout;
    setContainerWidth(width);
    setContainerHeight(height);
  };

  // If orientation not yet locked, render null or a loader
  if (!orientationLocked) {
    return null; // or a simple <ActivityIndicator />
  }

  // Otherwise, render the main game UI
  return (
    <View style={styles.container}>
      <GameBar
        text={`Two Flash-Staircase - Round ${round}`}
        timer={`${Math.floor(timerDuration / 60)}:${('0' + (timerDuration % 60)).slice(-2)}`}
        navigate={navigate}
      />
      <View style={styles.twoFlashContent}>
        <Text style={styles.questionText}>How many flashes did you see?</Text>

        {/* Invisible container in the middle */}
        <View style={styles.focusContainer} onLayout={onContainerLayout}>
          {/* The plus sign: shown if showPlus = true */}
          {showPlus && <Text style={styles.plusSign}>+</Text>}

          {/* The flash: positioned absolutely within container */}
          {showFlash && (
            <View
              style={[
                styles.flash,
                { left: flashX, top: flashY },
              ]}
            />
          )}
        </View>

        <View style={styles.buttonRow}>
          <TwoFlashButton text="1" onPress={() => handleButtonPress(1)} />
          <TwoFlashButton text="2" onPress={() => handleButtonPress(2)} />
        </View>
      </View>
    </View>
  );
}
