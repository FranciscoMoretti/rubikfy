import React, { Component } from 'react';
import CubeFace from './CubeFace';

import './CubeFaceGrid.css';

export class CubeFaceGrid extends Component {
    adaptWidthHeight() {
        if (this.props.grid_width > this.props.grid_height) {
            return {
                height: `${100 * (this.props.grid_height / this.props.grid_width)}%`,
                width: `${100}%`,
            };
        } else {
            return {
                height: `${100}%`,
                width: `${100 * (this.props.grid_width / this.props.grid_height)}%`,
            };
        }
    }

    render() {
        return (
            <div className="grid"
                style={this.adaptWidthHeight()}
                onMouseUp={() => this.props.onMouseUp()}
            >
                {this.props.grid.map((c_row, c_rowIdx) => {
                    return (
                        <div key={c_rowIdx} className="grid-row">
                            {c_row.map((cubeFaceMatrix, c_colIdx) => {
                                return (
                                    <CubeFace
                                        // onMouseUp={() => this.handleMouseUp()}
                                        key={`cube-${c_rowIdx}-${c_colIdx}`}
                                        row_id={c_rowIdx} col_id={c_colIdx}
                                        matrix={cubeFaceMatrix}
                                        childMouseDown={this.props.childMouseDown}
                                        childMouseMove={this.props.childMouseMove}
                                    // handleMouseEnter={this.handleMouseEnter}
                                    ></CubeFace>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }
}
