import React from 'react';
import styles from './app.css';

export default class App extends React.Component {
  render() {
    return (
        <div id="app">
            <h1>React + Webpack 3 HMR + React Hot Loader 3</h1>
            <p>
                Test HMR by adding text into the text area below and
                then adding/removing/changing text/css/elements on this page.
                Changes should be reflected without browser refresh whilst keeping the text
                in the textarea unchanged (maintaining the state).
            </p>
            <textarea/>
        </div>
    );
  }
}