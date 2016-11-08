'use strict';

// typical server
const express = require('express');
const volleyball = require('volleyball');

// things the server needs to render react and the store
require('node-jsx').install()
const React = require('react');
const { renderToString } = require('react-dom/server')
const { createStore } = require('redux');
const { Provider } = require('react-redux');
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
app.listen(3000, function () {
  console.log('Server listening on port 3000...');
});

// server side logic
function renderFullPage(html, preloadedState) {
  return (
    '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width initial-scale=1.0"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" /><script src="public/bundle.js" defer></script><title>Puppy Likes</title></head><body><div id="app"><div>' + html + '</div><script>window.__PRELOADED_STATE__ =' + JSON.stringify(preloadedState) +'</script></body></html>'
    )
}

function handleRender(req, res) {

  const preloadedState = {puppies: puppyData}

  const store = createStore(reducer, preloadedState)
  const html = renderToString(React.createElement(AppWithProvider))
  const finalState = store.getState()

  res.send(renderFullPage(html, finalState))
}
