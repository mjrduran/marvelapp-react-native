import {combineReducers} from '@reduxjs/toolkit';
import charactersReducer from './reducers/characters';

const rootReducer = combineReducers({
  charactersReducer: charactersReducer,
});

export default rootReducer;
