import React, { Component } from 'react';
import Cube from "./Cube/Cube";
import { TwitterPicker } from 'react-color';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import ImageCropper from './ImageCropper';

import './Rubikfy.css';

export default class Rubikfy extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      currentColor: '#fff',
      grid_width: 3,
      grid_height: 3,
      image: 0,
      hexImg: [],
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleImageCropped = this.handleImageCropped.bind(this);
  }

  saveUri(uri) {
    this.setState({ image: uri })
  }

  fileChangedHandler(event) {
    var fileInput = false
    if (event.target.files[0]) {
      fileInput = true
    }
    if (fileInput) {
      Resizer.imageFileResizer(
        event.target.files[0],
        9,
        9,
        'JPEG',
        100,
        0,
        uri => {
          this.saveUri(uri)
        },
        'base64'
      );
  }
  }

  componentDidMount() {
    const grid = getInitialGrid(this.state.grid_width, this.state.grid_height);
    this.setState({ grid });
  }

  handleMouseDown(row, col, n_row, n_col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col, n_row, n_col, this.state.currentColor);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseMove(row, col, n_row, n_col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col, n_row, n_col, this.state.currentColor);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  handleChangeComplete = (color) => {
    this.setState({ currentColor: color.hex });
  };


  handleWidthSliderChangeComplete = (event, value) => {
    this.setState({ grid_width: value })
    const grid = getInitialGrid(value, this.state.grid_height);
    this.setState({ grid });    // this.setState({ currentColor: color.hex });
  };


  handleHeightSliderChangeComplete = (event, value) => {
    this.setState({ grid_height: value })
    const grid = getInitialGrid(this.state.grid_width, value);
    this.setState({ grid });    // this.setState({ currentColor: color.hex });
  };

  handleImageCropped = (hexArr) => {
    this.setState({ hexImg: hexArr })
    const newGrid = getNewGridWithImage(this.state.grid, this.state.grid_width, this.state.grid_height, this.state.hexImg);
    this.setState({ grid: newGrid });
  }

  render() {
    return (
      <>
        <div style={{ height: "100px" }}></div>
        <div className="grid"
          onMouseUp={() => this.handleMouseUp()}
        >
          {this.state.grid.map((c_row, c_rowIdx) => {
            return (
              <div key={c_rowIdx}>
                {c_row.map((c_col, c_colIdx) => {
                  return (
                    <Cube
                      // onMouseUp={() => this.handleMouseUp()}
                      key={`cube-${c_rowIdx}-${c_colIdx}`}
                      row_id={c_rowIdx} col_id={c_colIdx}
                      row={c_row} col={c_col}
                      childMouseDown={this.handleMouseDown}
                      childMouseMove={this.handleMouseMove}
                    // handleMouseEnter={this.handleMouseEnter}
                    ></Cube>
                  );
                })}
              </div>
            );
          })}
        </div>
        <br />
        <div>
          <TwitterPicker
            colors={['#009B48', '#B90000', '#0045AD', '#FF5900', '#FFFFFF', '#FFD500']}
            color={this.state.currentColor}
            onChangeComplete={this.handleChangeComplete}
          />
        </div>
        <br />
        <Typography id="discrete-slider" gutterBottom>
          Width
        </Typography>
        <Slider
          defaultValue={3}
          aria-labelledby="discrete-slider"
          onChangeCommitted={this.handleWidthSliderChangeComplete}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={10}
        />
        <Typography id="discrete-slider" gutterBottom>
          Height
        </Typography>
        <Slider
          defaultValue={3}
          aria-labelledby="discrete-slider"
          onChangeCommitted={this.handleHeightSliderChangeComplete}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={10}
        />
        <ImageCropper
          onImageCropped={this.handleImageCropped}
          width={this.state.grid_width * 3}
          height={this.state.grid_height * 3}
        />
      </>
    );
  }
}

const getInitialGrid = (width, height) => {
  const grid = [];
  for (let row = 0; row < height; row++) {
    const currentRow = [];
    for (let col = 0; col < width; col++) {
      currentRow.push(getCubeGrid());
    }
    grid.push(currentRow);
  }
  return grid;
};

const getCubeGrid = () => {
  const grid = [];
  for (let row = 0; row < 3; row++) {
    const currentRow = [];
    for (let col = 0; col < 3; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    color: "gray",
  };
};

const getNewGridWithWallToggled = (grid, row, col, n_row, n_col, color) => {
  const newGrid = grid.slice();
  const cube = newGrid[row][col];
  const newCube = cube.slice();
  const node = newCube[n_row][n_col];
  const newNode = {
    ...node,
    color: color,
  };
  newCube[n_row][n_col] = newNode;
  newGrid[row][col] = newCube;
  return newGrid;
};

const getNewGridWithImage = (grid, grid_width, grid_height, imageHex) => {
  const rowOneOffset = grid_width * 3;
  const rowTwoOffset = 2 * grid_width * 3;
  const rowCubeOffset = 3 * grid_width * 3;
  const newGrid = grid.slice();
  for (let row = 0; row < grid_height; row++) {
    const row_offset = row * rowCubeOffset;
    for (let col = 0; col < grid_width; col++) {
      const col_offset = col * 3;
      const cube = newGrid[row][col];
      const cubeColors =
        [imageHex.slice(row_offset + col_offset, row_offset + col_offset + 3),
        imageHex.slice(row_offset + col_offset + rowOneOffset, row_offset + col_offset + rowOneOffset + 3),
        imageHex.slice(row_offset + col_offset + rowTwoOffset, row_offset + col_offset + rowTwoOffset + 3)];
      newGrid[row][col] = setCubeColors(cube, cubeColors);
    }
  }
  return newGrid;
};

const setCubeColors = (cube, colorsHex) => {
  const newCube = cube.slice();
  for (let n_row = 0; n_row < 3; n_row++) {
    for (let n_col = 0; n_col < 3; n_col++) {
      const node = newCube[n_row][n_col];
      const newNode = {
        ...node,
        color: colorsHex[n_row][n_col],
      };
      newCube[n_row][n_col] = newNode;
    }
  }
  return newCube;
}