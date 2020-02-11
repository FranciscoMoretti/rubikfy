import CubeQuantization from './cubeQuantization'

const RUBIK_COLORS = {
    U: { r: 255, g: 255, b: 255 },
    F: { r: 137, g: 18, b: 20 },
    R: { r: 13, g: 72, b: 172 },
    B: { r: 255, g: 85, b: 37 },
    L: { r: 25, g: 155, b: 76 },
    D: { r: 254, g: 213, b: 47 },
};

const RUBIK_COLORS_A = ['U', 'R', 'F', 'D', 'L', 'B'];

const CORNER_COLORS = [['U', 'R', 'F'], ['U', 'F', 'L'], ['U', 'L', 'B'], ['U', 'B', 'R'], ['D', 'F', 'R'], ['D', 'L', 'F'], ['D', 'B', 'L'], ['D', 'R', 'B']];

const EDGE_COLORS = [['U', 'R'], ['U', 'F'], ['U', 'L'], ['U', 'B'], ['D', 'R'], ['D', 'F'], ['D', 'L'], ['D', 'B'], ['F', 'R'], ['F', 'L'], ['B', 'L'], ['B', 'R']];

const RUBIK_COLORS_EXTENDED = Object.assign({}, RUBIK_COLORS, { E: { r: 100, g: 100, b: 100 } }) // add the empty element

function rubikToRGB(rubik) { return RUBIK_COLORS_EXTENDED[rubik] };

export class IncompleteCube {

    constructor() {
        this.frontFace = new Array(9).fill("E");
        this.backFace = new Array(9).fill("E");

        this.nearestColor = require('nearest-color').from(RUBIK_COLORS);
    }

    reshapeToMatrix(arr) {
        return [arr.slice(0, 3), arr.slice(3, 6), arr.slice(6, 9)];
    }

    reshapeFromMatrix(matrix) {
        return [...matrix[0], ...matrix[1], ...matrix[2]];
    }

    quantizeFilter(rgbColor) {
        // This whole function could be optimized with map
        const quantizeColor = (image) => {
            return this.nearestColor(image).name;
        }

        const pix = quantizeColor(rgbColor);
        return pix;
    }

    setNodeRubikColor(face, nodeNumber, rubikColor) {
        if (face === 0) {
            this.frontFace[nodeNumber] = rubikColor;
        } else if (face === 3) {
            this.backFace[nodeNumber] = rubikColor;
        } else {
            console.error("Incorrect face with id:", face);
        }
    }

    setFaceRGBColor(face, rgbColorMatrix) {
        var rgbColorArray = this.reshapeFromMatrix(rgbColorMatrix);
        var rubikColorArray = rgbColorArray.map(this.quantizeFilter, this);
        if (face === 0) {
            this.frontFace = rubikColorArray;
        } else if (face === 3) {
            this.backFace = rubikColorArray;
        } else {
            console.error("Incorrect face with id:", face);
        }

    }

    setBothFaceRGBColor(frontFaceRGBMatrix, backFaceRGBMatrix) {
        var front = this.reshapeFromMatrix(frontFaceRGBMatrix);
        var back = this.reshapeFromMatrix(backFaceRGBMatrix);

        var cubeQuantizer = new CubeQuantization()
        var quantizedFaces = cubeQuantizer.quantizeCubeFrontBack(front, back, RUBIK_COLORS);

        this.frontFace = quantizedFaces[0];
        this.backFace = quantizedFaces[1];
    }

    setNodeRGBColor(face, nodeNumber, rgbColor) {
        var rubikColor = this.quantizeFilter(rgbColor);
        this.setNodeRubikColor(face, nodeNumber, rubikColor);
    }

    getFrontFaceMatrix() {
        return this.reshapeToMatrix(this.frontFace);
    }
    getFaceRGBMatrix(face) {
        if (face === 0) {
            return this.reshapeToMatrix(this.frontFace.map(rubikToRGB));
        } else if (face === 3) {
            return this.reshapeToMatrix(this.backFace.map(rubikToRGB));
        } else {
            console.error("Incorrect face with id:", face);
        }
    }
    getBackFaceMatrix() {
        return this.reshapeToMatrix(this.backFace);
    }
    getBackFaceRGBMatrix() {
        return this.reshapeToMatrix(this.backFace.map(rubikToRGB));
    }

    toCompleteCube() {
        var cube = new Cube();
        var cubeDict = cube.toJSON();
        // Only need one center to define the needed ones
        var frontCenter = RUBIK_COLORS_A.indexOf(this.frontFace[4]);
        cubeDict.center = [...cubeDict.center.slice(frontCenter, 6), ...cubeDict.center.slice(0, frontCenter)];
        if (frontCenter % 2 === 1) { // swap once more if needed for a valid configuration
            let temp = cubeDict.center[1];
            cubeDict.center[1] = cubeDict.center[4];
            cubeDict.center[4] = temp;
        }

        var definedEdges = [
            this.frontFace[1],
            this.frontFace[3],
            this.frontFace[5],
            this.frontFace[7],
            this.backFace[1],
            this.backFace[3],
            this.backFace[5],
            this.backFace[7],
        ];
        var usedEdges = Array(12).fill(0);
        for (let i = 0; i < 12; i++) {
            for (let j = 0; j < 12; j++) {
                if (usedEdges[j] === 0) {
                    if (i < 8) {
                        if (EDGE_COLORS[j].includes(definedEdges[i])) {
                            cubeDict.ep[i] = j;
                            cubeDict.eo[i] = (EDGE_COLORS[j][0] === definedEdges[i]) ? 0 : 1;
                            usedEdges[j] = 1;
                            break;
}
                    } else if (i < 11) {
                        // place the reamaining 4
                        cubeDict.ep[i] = j;
                        cubeDict.eo[i] = 0;
                        usedEdges[j] = 1;
                        break;
                    } else { // last edge
                        cubeDict.ep[i] = j;
                        cubeDict.eo[i] = cubeDict.eo.reduce((a, b) => a + b, 0) % 2; // parity must be assured
                        usedEdges[j] = 1;
                    }
                }
            }
        }
    }
}

