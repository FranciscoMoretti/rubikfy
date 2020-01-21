import React, { Component } from 'react';
import Cube from './Cube';

import './CubeGrid.css';

export default class CubeGrid extends Component {
    render() {
        return (
            <div className="grid"
                style={{ height: `${50 * (this.props.grid_height / this.props.grid_width)}vw` }}
                onMouseUp={() => this.props.onMouseUp()}
            >
                {this.props.grid.map((c_row, c_rowIdx) => {
                    return (
                        <div key={c_rowIdx} className="grid-row">
                            {c_row.map((c_col, c_colIdx) => {
                                return (
                                    <Cube
                                        // onMouseUp={() => this.handleMouseUp()}
                                        key={`cube-${c_rowIdx}-${c_colIdx}`}
                                        row_id={c_rowIdx} col_id={c_colIdx}
                                        row={c_row} col={c_col}
                                        childMouseDown={this.props.childMouseDown}
                                        childMouseMove={this.props.childMouseMove}
                                    // handleMouseEnter={this.handleMouseEnter}
                                    ></Cube>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }
}
