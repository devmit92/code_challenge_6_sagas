import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App.js';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
// Provider allows us to use redux within our react app
import { Provider } from 'react-redux';
import logger from 'redux-logger';
// Import saga middleware
import createSagaMiddleware from 'redux-saga';
import Axios from 'axios';
import { put } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga/effects';

// Your saga should listen for the action type of `GET_ZOO_ANIMALS`
function* rootSaga() {
    // YOUR CODE HERE
   yield takeEvery('GET_ZOO_ANIMALS', getAnimals)
}

function* getAnimals() {
    try {
        let response = yield Axios.get('/zoo');
        yield put({type: 'SET_ZOO_ANIMALS', payload: response.data})
    } catch (error) {
        console.warn(`Error: ${error}`);
    }
}

// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// Used to store class and number of unique animals in that class
const zooAnimals = (state = [], action) => {
    switch (action.type) {
        case 'SET_ZOO_ANIMALS':
            return action.payload;
        default:
            return state;
    }
}

// Create one store that all components can use
const storeInstance = createStore(
    combineReducers({
        zooAnimals,
    }),
    // Add sagaMiddleware to our store
    applyMiddleware(sagaMiddleware, logger),
);

// Pass rootSaga into our sagaMiddleware
sagaMiddleware.run(rootSaga);

ReactDOM.render(<Provider store={storeInstance}><App /></Provider>, 
    document.getElementById('root'));
registerServiceWorker();
