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
    }
    this.moveCar = this.moveCar.bind(this);
  }

  moveCar(car, side) {
    this.setState((prevState) => ({ cars: { ...prevState.cars, [car]: side } }));
  }

  render() {
    const { children } = this.props;
    return (
      <MyContext.Provider value={ { ...this.state, moveCar: this.moveCar } }>
        { children }
      </MyContext.Provider>
    );
  }
}

Provider.propTypes = {
  children: PropTypes.node.isRequired;
};

export default Provider;
