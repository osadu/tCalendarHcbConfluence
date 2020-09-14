import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/TCalendarsHcbConfluence';
import * as serviceWorker from './serviceWorker';

document.addEventListener("DOMContentLoaded", function(event) {

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('tCalendarsHcbConfluence')
    //document.getElementById('root')
  );

});


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
