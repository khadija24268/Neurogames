import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  // General Styles
  container: {
    flex: 1,
    backgroundColor: '#fffaf3',
    paddingVertical: height * 0.02, // 2% of screen height
    paddingHorizontal: width * 0.05, // 5% of screen width
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: width * 0.09, // 9% of screen width
    color: '#679186',
    textAlign: 'center',
    marginBottom: height * 0.05, // 5% of screen height
    fontFamily: 'DMSans',
  },
  text: {
    fontSize: width * 0.08, // 8% of screen width
    color: '#8D95B2',
    fontFamily: 'DMSans',
  },
  button: {
    backgroundColor: '#CBDBEA',
    borderColor: '#264E70',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: height * 0.015, // 1.5% of screen height
    paddingHorizontal: width * 0.1, // 10% of screen width
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: height * 0.01, // 1% of screen height
  },
  buttonText: {
    fontSize: width * 0.045, // 4.5% of screen width
    fontWeight: 'bold',
    color: '#264E70',
  },
  logoutButton: {
    backgroundColor: '#F8D7DA',
    borderColor: '#F5C6CB',
    paddingVertical: height * 0.02, // 2% of screen height
    paddingHorizontal: width * 0.05, // 5% of screen width
    borderRadius: 5,
    position: 'absolute',
    bottom: height * 0.02, // 2% of screen height
    width: '20%',
    alignSelf: 'center',
  },
  logoutButtonText: {
    color: '#264E70',
    fontSize: width * 0.045, // 4.5% of screen width
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // GameBar Styles
  gameBar: {
    height: 55,
    backgroundColor: '#BBD4CE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  gameBarIcon: {
    fontSize: 24,
    color: '#679186',
  },
  gameBarTitle: {
    fontSize: 35,
    fontWeight: '500',
    color: '#264E70',
    fontFamily: 'DMSans',
  },
  gameBarTimer: {
    fontSize: 35,
    fontWeight: '500',
    color: '#679186',
    fontFamily: 'DMSans',
  },

  // TwoFlash.js Styles
  questionText: {
    fontSize: 35,
    color: '#264E70',
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'DMSans',
  },
  flashContainer: {
    flex: 1,
    position: 'relative',
  },
  flash: {
    position: 'absolute',
    width: 150,
    height: 150,
    backgroundColor: '#AFD8FF',
    borderRadius: 75,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 20,
  },

  // TwoFlashButton
  twoFlashButton: {
    backgroundColor: '#ECCDC8',
    paddingVertical: 20,
    paddingHorizontal: 40,
    marginHorizontal: 50,
    borderRadius: 50,
    alignItems: 'center',
  },
  twoFlashButtonText: {
    fontSize: 40,
    color: '#264E70',
    fontFamily: 'DMSans',
  },

  // TwoFlashScore.js
  resultsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  resultsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  resultsLabel: {
    fontSize: 32,
    color: '#8D95B2',
    fontFamily: 'DMSans',
  },
  resultsValue: {
    fontSize: 32,
    color: '#8D95B2',
    fontFamily: 'DMSans',
  },
  divider: {
    height: 1,
    backgroundColor: '#85A4BF',
    marginVertical: height * 0.02, // 2% of screen height
  },
  breakdownTitle: {
    fontSize: 28,
    color: '#679186',
    marginBottom: 10,
    fontFamily: 'DMSans',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  breakdownLabel: {
    fontSize: 28,
    color: '#679186',
    fontFamily: 'DMSans',
  },
  breakdownValue: {
    fontSize: 28,
    color: '#679186',
    fontFamily: 'DMSans',
  },
  returnButton: {
    backgroundColor: '#CBDBEA',
    marginTop: 30,
  },
  returnButtonText: {
    color: '#264E70',
    fontFamily: 'DMSans',
  },

  // Input Styles
  input: {
    width: '80%',
    height: 50,
    borderColor: '#679186',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    fontSize: 18,
    fontFamily: 'DMSans',
  },
  linkText: {
    color: '#264E70',
    marginTop: 15,
    textDecorationLine: 'underline',
    fontSize: 16,
    fontFamily: 'DMSans',
  },
  subtitle: {
    fontSize: 24,
    color: '#679186',
    marginTop: 20,
    marginBottom: 10,
    fontFamily: 'DMSans',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  listItemText: {
    fontSize: 18,
    fontFamily: 'DMSans',
  },

  // NumKey
  numKey: {
    flex: 1,
    margin: width * 0.01,
    borderWidth: 1,
    borderColor: '#679186',
    backgroundColor: '#BBD4CE',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
    maxWidth: width * 0.15,
  },
  numKeyText: {
    fontWeight: '700',
    fontFamily: 'DMSans',
    fontSize: width * 0.05,
    textAlign: 'center',
    color: '#264E70',
  },

  // Box
  box: {
    flex: 1,
    marginHorizontal: width * 0.005,
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: width * 0.1,
  },
  boxText: {
    fontSize: width * 0.05,
    fontFamily: 'DMSans',
    textAlign: 'center',
  },

  // SDMT Screen
  main: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
  },
  leftContainer: {
    flex: 2,
    marginRight: width * 0.02,
    maxWidth: width * 0.65,
  },
  symbolRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    marginVertical: height * 0.005,
    paddingHorizontal: width * 0.01,
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: height * 0.02,
  },
  numKeyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },

  // SDMTScore Screen
  resultsContainerSDMT: {
    flexDirection: 'row',
    width: '80%',
    marginVertical: 20,
  },
  resultsColumn: {
    flex: 1,
  },
  resultText: {
    fontSize: 32,
    color: '#8D95B2',
    marginVertical: 5,
    textAlign: 'left',
    fontFamily: 'DMSans',
  },

  // Additional Login Page Styles from snippet
  loginHeading: {
    color: '#3d3d3d',
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'DMSans',
    marginBottom: 60,
    textAlign: 'center',
  },
  fieldLabel: {
    color: '#3d3d3d',
    fontSize: 16,
    fontFamily: 'DMSans',
    textTransform: 'capitalize',
    marginBottom: 10,
    alignSelf: 'left',
    marginLeft: 15,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 539,
    height: 51,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#dedfe1',
    borderRadius: 150,
    backgroundColor: '#fff',
    marginBottom: 30,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'DMSans',
    color: '#949494',
  },
  loginButtonContainer: {
    width: '100%',
    maxWidth: 539,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 64,
    backgroundColor: '#679186',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'DMSans',
    textAlign: 'center',
  },
  signUpLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  signUpText: {
    fontSize: 16,
    fontFamily: 'DMSans',
    color: '#949494',
  },
  signUpLinkText: {
    fontSize: 16,
    fontFamily: 'DMSans',
    color: '#2b2b2b',
    textDecorationLine: 'underline',
    marginLeft: 5,
  },
  logo: {
    marginBottom: 30,
    alignSelf: 'center',
  },
  patientCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: '90%',
    alignSelf: 'center',
  },
  patientCardText: {
    fontSize: 22,
    color: '#8D95B2',
    marginBottom: 5,
  },

  table: {
    width: '100%',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#264E70',
  },
  tableCell: {
    fontSize: 18,
    color: '#8D95B2',
  },

  backButton: {
    position: 'absolute',
    top: 40,
    left: 40,
    backgroundColor: '#679186',
    borderColor: '#679186',
  },

  // New Styles for Landscape Orientation
  containerLandscape: {
    flex: 1,
    backgroundColor: '#fffaf3',
    marginHorizontal: width * 0.05, // 5% of screen width
    marginVertical: height * 0.01, // 1% of screen height
  },
  sdmtMainLandscape: {
    flex: 1,
    flexDirection: 'row',
    padding: width * 0.02, // 2% of screen width
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sdmtLeftContainer: {
    flex: 2,
    marginRight: width * 0.02,
    maxWidth: width * 0.65,
  },
  sdmtRightContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  sdmtSymbolRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    marginVertical: height * 0.005,
    paddingHorizontal: width * 0.01,
  },
  sdmtNumKeyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },

  /** Container for the main TwoFlash content (question + focus area + bottom buttons) */
  twoFlashContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** Our invisible container in the middle, to constrain the flash & plus sign */
  focusContainer: {
    width: width * 0.7,  // 70% of screen width
    height: height * 0.4, // 40% of screen height
    backgroundColor: 'transparent',
    position: 'relative',
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fffaf3',
  },

  /** The plus sign is centered absolutely, but we can just center it with alignItems if we want.
   *  We'll keep a big font size so it's clearly visible. */
  plusSign: {
    fontSize: 50,
    color: '#264E70',
    textAlign: 'center',
    // Alternatively, you can absolutely center it:
    // position: 'absolute',
    // top: '50%',
    // left: '50%',
    // transform: [{ translateX: -50 }, { translateY: -50 }],
  },

  /** The flash is 150x150 circle by default, absolutely positioned within focusContainer */
  flash: {
    position: 'absolute',
    width: 150,
    height: 150,
    backgroundColor: '#AFD8FF',
    borderRadius: 75,
  },

  sdmtNumKeypad: {
    width: '100%',
    aspectRatio: 0.8,
    justifyContent: 'space-between',
  },
});
