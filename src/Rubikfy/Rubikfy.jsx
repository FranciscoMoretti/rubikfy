import React, { Component } from 'react';
import { TwitterPicker } from 'react-color';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import ImageCropper from './ImageCropper';

import './Rubikfy.css';
import CubeGrid from './Cube/CubeGrid';


const COLORS = {
  white: { r: 255, g: 255, b: 255 },
  red: { r: 137, g: 18, b: 20 },
  blue: { r: 13, g: 72, b: 172 },
  orange: { r: 255, g: 85, b: 37 },
  green: { r: 25, g: 155, b: 76 },
  yellow: { r: 254, g: 213, b: 47 },
};

export default class Rubikfy extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      currentColor: '#fff',
      grid_width: 3,
      grid_height: 3,
      thresh: 100,
      image: 0,
      crop: {
        unit: '%',
        width: 50,
        aspect: 1,
        x: 25,
      },
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleImageCropped = this.handleImageCropped.bind(this);
    this.onCropChange = this.onCropChange.bind(this);
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
    this.setState({ currentColor: color.rgb });
  };


  handleWidthSliderChangeComplete = (event, value) => {
    this.setState({ grid_width: value });
    var crop = { ...this.state.crop };
    crop.aspect = value / this.state.grid_height;
    const grid = getInitialGrid(value, this.state.grid_height);
    this.setState({ grid });
    this.setState({ crop: crop });
  };


  handleHeightSliderChangeComplete = (event, value) => {
    this.setState({ grid_height: value });
    var crop = { ...this.state.crop };
    crop.aspect = this.state.grid_width / value;
    const grid = getInitialGrid(this.state.grid_width, value);
    this.setState({ grid });
    this.setState({ crop: crop });
  };

  handleThreshSliderChangeComplete = (event, value) => {
    this.setState({ thresh: value })
  };

  handleImageCropped = (imgData) => {
    this.setState({ imageData: imgData })
  }

  canvasFilter(imgData, thresh) {
    var canvasfilters = require('canvas-filters');
    return canvasfilters.Dither(imgData, thresh);
  }

  quantizeFilter(imgDataData) {

    var nearestColor = require('nearest-color').from(COLORS);

    // This whole function could be optimized with map
    const quantizeColor = (image) => {
      return nearestColor(image).rgb;
    }

    const pix = []
    // Loop over each pixel and invert the color.
    for (var i = 0, j = 0, n = imgDataData.length; i < n; i += 4, j += 1) {
      pix[j] = quantizeColor({ r: imgDataData[i], g: imgDataData[i + 1], b: imgDataData[i + 2] });
      // i+3 is alpha (the fourth element)
    }
    return pix;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.imageData !== this.state.imageData &&
      String(this.state.imageData) !== "undefined" &&
      String(this.state.imageData.data) !== "undefined") {
      var imgData = this.state.imageData;
      imgData = this.canvasFilter(imgData, this.state.thresh);
      var pix = this.quantizeFilter(imgData.data);
      const newGrid = getNewGridWithImage(this.state.grid, this.state.grid_width, this.state.grid_height, pix);
      this.setState({ grid: newGrid });
    }
  }

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    this.setState({ crop: percentCrop });
    // this.setState({ crop });
  };

  render() {
    return (
      <>
        <div style={{ height: "100px" }}></div>
        <div className="grid-container-box">
          <div className="grid-container">
            <CubeGrid
              onMouseUp={this.handleMouseUp}
              childMouseDown={this.handleMouseDown}
              childMouseMove={this.handleMouseMove}
              grid_height={this.state.grid_height}
              grid_width={this.state.grid_width}
              grid={this.state.grid}
            ></CubeGrid>
          </div>
        </div>
        <br />
        <div>
          <TwitterPicker
            colors={['#199b4c', '#891214', '#0d47ac', '#ff5425', '#ffffff', '#fed52f']}
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
        <Slider
          defaultValue={100}
          aria-labelledby="discrete-slider"
          onChangeCommitted={this.handleThreshSliderChangeComplete}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={255}
        />
        <ImageCropper
          onImageCropped={this.handleImageCropped}
          onCropChange={this.onCropChange}
          crop={this.state.crop}
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
    color: { r: 100, g: 100, b: 100 },
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

const getNewGridWithImage = (grid, grid_width, grid_height, imageRGB) => {
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
        [imageRGB.slice(row_offset + col_offset, row_offset + col_offset + 3),
        imageRGB.slice(row_offset + col_offset + rowOneOffset, row_offset + col_offset + rowOneOffset + 3),
        imageRGB.slice(row_offset + col_offset + rowTwoOffset, row_offset + col_offset + rowTwoOffset + 3)];
      newGrid[row][col] = setCubeColors(cube, cubeColors);
    }
  }
  return newGrid;
};

const setCubeColors = (cube, colorsRGB) => {
  const newCube = cube.slice();
  for (let n_row = 0; n_row < 3; n_row++) {
    for (let n_col = 0; n_col < 3; n_col++) {
      const node = newCube[n_row][n_col];
      const newNode = {
        ...node,
        color: colorsRGB[n_row][n_col],
      };
      newCube[n_row][n_col] = newNode;
    }
  }
  return newCube;
}