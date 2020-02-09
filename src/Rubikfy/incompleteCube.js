const RUBIK_COLORS = {
    U: { r: 255, g: 255, b: 255 },
    F: { r: 137, g: 18, b: 20 },
    R: { r: 13, g: 72, b: 172 },
    B: { r: 255, g: 85, b: 37 },
    L: { r: 25, g: 155, b: 76 },
    D: { r: 254, g: 213, b: 47 },
};

const RUBIK_COLORS_A = ["U", "R", "F", "D", "L", "B"];

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

    distance(rgb1, rgb2) {
        return Math.pow(rgb1.r - rgb2.r, 2) + Math.pow(rgb1.g - rgb2.g, 2) + Math.pow(rgb1.b - rgb2.b, 2);
    }

    distanceMatrix(arr1, arr2, distanceOp) {
        const matrix = [];
        for (let row = 0; row < arr1.length; row++) {
            matrix[row] = [];
            for (let col = 0; col < arr2.length; col++) {
                matrix[row][col] = distanceOp(arr1[row], arr2[col]);
            }
        }
        return matrix;
    }

    indexOfMin(arr) {
        if (arr.length === 0) {
            return -1;
        }

        var min = arr[0];
        var minIndex = 0;

        for (var i = 1; i < arr.length; i++) {
            if (arr[i] < min) {
                minIndex = i;
                min = arr[i];
            }
        }

        return minIndex;
    }

    setBothFaceRGBColor(frontFaceRGBMatrix, backFaceRGBMatrix) {
        var front = this.reshapeFromMatrix(frontFaceRGBMatrix);
        var back = this.reshapeFromMatrix(backFaceRGBMatrix);

        var centers = [front[4], back[4]];
        var colors = RUBIK_COLORS_A.map(function (val) { return RUBIK_COLORS[val]; });

        var distMat = this.distanceMatrix(centers, colors, this.distance);
        distMat[1] = [distMat[1][3], distMat[1][4], distMat[1][5], distMat[1][0], distMat[1][1], distMat[1][2]];
        var distSumArr = [];
        for (let i = 0; i < 6; i++) {
            distSumArr[i] = distMat[0][i] + distMat[1][i];
        }
        var indOfBest = this.indexOfMin(distSumArr);
        var bestCenters = [RUBIK_COLORS_A[indOfBest], RUBIK_COLORS_A[(indOfBest + 3) % 6]];

        this.frontFace[4] = bestCenters[0];
        this.backFace[4] = bestCenters[1];

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
}