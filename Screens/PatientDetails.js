// Screens/PatientDetails.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { firestore } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import styles from '../Styles';
import BackButton from '../Components/BackButton';

// Import XLSX for Excel file creation
import * as XLSX from 'xlsx';

// Import FileSystem and Sharing for Expo
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function PatientDetails({ route, navigate }) {
  const { patient } = route.params;
  const [sdmtResults, setSdmtResults] = useState([]);
  const [twoFlashResults, setTwoFlashResults] = useState([]);
  const [twoFlashStandardResults, setTwoFlashStandardResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // State to manage dropdown visibility
  const [showSdmtResults, setShowSdmtResults] = useState(false);
  const [showTwoFlashResults, setShowTwoFlashResults] = useState(false);
  const [showTwoFlashStandardResults, setShowTwoFlashStandardResults] = useState(false);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        // Fetch SDMT Results
        const sdmtRef = collection(firestore, 'patients', patient.id, 'SDMTResults');
        const sdmtQueryRef = query(sdmtRef, orderBy('timestamp', 'desc'));
        const sdmtSnapshot = await getDocs(sdmtQueryRef);
        const sdmtData = sdmtSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            perRoundData: data.perRoundData || [],
          };
        });
        setSdmtResults(sdmtData);

        // Fetch Two Flash Staircase Results
        const twoFlashRef = collection(firestore, 'patients', patient.id, 'TwoFlashResults');
        const twoFlashQueryRef = query(twoFlashRef, orderBy('timestamp', 'desc'));
        const twoFlashSnapshot = await getDocs(twoFlashQueryRef);
        const twoFlashData = twoFlashSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTwoFlashResults(twoFlashData);

        // Fetch Two Flash Standard Results
        const twoFlashStandardRef = collection(firestore, 'patients', patient.id, 'TwoFlashStandardResults');
        const twoFlashStandardQueryRef = query(twoFlashStandardRef, orderBy('timestamp', 'desc'));
        const twoFlashStandardSnapshot = await getDocs(twoFlashStandardQueryRef);
        const twoFlashStandardData = twoFlashStandardSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTwoFlashStandardResults(twoFlashStandardData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching test results:', error);
        Alert.alert('Error', 'Failed to fetch test results.');
      }
    };

    fetchTestResults();
  }, [patient.id]);

  const renderSdmtResult = ({ item }) => (
    <View style={localStyles.sdmtResultContainer}>
      <View style={localStyles.tableRow}>
        <Text style={localStyles.tableCell}>{item.timestamp?.toDate().toLocaleString() || '-'}</Text>
        <Text style={localStyles.tableCell}>{item.averageTime != null ? item.averageTime.toFixed(2) : '-'}</Text>
        <Text style={localStyles.tableCell}>{item.bestTime != null ? item.bestTime.toFixed(2) : '-'}</Text>
        <Text style={localStyles.tableCell}>{item.totalErrors != null ? item.totalErrors : '-'}</Text>
        <Text style={localStyles.tableCell}>{item.totalRounds != null ? item.totalRounds : '-'}</Text>
      </View>
      {/* Per-Round Results Breakdown */}
      <Text style={localStyles.breakdownTitle}>Per-Round Results:</Text>
      <View style={localStyles.breakdownTable}>
        <View style={localStyles.breakdownRow}>
          <Text style={localStyles.breakdownHeader}>Round</Text>
          <Text style={localStyles.breakdownHeader}>Time (s)</Text>
          <Text style={localStyles.breakdownHeader}>Correct</Text>
          <Text style={localStyles.breakdownHeader}>Incorrect</Text>
        </View>
        {item.perRoundData.map((roundData) => (
          <View key={roundData.round} style={localStyles.breakdownRow}>
            <Text style={localStyles.breakdownCell}>{roundData.round}</Text>
            <Text style={localStyles.breakdownCell}>{roundData.timeTaken.toFixed(2)}</Text>
            <Text style={localStyles.breakdownCell}>{roundData.correct}</Text>
            <Text style={localStyles.breakdownCell}>{roundData.incorrect}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderTwoFlashResult = ({ item }) => (
    <View style={localStyles.twoFlashResultContainer}>
      <View style={localStyles.tableRow}>
        <Text style={localStyles.tableCell}>{item.timestamp.toDate().toLocaleString()}</Text>
        <Text style={localStyles.tableCell}>{item.sumCorrect}</Text>
        <Text style={localStyles.tableCell}>{item.sumIncorrect}</Text>
      </View>
      <Text style={localStyles.breakdownTitle}>Breakdown:</Text>
      <View style={localStyles.breakdownTable}>
        <View style={localStyles.breakdownRow}>
          <Text style={localStyles.breakdownHeader}>Frame Type</Text>
          <Text style={localStyles.breakdownHeader}>Correct</Text>
          <Text style={localStyles.breakdownHeader}>Incorrect</Text>
        </View>
        {item.correct.map((correctCount, index) => (
          <View key={index} style={localStyles.breakdownRow}>
            <Text style={localStyles.breakdownCell}>{getFrameType(index)}</Text>
            <Text style={localStyles.breakdownCell}>{correctCount}</Text>
            <Text style={localStyles.breakdownCell}>{item.incorrect[index]}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderTwoFlashStandardResult = ({ item }) => (
    <View style={localStyles.twoFlashResultContainer}>
      <View style={localStyles.tableRow}>
        <Text style={localStyles.tableCell}>{item.timestamp.toDate().toLocaleString()}</Text>
        <Text style={localStyles.tableCell}>{item.sumCorrect}</Text>
        <Text style={localStyles.tableCell}>{item.sumIncorrect}</Text>
      </View>
      <Text style={localStyles.breakdownTitle}>Breakdown:</Text>
      <View style={localStyles.breakdownTable}>
        <View style={localStyles.breakdownRow}>
          <Text style={localStyles.breakdownHeader}>Frame Type</Text>
          <Text style={localStyles.breakdownHeader}>Correct</Text>
          <Text style={localStyles.breakdownHeader}>Incorrect</Text>
        </View>
        {item.correct.map((correctCount, index) => (
          <View key={index} style={localStyles.breakdownRow}>
            <Text style={localStyles.breakdownCell}>{getFrameTypeStandard(index)}</Text>
            <Text style={localStyles.breakdownCell}>{correctCount}</Text>
            <Text style={localStyles.breakdownCell}>{item.incorrect[index]}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const getFrameType = (index) => {
    const frameTypes = ['1 flash', '2 flashes (1FG)', '2 flashes (2FG)', '2 flashes (3FG)', '2 flashes (4FG)'];
    return frameTypes[index] || 'Unknown';
  };

  const getFrameTypeStandard = (index) => {
    const frameTypes = ['1 flash', '2 flashes (1FG)', '2 flashes (2FG)', '2 flashes (3FG)', '2 flashes (4FG)'];
    return frameTypes[index] || 'Unknown';
  };

  const exportDataToExcel = async () => {
    try {
      // Create a new Workbook
      const wb = XLSX.utils.book_new();

      // **SDMT Data**
      const sdmtWSData = [];
      sdmtWSData.push(['Date', 'Average Time (s)', 'Best Time (s)', 'Errors', 'Rounds']);

      sdmtResults.forEach((item) => {
        // Main SDMT result data
        sdmtWSData.push([
          item.timestamp.toDate().toLocaleString(),
          item.averageTime != null ? item.averageTime.toFixed(2) : '',
          item.bestTime != null ? item.bestTime.toFixed(2) : '',
          item.totalErrors != null ? item.totalErrors : '',
          item.totalRounds != null ? item.totalRounds : '',
        ]);

        // Add an empty row for spacing
        sdmtWSData.push([]);

        // Add per-round data header
        sdmtWSData.push(['Per-Round Data']);
        sdmtWSData.push(['Round', 'Time Taken (s)', 'Correct', 'Incorrect']);

        // Add per-round data
        item.perRoundData.forEach((roundData) => {
          sdmtWSData.push([
            roundData.round,
            roundData.timeTaken.toFixed(2),
            roundData.correct,
            roundData.incorrect,
          ]);
        });

        // Add an empty row to separate each test entry
        sdmtWSData.push([]);
      });

      const sdmtWS = XLSX.utils.aoa_to_sheet(sdmtWSData);
      XLSX.utils.book_append_sheet(wb, sdmtWS, 'SDMT Results');

      // **Two Flash Staircase Data**
      const twoFlashStaircaseWSData = [];
      twoFlashStaircaseWSData.push(['Date', 'Sum Correct', 'Sum Incorrect']);
      twoFlashResults.forEach((result) => {
        twoFlashStaircaseWSData.push([
          result.timestamp.toDate().toLocaleString(),
          result.sumCorrect,
          result.sumIncorrect,
        ]);
        twoFlashStaircaseWSData.push([]);
        twoFlashStaircaseWSData.push(['Breakdown']);
        twoFlashStaircaseWSData.push(['Frame Type', 'Correct', 'Incorrect']);
        result.correct.forEach((correctCount, index) => {
          twoFlashStaircaseWSData.push([getFrameType(index), correctCount, result.incorrect[index]]);
        });
        twoFlashStaircaseWSData.push([]);
        twoFlashStaircaseWSData.push(['Per Round Data']);
        twoFlashStaircaseWSData.push(['Round', 'Time Taken (s)', 'Correct', 'Trial Type', 'Frame Gap']);
        result.perRoundData?.forEach((roundData) => {
          twoFlashStaircaseWSData.push([
            roundData.round,
            roundData.timeTaken,
            roundData.correct ? 'Yes' : 'No',
            getFrameType(roundData.trialType),
            roundData.frameGap,
          ]);
        });
        twoFlashStaircaseWSData.push([]);
      });
      const twoFlashStaircaseWS = XLSX.utils.aoa_to_sheet(twoFlashStaircaseWSData);
      XLSX.utils.book_append_sheet(wb, twoFlashStaircaseWS, 'Two Flash Staircase Results');

      // **Two Flash Standard Data**
      const twoFlashStandardWSData = [];
      twoFlashStandardWSData.push(['Date', 'Sum Correct', 'Sum Incorrect']);
      twoFlashStandardResults.forEach((result) => {
        twoFlashStandardWSData.push([
          result.timestamp.toDate().toLocaleString(),
          result.sumCorrect,
          result.sumIncorrect,
        ]);
        twoFlashStandardWSData.push([]);
        twoFlashStandardWSData.push(['Breakdown']);
        twoFlashStandardWSData.push(['Frame Type', 'Correct', 'Incorrect']);
        result.correct.forEach((correctCount, index) => {
          twoFlashStandardWSData.push([getFrameTypeStandard(index), correctCount, result.incorrect[index]]);
        });
        twoFlashStandardWSData.push([]);
        twoFlashStandardWSData.push(['Per Round Data']);
        twoFlashStandardWSData.push(['Round', 'Time Taken (s)', 'Correct', 'Frame Gap']);
        result.perRoundData?.forEach((roundData) => {
          twoFlashStandardWSData.push([
            roundData.round,
            roundData.timeTaken,
            roundData.correct ? 'Yes' : 'No',
            roundData.frameGap,
          ]);
        });
        twoFlashStandardWSData.push([]);
      });
      const twoFlashStandardWS = XLSX.utils.aoa_to_sheet(twoFlashStandardWSData);
      XLSX.utils.book_append_sheet(wb, twoFlashStandardWS, 'Two Flash Standard Results');

      // Write the workbook to a binary string
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

      // Define the file path
      const fileName = `Patient_${patient.name.replace(' ', '_')}_Data.xlsx`;
      const uri = `${FileSystem.cacheDirectory}${fileName}`;

      // Write the file to the filesystem
      await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Share the file with the user
      await Sharing.shareAsync(uri, {
        mimeType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Share Patient Data',
        UTI: 'com.microsoft.excel.xlsx',
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'An error occurred while exporting data.');
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <View style={{ position: 'absolute', top: 20, left: 10, zIndex: 1 }}>
        <BackButton onPress={() => navigate('DoctorHome')} />
      </View>
      <ScrollView contentContainerStyle={[styles.container, { alignItems: 'flex-start', padding: 20 }]}>
        <Text style={styles.title}>Patient Details</Text>
        <View style={localStyles.detailsContainer}>
          <Text style={localStyles.detailsText}>Name: {patient.name}</Text>
          <Text style={localStyles.detailsText}>Email: {patient.email}</Text>
          <Text style={localStyles.detailsText}>Diagnosis: {patient.diagnosis}</Text>
        </View>

        <TouchableOpacity style={localStyles.exportButton} onPress={exportDataToExcel}>
          <Text style={localStyles.exportButtonText}>Download Patient Data</Text>
        </TouchableOpacity>

        {/* SDMT Results Dropdown */}
        <TouchableOpacity onPress={() => setShowSdmtResults(!showSdmtResults)} style={localStyles.dropdownButton}>
          <Text style={localStyles.dropdownButtonText}>SDMT Results</Text>
        </TouchableOpacity>
        {showSdmtResults && (
          <ScrollView horizontal={true}>
            <View style={{ minWidth: 600 }}>
              <View style={localStyles.tableHeader}>
                <Text style={localStyles.tableHeaderCell}>Date</Text>
                <Text style={localStyles.tableHeaderCell}>Avg Time</Text>
                <Text style={localStyles.tableHeaderCell}>Best Time</Text>
                <Text style={localStyles.tableHeaderCell}>Errors</Text>
                <Text style={localStyles.tableHeaderCell}>Rounds</Text>
              </View>
              <FlatList
                data={sdmtResults}
                keyExtractor={(item) => item.id}
                renderItem={renderSdmtResult}
                ListEmptyComponent={<Text style={localStyles.noDataText}>No SDMT results available.</Text>}
              />
            </View>
          </ScrollView>
        )}

        {/* Two Flash Staircase Results Dropdown */}
        <TouchableOpacity onPress={() => setShowTwoFlashResults(!showTwoFlashResults)} style={localStyles.dropdownButton}>
          <Text style={localStyles.dropdownButtonText}>Two Flash Staircase Results</Text>
        </TouchableOpacity>
        {showTwoFlashResults && (
          <ScrollView horizontal={true}>
            <View style={{ minWidth: 400 }}>
              <View style={localStyles.tableHeader}>
                <Text style={localStyles.tableHeaderCell}>Date</Text>
                <Text style={localStyles.tableHeaderCell}>Correct</Text>
                <Text style={localStyles.tableHeaderCell}>Incorrect</Text>
              </View>
              <FlatList
                data={twoFlashResults}
                keyExtractor={(item) => item.id}
                renderItem={renderTwoFlashResult}
                ListEmptyComponent={<Text style={localStyles.noDataText}>No Two Flash Staircase results available.</Text>}
              />
            </View>
          </ScrollView>
        )}

        {/* Two Flash Standard Results Dropdown */}
        <TouchableOpacity onPress={() => setShowTwoFlashStandardResults(!showTwoFlashStandardResults)} style={localStyles.dropdownButton}>
          <Text style={localStyles.dropdownButtonText}>Two Flash Standard Results</Text>
        </TouchableOpacity>
        {showTwoFlashStandardResults && (
          <ScrollView horizontal={true}>
            <View style={{ minWidth: 400 }}>
              <View style={localStyles.tableHeader}>
                <Text style={localStyles.tableHeaderCell}>Date</Text>
                <Text style={localStyles.tableHeaderCell}>Correct</Text>
                <Text style={localStyles.tableHeaderCell}>Incorrect</Text>
              </View>
              <FlatList
                data={twoFlashStandardResults}
                keyExtractor={(item) => item.id}
                renderItem={renderTwoFlashStandardResult}
                ListEmptyComponent={<Text style={localStyles.noDataText}>No Two Flash Standard results available.</Text>}
              />
            </View>
          </ScrollView>
        )}
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  detailsContainer: {
    marginVertical: 10,
  },
  detailsText: {
    fontSize: 16,
    color: '#8D95B2',
    marginVertical: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#CBDBEA',
    paddingVertical: 5,
  },
  tableHeaderCell: {
    flex: 1,
    minWidth: 100, // ensure enough space for each column
    fontWeight: 'bold',
    fontSize: 14,
    color: '#264E70',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
  },
  tableCell: {
    flex: 1,
    minWidth: 100,
    fontSize: 14,
    color: '#8D95B2',
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#8D95B2',
  },
  twoFlashResultContainer: {
    marginBottom: 20,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#264E70',
  },
  breakdownTable: {
    marginTop: 5,
  },
  breakdownRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  breakdownHeader: {
    flex: 1,
    minWidth: 100,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#264E70',
    textAlign: 'center',
  },
  breakdownCell: {
    flex: 1,
    minWidth: 100,
    fontSize: 14,
    color: '#8D95B2',
    textAlign: 'center',
  },
  exportButton: {
    backgroundColor: '#CBDBEA',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  exportButtonText: {
    color: '#264E70',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownButton: {
    backgroundColor: '#679186',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  dropdownButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sdmtResultContainer: {
    marginBottom: 20,
  },
});
