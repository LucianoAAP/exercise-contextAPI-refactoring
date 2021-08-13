import React from 'react';
import TrafficSignal from './TrafficSignal';
import './App.css';
import Cars from './Cars';
import Provider from './context/Provider';

function App() {
  return (
    <Provider>
      <div className="container">
      <Cars />
      <TrafficSignal />
    </div>
    </Provider>
  );
}

export default App;
