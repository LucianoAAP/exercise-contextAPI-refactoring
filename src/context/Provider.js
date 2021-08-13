import React from 'react';
import PropTypes from 'prop-types';
import MyContext from './MyContext';

class Provider extends React.Component {
  constructor() {
    super();
    this.state = {
      cars: {
        red: false,
        blue: false,
        yellow: false,
      },
      signal: { color: 'red' },
    }
    this.moveCar = this.moveCar.bind(this);
    this.changeSignal = this.changeSignal.bind(this);
  }

  moveCar(car, side) {
    this.setState((prevState) => ({ cars: { ...prevState.cars, [car]: side } }));
  }

  changeSignal(color) {
    this.setState({ signal: { color } });
  };

  render() {
    const { children } = this.props;
    return (
      <MyContext.Provider
        value={
          { ...this.state, moveCar: this.moveCar, changeSignal: this.changeSignal }
        }
      >
        { children }
      </MyContext.Provider>
    );
  }
}

Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Provider;
