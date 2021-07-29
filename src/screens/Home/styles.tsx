import {StyleSheet, Dimensions} from 'react-native';
import colors from '../../constants/colors';

let width = Dimensions.get('screen').width;
let proportion = 1.77;

const styles = StyleSheet.create({
  characterImage: {
    width: width - 32,
    height: width / proportion,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    margin: 10,
  },
  buttonClose: {
    backgroundColor: colors.primaryColor,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 8,
  },
  mainList: {
    margin: 10,
  },
  loading: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 10,
    padding: 10,
  },
  searchContainer: {
    margin: 10,
    padding: 10,
  },
  detailsContainer: {
    flex: 1,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  favoriteButton: {
    width: 32,
    height: 32,
  },
  favoriteSearchButton: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default styles;
