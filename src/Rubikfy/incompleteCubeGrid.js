import { reshapeArrayToCubeFaceGrid } from './Cube/CubeGrid'
import { IncompleteCube } from './incompleteCube'

export class IncompleteCubeGrid {

    constructor(width, height) {
        this.grid = this.getInitialCubeGrid(width, height);
        this.width = width;
        this.height = height;
    }


    getInitialCubeGrid(width, height) {
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

    toFaceGrid(face) {
        const faceGrid = [];
        for (let row = 0; row < this.height; row++) {
            const currentRow = [];
            for (let col = 0; col < this.width; col++) {
                currentRow.push(this.grid[row][col].getFaceRGBMatrix(face));
            }
            faceGrid.push(currentRow);
        }
        return faceGrid;
    }

    setFaceGrid(face, faceGrid) {
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                this.grid[row][col].setFaceRGBColor(face, faceGrid[row][col]);
            }
        }
    }

    setBothGrid(frontFaceGrid, backFaceGrid) {
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                this.grid[row][col].setBothFaceRGBColor(frontFaceGrid[row][col], backFaceGrid[row][col]);
            }
        }
    }
}