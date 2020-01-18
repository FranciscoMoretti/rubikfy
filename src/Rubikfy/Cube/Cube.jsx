import React, { Component } from 'react';
import Node from '../Node/Node';

import './Cube.css';

export default class Cube extends Component {

    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    handleMouseDown(row, col) {
        this.props.childMouseDown(this.props.row_id, this.props.col_id, row, col)
    }

    handleMouseMove(row, col) {
        this.props.childMouseMove(this.props.row_id, this.props.col_id, row, col)
    }

    render() {
        return (
            <div className="cube"
            // onMouseDown={(row_id, col_id) => this.props.onMouseDown(this.props.row_id, this.props.col_id)}
            >
                {
                    this.props.col.map((nodeRow, rowIdx) => {
                        return (
                            <div key={`div-${rowIdx}`}>
                                {
                                    nodeRow.map((nodeCol, nodeIdx) => {
                                        return (
                                            <Node
                                                key={`node-${rowIdx}-${nodeIdx}`}
                                                col={nodeIdx}
                                                color={nodeCol.color}
                                                onMouseDown={this.handleMouseDown}

                                                // mouseIsPressed={mouseIsPressed}
                                                onMouseMove={this.handleMouseMove}
                                                //{(row, col) =>
                                                // this.handleMouseMove(row, col)
                                                // }
                                                // onMouseUp={() => this.handleMouseUp()}
                                                row={rowIdx}></Node>
                                        );
                                    })
                                }
                            </div>
                        );
                    })
                }
            </div >
        );
    }
}
