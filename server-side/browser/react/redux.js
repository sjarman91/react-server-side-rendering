'use strict'

const {createStore, applyMiddleware, combineReducers} = require('redux');
const thunkMiddleware = require('redux-thunk').default;
const createLogger = require('redux-logger')
const axios = require('axios')

// constants
const SET_PUPPIES = 'SET_PUPPIES'
const LIKE = 'LIKE'


// sync action creators
const setPuppies = puppies => ({type: SET_PUPPIES, puppies})
const like = id => ({type: LIKE, id})

// async action creators
const fetchPuppies = () => dispatch => {
  axios.get('/api/puppies')
    .then(res => {
      dispatch(setPuppies(res.data))
    })
}


let preloadedState = {puppies: []}

// allows us to avoid 'window is not defined' on the server
if (typeof(window) !== 'undefined') {
  preloadedState = window.__PRELOADED_STATE__
}


// reducer
const reducer = function(state = preloadedState, action) {
  switch (action.type) {
    case SET_PUPPIES:
      return Object.assign({}, {puppies: action.puppies})

    case LIKE:
      return Object.assign({}, {puppies: state.map(puppy => {
        if (puppy.id === action.id) {
          puppy.likes += 1
          return puppy
        }
        else {
          return puppy
        }
      })
    })

    default: return state
  }
}

const loggerMiddleware = createLogger()
const middleware = applyMiddleware(thunkMiddleware, loggerMiddleware)

const store = createStore(reducer, middleware);

module.exports = {store, like, fetchPuppies, reducer}
