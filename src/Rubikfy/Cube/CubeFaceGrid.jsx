import React, { Component } from 'react';
import CubeFace from './CubeFace';

import './CubeFaceGrid.css';


export function reshapeMatrixToCubeFaceGrid(grid_width, grid_height, matrix) {
    const rowOneOffset = grid_width * 3;
    const rowTwoOffset = 2 * grid_width * 3;
    const rowCubeOffset = 3 * grid_width * 3;
    const cubeFaceGrid = [];
    for (let row = 0; row < grid_height; row++) {
        cubeFaceGrid[row] = [];
        const row_offset = row * rowCubeOffset;
        for (let col = 0; col < grid_width; col++) {
            const col_offset = col * 3;
            cubeFaceGrid[row][col] =
                [matrix.slice(row_offset + col_offset, row_offset + col_offset + 3),
                matrix.slice(row_offset + col_offset + rowOneOffset, row_offset + col_offset + rowOneOffset + 3),
                matrix.slice(row_offset + col_offset + rowTwoOffset, row_offset + col_offset + rowTwoOffset + 3)];
        }
    }
    return cubeFaceGrid;
};



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
