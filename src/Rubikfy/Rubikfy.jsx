import React, { Component } from 'react';
import { TwitterPicker } from 'react-color';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import ImageCropper from './ImageCropper';
import IncompleteCube from "./incompleteCube";

import './Rubikfy.css';
import CubeFaceGrid from './Cube/CubeFaceGrid';


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
      grid1: [],
      grid2: [],
      cubeGrid: [],
      mouseIsPressed: false,
      currentColor: '#fff',
      grid_width: 3,
      grid_height: 3,
      thresh: 100,
      crop1: {
        unit: '%',
        width: 50,
        aspect: 1,
        x: 25,
      },
      crop2: {
        unit: '%',
        width: 50,
        aspect: 1,
        x: 25,
      },
    };

    this.handleMouseDownGrid1 = this.handleMouseDownGrid1.bind(this);
    this.handleMouseDownGrid2 = this.handleMouseDownGrid2.bind(this);
    this.handleMouseMoveGrid1 = this.handleMouseMoveGrid1.bind(this);
    this.handleMouseMoveGrid2 = this.handleMouseMoveGrid2.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleImage1Cropped = this.handleImage1Cropped.bind(this);
    this.handleImage2Cropped = this.handleImage2Cropped.bind(this);
    this.onCrop1Change = this.onCrop1Change.bind(this);
    this.onCrop2Change = this.onCrop2Change.bind(this);

  }

  componentDidMount() {
    const cubeGrid = getInitialCubeGrid(this.state.grid_width, this.state.grid_height);
    this.setState({ cubeGrid: cubeGrid });
    const grid1 = getInitialGrid(this.state.grid_width, this.state.grid_height);
    this.setState({ grid1: grid1 });
    const grid2 = getInitialGrid(this.state.grid_width, this.state.grid_height);
    this.setState({ grid2: grid2 });
  }

  handleMouseDownGrid1(row, col, n_row, n_col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid1, row, col, n_row, n_col, this.state.currentColor);
    this.setState({ grid1: newGrid, mouseIsPressed: true }); // Should mouse down when leaving a grid
  }

  handleMouseDownGrid2(row, col, n_row, n_col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid2, row, col, n_row, n_col, this.state.currentColor);
    this.setState({ grid2: newGrid, mouseIsPressed: true }); // Should mouse down when leaving a grid
  }

  handleMouseMoveGrid1(row, col, n_row, n_col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid1, row, col, n_row, n_col, this.state.currentColor);
    this.setState({ grid1: newGrid });
  }

  handleMouseMoveGrid2(row, col, n_row, n_col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid2, row, col, n_row, n_col, this.state.currentColor);
    this.setState({ grid2: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  handleChangeComplete = (color) => {
    this.setState({ currentColor: color.rgb });
  };


  handleWidthSliderChangeComplete = (event, value) => {
    this.setState({ grid_width: value });
  };

  handleHeightSliderChangeComplete = (event, value) => {
    this.setState({ grid_height: value });
  };

  handleThreshSliderChangeComplete = (event, value) => {
    this.setState({ thresh: value })
  };

  handleImage1Cropped = (imgData) => {
    this.setState({ image1Data: imgData })
  }

  handleImage2Cropped = (imgData) => {
    this.setState({ image2Data: imgData })
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
    if (prevState.image1Data !== this.state.image1Data ||
      prevState.thresh !== this.state.thresh) {
      if (String(this.state.image1Data) !== "undefined" &&
        String(this.state.image1Data.data) !== "undefined") {
        var imgData1 = this.state.image1Data;
        imgData1 = this.canvasFilter(imgData1, this.state.thresh);
        var pix1 = this.quantizeFilter(imgData1.data);
        const newGrid = getNewGridWithImage(this.state.grid1, this.state.grid_width, this.state.grid_height, pix1);
        this.setState({ grid1: newGrid });
      }
    }
    if (prevState.image2Data !== this.state.image2Data ||
      prevState.thresh !== this.state.thresh) {
      if (String(this.state.image2Data) !== "undefined" &&
        String(this.state.image2Data.data) !== "undefined") {
        var imgData2 = this.state.image2Data;
        imgData2 = this.canvasFilter(imgData2, this.state.thresh);
        var pix2 = this.quantizeFilter(imgData2.data);
        const newGrid = getNewGridWithImage(this.state.grid2, this.state.grid_width, this.state.grid_height, pix2);
        this.setState({ grid2: newGrid });
      }
    }
    if (prevState.grid_width !== this.state.grid_width || prevState.grid_height !== this.state.grid_height) {
      const cubeGrid = getInitialCubeGrid(this.state.grid_width, this.state.grid_height);
      this.setState({ cubeGrid: cubeGrid });
      const grid1 = getInitialGrid(this.state.grid_width, this.state.grid_height);
      this.setState({ grid1: grid1 });
      const grid2 = getInitialGrid(this.state.grid_width, this.state.grid_height);
      this.setState({ grid2: grid2 });
      var crop1 = { ...this.state.crop1 };
      crop1.aspect = this.state.grid_width / this.state.grid_height;
      this.setState({ crop1: crop1 });
      var crop2 = { ...this.state.crop2 };
      crop2.aspect = this.state.grid_width / this.state.grid_height;
      this.setState({ crop2: crop2 });
    }
  }

  onCrop1Change = (crop, percentCrop) => {
    // You could also use crop:
    this.setState({ crop1: percentCrop });
  };

  onCrop2Change = (crop, percentCrop) => {
    // You could also use crop:
    this.setState({ crop2: percentCrop });
  };

  render() {
    return (
      <>
        <br />
        <div>
          <TwitterPicker // Should replace with a custom one with only squares
            colors={['#199b4c', '#891214', '#0d47ac', '#ff5425', '#ffffff', '#fed52f']}
            color={this.state.currentColor}
            onChangeComplete={this.handleChangeComplete}
            triangle="hide"
          />
        </div>
        <br />
        <div className="multi-grid-container">
          <div className="grid-container-box">
            <div className="grid-container">
              <CubeFaceGrid
                onMouseUp={this.handleMouseUp}
                childMouseDown={this.handleMouseDownGrid1}
                childMouseMove={this.handleMouseMoveGrid1}
                grid_height={this.state.grid_height}
                grid_width={this.state.grid_width}
                grid={this.state.grid1}
              ></CubeFaceGrid>
            </div>
          </div>
          <div className="grid-container-box">
            <div className="grid-container">
              <CubeFaceGrid
                onMouseUp={this.handleMouseUp}
                childMouseDown={this.handleMouseDownGrid2}
                childMouseMove={this.handleMouseMoveGrid2}
                grid_height={this.state.grid_height}
                grid_width={this.state.grid_width}
                grid={this.state.grid2}
              ></CubeFaceGrid>
            </div>
          </div>
        </div >
        <br />
        <div style={{ width: "80%", margin: "auto" }}>
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
          <Typography id="discrete-slider" gutterBottom>
            Dither
        </Typography>
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
        </div>
        <br />
        <div className="multi-crop-container">
          <div className="crop-container-box">

            <ImageCropper
              onImageCropped={this.handleImage1Cropped}
              onCropChange={this.onCrop1Change}
              crop={this.state.crop1}
              width={this.state.grid_width * 3}
              height={this.state.grid_height * 3}
            />
          </div>
          <div className="crop-container-box">
            <ImageCropper
              onImageCropped={this.handleImage2Cropped}
              onCropChange={this.onCrop2Change}
              crop={this.state.crop2}
              width={this.state.grid_width * 3}
              height={this.state.grid_height * 3}
            />
          </div>
        </div>
      </>
    );
  }
}

const getInitialCubeGrid = (width, height) => {
  const grid = [];
  for (let row = 0; row < height; row++) {
    const currentRow = [];
    for (let col = 0; col < width; col++) {
      currentRow.push(new IncompleteCube());
    }
    grid.push(currentRow);
  }
  return grid;
};

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