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

    const extraClassName = this.props.color !== "gray"
      ? 'node-visited'
      : '';


    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        style={{ backgroundColor: this.props.color }}
        onMouseDown={(row, col) => this.props.onMouseDown(this.props.row, this.props.col)}
        onMouseMove={(row, col) => this.props.onMouseMove(this.props.row, this.props.col)}
      // onMouseUp={() => onMouseUp()}

      ></div>
    );
  }
}
