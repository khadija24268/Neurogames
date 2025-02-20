// Screens/TwoFlashStandard.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Alert,
  BackHandler,
  Dimensions,
  LayoutAnimation,
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import GameBar from '../Components/GameBar';
import TwoFlashButton from '../Components/TwoFlashButton';
import styles from '../Styles';
import { auth, firestore } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function TwoFlashStandard({ navigate }) {
  const [correct, setCorrect] = useState([0, 0, 0, 0, 0]);
  const [incorrect, setIncorrect] = useState([0, 0, 0, 0, 0]);
  const [round, setRound] = useState(1);
  const [oneOrTwo, setOneOrTwo] = useState(0);
  const [numOfFrames, setNumOfFrames] = useState(0);
  const [flashX, setFlashX] = useState(0);
  const [flashY, setFlashY] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const [showPlus, setShowPlus] = useState(true);
  const [timerDuration, setTimerDuration] = useState(6);
  const [timerInterval, setTimerInterval] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [startTime, setStartTime] = useState(0);

  // Frame gaps
  const frameGaps = [0, 1, 2, 3, 4]; 
  const totalRounds = 30;
  const roundsPerGap = 6;

  // Predefined sequence
  const [sequence, setSequence] = useState([]);
  const [perRoundResults, setPerRoundResults] = useState([]);

  // Container dims
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Not logged in', 'Please log in to continue.', [
        { text: 'OK', onPress: () => navigate('PatientLogin') },
      ]);
      return;
    }

    // Lock orientation
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };
    lockOrientation();

    // Disable back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    // Generate sequence + start first round
    const seq = generateSequence();
    setSequence(seq);
    if (seq.length > 0) {
      startRound(seq[0]);
    }

    return () => {
      backHandler.remove();
      stopTimer();
      ScreenOrientation.unlockAsync();
    };
  }, []);

  useEffect(() => {
    if (gameEnded) return;
    if (round > totalRounds) {
      endGame();
    } else if (round > 1) {
      startRound(sequence[round - 1]);
    }
  }, [round]);

  // Navigate to score once ended
  useEffect(() => {
    if (gameEnded) {
      navigate('TwoFlashScore', {
        correct,
        incorrect,
        perRoundData: perRoundResults,
        standard: true,
      });
    }
  }, [gameEnded]);

  const generateSequence = () => {
    let seq = [];
    for (let i = 0; i < frameGaps.length; i++) {
      for (let j = 0; j < roundsPerGap; j++) {
        seq.push(i);
      }
    }
    // Shuffle
    seq = seq.sort(() => Math.random() - 0.5);
    return seq;
  };

  const startRound = (frameGapIndex) => {
    if (gameEnded) return;
    setTimerDuration(6);
    startTimer();
    runFlashSequence(frameGapIndex);
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
    const frameGapIndex = sequence[round - 1];
    setIncorrect((prev) => {
      const newArr = [...prev];
      newArr[frameGapIndex] += 1;
      return newArr;
    });
    setRound((prev) => prev + 1);
  };

  /** Show/hide plus sign and flashes with a small gap */
  const runFlashSequence = async (frameGapIndex) => {
    if (gameEnded) return;

    // Show plus
    setShowPlus(true);
    setShowFlash(false);

    // Wait random 1-2s
    const randomDelay = (Math.random() * 2 + 1) * 1000;
    await new Promise((resolve) => setTimeout(resolve, randomDelay));

    // Remove plus sign for 1 second
    setShowPlus(false);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setStartTime(Date.now());
    const gap = frameGaps[frameGapIndex];
    const isTwoFlash = gap > 0;
    setOneOrTwo(isTwoFlash ? 1 : 0);

    // Random flash position
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

    if (isTwoFlash) {
      setNumOfFrames(gap);
      await new Promise((resolve) => setTimeout(resolve, gap * 16));
      setShowFlash(true);
      await new Promise((resolve) => setTimeout(resolve, 16));
      setShowFlash(false);
    } else {
      setNumOfFrames(0);
    }
  };

  const handleButtonPress = (buttonValue) => {
    if (gameEnded) return;
    stopTimer();

    const responseTime = (Date.now() - startTime) / 1000;
    const timeTaken = parseFloat(responseTime.toFixed(1));
    const frameGapIndex = sequence[round - 1];
    const isCorrect = buttonValue - 1 === oneOrTwo;

    if (isCorrect) {
      setCorrect((prev) => {
        const newArr = [...prev];
        newArr[frameGapIndex] += 1;
        return newArr;
      });
    } else {
      setIncorrect((prev) => {
        const newArr = [...prev];
        newArr[frameGapIndex] += 1;
        return newArr;
      });
    }

    setPerRoundResults((prev) => [
      ...prev,
      {
        round,
        timeTaken,
        correct: isCorrect,
        frameGap: frameGaps[frameGapIndex],
      },
    ]);

    setRound((prev) => prev + 1);
  };

  const endGame = () => {
    if (gameEnded) return;
    setGameEnded(true);
    stopTimer();
    saveGameResults();
  };

  const saveGameResults = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }
      const uid = user.uid;
      const resultsRef = collection(firestore, 'patients', uid, 'TwoFlashStandardResults');
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

  const onContainerLayout = (evt) => {
    const { width: w, height: h } = evt.nativeEvent.layout;
    setContainerWidth(w);
    setContainerHeight(h);
  };

  return (
    <View style={styles.container}>
      <GameBar
        text={`Two Flash-Standard - Round ${round}`}
        timer={`${Math.floor(timerDuration / 60)}:${('0' + (timerDuration % 60)).slice(-2)}`}
        navigate={navigate}
      />
      <View style={styles.twoFlashContent}>
        {/* Center Title */}
        <Text style={styles.questionText}>How many flashes did you see?</Text>

        {/* Invisible container */}
        <View
          style={styles.focusContainer}
          onLayout={onContainerLayout}
        >
          {/* Plus sign in center */}
          {showPlus && (
            <Text style={styles.plusSign}>+</Text>
          )}

          {/* Flash, absolutely positioned */}
          {showFlash && (
            <View
              style={[
                styles.flash,
                { left: flashX, top: flashY },
              ]}
            />
          )}
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TwoFlashButton
            text="1"
            onPress={() => handleButtonPress(1)}
          />
          <TwoFlashButton
            text="2"
            onPress={() => handleButtonPress(2)}
          />
        </View>
      </View>
    </View>
  );
}
