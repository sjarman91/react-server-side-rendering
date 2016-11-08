'use strict';

// typical server
const express = require('express');
const volleyball = require('volleyball');

// things the server needs to render react and the store
require('node-jsx').install()
const React = require('react');
const { renderToString } = require('react-dom/server')
const { createStore } = require('redux');
const { reducer } = require('./browser/react/redux')
const puppyData = require('./puppy').puppyData


// the app itself
const {AppWithProvider} = require('./browser/react/app')

// the express app
const app = express();

app.use(volleyball);
app.use('/public', express.static('public'));

// puppies stored on server
app.get('/api/puppies', function (req, res) {
  res.send(puppyData)
})

// Server side rendering!
app.use(handleRender)

// server listening!
app.listen(1337, function () {
  console.log('Server listening on port 1337...');
});

// server side logic
function renderFullPage(html, preloadedState) {
  return (
    '<!DOCTYPE html><html><head><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" /><script src="public/bundle.js" defer></script><title>Server Side</title></head><body><div id="app"><div>' + html + '</div><script>window.__PRELOADED_STATE__ =' + JSON.stringify(preloadedState) +'</script></body></html>'
    )
}

function handleRender(req, res) {

  const preloadedState = {puppies: puppyData}

  const store = createStore(reducer, preloadedState)
  const html = renderToString(React.createElement(AppWithProvider))
  const finalState = store.getState()

  res.send(renderFullPage(html, finalState))
}
