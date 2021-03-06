import React, { Component } from 'react';
import { TwitterPicker } from 'react-color';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import ImageCropper from './ImageCropper';
import Cube from 'cubejs';
import IncompleteCube from "./incompleteCube";

import './Rubikfy.css';
import { CubeFaceGrid } from './Cube/CubeFaceGrid';
import { IncompleteCubeGrid } from './incompleteCubeGrid'
import { reshapeArrayToCubeFaceGrid } from './Cube/CubeGrid'

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
      faceGrid1: [],
      faceGrid2: [],
      cubeGrid: [],
      mouseIsPressed: false,
      currentColor: { r: 255, g: 255, b: 255 },
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

    this.handleMouseDownFaceGrid1 = this.handleMouseDownFaceGrid1.bind(this);
    this.handleMouseDownFaceGrid2 = this.handleMouseDownFaceGrid2.bind(this);
    this.handleMouseMoveFaceGrid1 = this.handleMouseMoveFaceGrid1.bind(this);
    this.handleMouseMoveFaceGrid2 = this.handleMouseMoveFaceGrid2.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleImage1Cropped = this.handleImage1Cropped.bind(this);
    this.handleImage2Cropped = this.handleImage2Cropped.bind(this);
    this.onCrop1Change = this.onCrop1Change.bind(this);
    this.onCrop2Change = this.onCrop2Change.bind(this);

  }

  componentDidMount() {
    const cubeGrid = new IncompleteCubeGrid(this.state.grid_width, this.state.grid_height);
    this.setState({ cubeGrid: cubeGrid });
    const faceGrid1 = cubeGrid.toFaceGrid(0);
    this.setState({ faceGrid1: faceGrid1 });
    const faceGrid2 = cubeGrid.toFaceGrid(3);
    this.setState({ faceGrid2: faceGrid2 });
  }

  handleMouseDownFaceGrid1(row, col, n_row, n_col) {
    this.setState({
      faceGrid1: changeNodeColor(this.state.faceGrid1, row, col, n_row, n_col, this.state.currentColor),
      mouseIsPressed: true
    }); // Should mouse down when leaving a grid
  }

  handleMouseDownFaceGrid2(row, col, n_row, n_col) {
    this.setState({
      faceGrid2: changeNodeColor(this.state.faceGrid2, row, col, n_row, n_col, this.state.currentColor),
      mouseIsPressed: true
    }); // Should mouse down when leaving a grid
  }

  handleMouseMoveFaceGrid1(row, col, n_row, n_col) {
    if (!this.state.mouseIsPressed) return;
    this.setState({ faceGrid1: changeNodeColor(this.state.faceGrid1, row, col, n_row, n_col, this.state.currentColor) });
  }

  handleMouseMoveFaceGrid2(row, col, n_row, n_col) {
    if (!this.state.mouseIsPressed) return;
    this.setState({ faceGrid2: changeNodeColor(this.state.faceGrid2, row, col, n_row, n_col, this.state.currentColor) });
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

  imageDataToRGBArray(imageData) {
    const pix = []
    for (var i = 0, j = 0, n = imageData.length; i < n; i += 4, j += 1) {
      pix[j] = { r: imageData[i], g: imageData[i + 1], b: imageData[i + 2] };
      // i+3 is alpha (the fourth element)
    }
    return pix;
  }

  componentDidUpdate(prevProps, prevState) {
    var image1Defined = (String(this.state.image1Data) !== "undefined" &&
      String(this.state.image1Data.data) !== "undefined") &&
      this.state.image1Data.data.length === this.state.grid_width * this.state.grid_height * 9 * 4;
    var image2Defined = (String(this.state.image2Data) !== "undefined" &&
      String(this.state.image2Data.data) !== "undefined") &&
      this.state.image2Data.data.length === this.state.grid_width * this.state.grid_height * 9 * 4;

    var newImage1Data = (prevState.image1Data !== this.state.image1Data ||
      prevState.thresh !== this.state.thresh);
    var newImage2Data = (prevState.image2Data !== this.state.image2Data ||
      prevState.thresh !== this.state.thresh);

    if (prevState.grid_width !== this.state.grid_width || prevState.grid_height !== this.state.grid_height) {
      const cubeGrid = new IncompleteCubeGrid(this.state.grid_width, this.state.grid_height);
      this.setState({ cubeGrid: cubeGrid });
      const faceGrid1 = cubeGrid.toFaceGrid(0);
      this.setState({ faceGrid1: faceGrid1 });
      const faceGrid2 = cubeGrid.toFaceGrid(3);
      this.setState({ faceGrid2: faceGrid2 });
      var crop1 = { ...this.state.crop1 };
      crop1.aspect = this.state.grid_width / this.state.grid_height;
      this.setState({ crop1: crop1 });
      var crop2 = { ...this.state.crop2 };
      crop2.aspect = this.state.grid_width / this.state.grid_height;
      this.setState({ crop2: crop2 });
    } else if (image1Defined && image2Defined && (newImage1Data || newImage2Data)) {
      // Update both grids with color quantization
      let imgData1 = this.state.image1Data;
      imgData1 = this.canvasFilter(imgData1, this.state.thresh);
      let pix1 = this.imageDataToRGBArray(imgData1.data);
      let imgData2 = this.state.image2Data;
      imgData2 = this.canvasFilter(imgData2, this.state.thresh);
      let pix2 = this.imageDataToRGBArray(imgData2.data);
      let cubeFaceGrid1 = reshapeArrayToCubeFaceGrid(this.state.grid_width, this.state.grid_height, pix1);
      let cubeFaceGrid2 = reshapeArrayToCubeFaceGrid(this.state.grid_width, this.state.grid_height, pix2);
      this.state.cubeGrid.setBothGrid(cubeFaceGrid1, cubeFaceGrid2);
      this.setState({ cubeGrid: this.state.cubeGrid });
      this.setState({ faceGrid1: this.state.cubeGrid.toFaceGrid(0) });
      this.setState({ faceGrid2: this.state.cubeGrid.toFaceGrid(3) });
      this.state.cubeGrid.grid[0][0].tryFirstCompleteCube();
    } else if (image1Defined && newImage1Data) {
      let imgData1 = this.state.image1Data;
      imgData1 = this.canvasFilter(imgData1, this.state.thresh);
      let pix1 = this.imageDataToRGBArray(imgData1.data);
      this.state.cubeGrid.setFaceGrid(0, reshapeArrayToCubeFaceGrid(this.state.grid_width, this.state.grid_height, pix1));
      this.setState({ cubeGrid: this.state.cubeGrid });
      this.setState({ faceGrid1: this.state.cubeGrid.toFaceGrid(0) });
    } else if (image2Defined && newImage2Data) {
      let imgData2 = this.state.image2Data;
      imgData2 = this.canvasFilter(imgData2, this.state.thresh);
      let pix2 = this.imageDataToRGBArray(imgData2.data);
      this.state.cubeGrid.setFaceGrid(3, reshapeArrayToCubeFaceGrid(this.state.grid_width, this.state.grid_height, pix2));
      this.setState({ cubeGrid: this.state.cubeGrid });
      this.setState({ faceGrid2: this.state.cubeGrid.toFaceGrid(3) });
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
                childMouseDown={this.handleMouseDownFaceGrid1}
                childMouseMove={this.handleMouseMoveFaceGrid1}
                grid_height={this.state.grid_height}
                grid_width={this.state.grid_width}
                grid={this.state.faceGrid1}
              ></CubeFaceGrid>
            </div>
          </div>
          <div className="grid-container-box">
            <div className="grid-container">
              <CubeFaceGrid
                onMouseUp={this.handleMouseUp}
                childMouseDown={this.handleMouseDownFaceGrid2}
                childMouseMove={this.handleMouseMoveFaceGrid2}
                grid_height={this.state.grid_height}
                grid_width={this.state.grid_width}
                grid={this.state.faceGrid2}
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
            min={2}
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

const changeNodeColor = (grid, cube_row, cube_col, node_row, node_col, color) => {
  grid[cube_row][cube_col][node_row][node_col] = color;
  return grid;
};
