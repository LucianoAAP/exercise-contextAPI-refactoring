import React from 'react';
import './App.css';
import Cars from './Cars';
import MyContext from './context/MyContext';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      cars: {
        red: false,
        blue: false,
        yellow: false,
      },
    }
    this.moveCar = this.moveCar.bind(this);
  }

  moveCar(car, side) {
    this.setState((prevState) => ({ cars: { ...prevState.cars, [car]: side } }));
  }

  render() {
    return (
      <MyContext.Provider value={ { ...this.state, moveCar: this.moveCar } }>
        <Cars />
      </MyContext.Provider>
    );
  }
}

export default App;
