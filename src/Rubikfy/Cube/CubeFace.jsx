import React, { Component } from 'react';
import Node from '../Node/Node';

import './CubeFace.css';

export default class CubeFace extends Component {

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
            <div className="cube-face"
            // onMouseDown={(row_id, col_id) => this.props.onMouseDown(this.props.row_id, this.props.col_id)}
            >
                {
                    this.props.matrix.map((nodeRow, rowIdx) => {
                        return (
                            <div key={`div-${rowIdx}`} className="cube-row">
                                {
                                    nodeRow.map((node, nodeIdx) => {
                                        return (
                                            <Node
                                                key={`node-${rowIdx}-${nodeIdx}`}
                                                col={nodeIdx}
                                                color={node}
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
