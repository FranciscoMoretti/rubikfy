import React, { Component } from 'react';

import './Node.css';

export default class Node extends Component {
  render() {
    const {
      col,
      // isFinish,
      // isStart,
      // isWall,
      // onMouseDown,
      // onMouseMove,
      // onMouseUp,
      row,
    } = this.props;

    const extraClassName = (this.props.color.r !== 100 || this.props.color.g !== 100 || this.props.color.g !== 100)
      ? 'node-visited'
      : '';

    var styles = {
      backgroundColor: `rgb(${this.props.color.r}, ${this.props.color.g}, ${this.props.color.b})`,
    };

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        style={styles}
        onMouseDown={(row, col) => this.props.onMouseDown(this.props.row, this.props.col)}
        onMouseMove={(row, col) => this.props.onMouseMove(this.props.row, this.props.col)}
      ></div>
    );
  }
}
