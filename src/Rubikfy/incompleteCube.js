import CubeQuantization from './cubeQuantization'
import Cube, { solve } from "cubejs"

const RUBIK_COLORS = {
    U: { r: 255, g: 255, b: 255 },  //white
    F: { r: 137, g: 18, b: 20 },    //red
    R: { r: 13, g: 72, b: 172 },    //blue
    B: { r: 255, g: 85, b: 37 },    //orange
    L: { r: 25, g: 155, b: 76 },    //green
    D: { r: 254, g: 213, b: 47 },   //yellow
};

const RUBIK_COLORS_A = ['U', 'R', 'F', 'D', 'L', 'B'];

const CORNER_COLORS = [['U', 'R', 'F'], ['U', 'F', 'L'], ['U', 'L', 'B'], ['U', 'B', 'R'], ['D', 'F', 'R'], ['D', 'L', 'F'], ['D', 'B', 'L'], ['D', 'R', 'B']];

const EDGE_COLORS = [['U', 'R'], ['U', 'F'], ['U', 'L'], ['U', 'B'], ['D', 'R'], ['D', 'F'], ['D', 'L'], ['D', 'B'], ['F', 'R'], ['F', 'L'], ['B', 'L'], ['B', 'R']];

// Centers
var B, BL, BR, D, DB, DBL, DF, DFR, DL, DLF, DR, DRB, F, FL, FR, L, R, U, UB, UBR, UF, UFL, UL, ULB, UR, URF, centerColor, centerFacelet, cornerColor, cornerFacelet, edgeColor, edgeFacelet;

[U, R, F, D, L, B] = [0, 1, 2, 3, 4, 5];

// Corners
[URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB] = [0, 1, 2, 3, 4, 5, 6, 7];

// Edges
[UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

centerColor = ['U', 'R', 'F', 'D', 'L', 'B'];

cornerColor = [['U', 'R', 'F'], ['U', 'F', 'L'], ['U', 'L', 'B'], ['U', 'B', 'R'], ['D', 'F', 'R'], ['D', 'L', 'F'], ['D', 'B', 'L'], ['D', 'R', 'B']];

edgeColor = [['U', 'R'], ['U', 'F'], ['U', 'L'], ['U', 'B'], ['D', 'R'], ['D', 'F'], ['D', 'L'], ['D', 'B'], ['F', 'R'], ['F', 'L'], ['B', 'L'], ['B', 'R']];


Cube.prototype.de = Array(12).fill(-1);

Cube.prototype.randomizeSideFaces = (function () {
    var arePermutationsValid, generateValidRandomOrientation, generateValidRandomPermutation, getNumSwaps, isOrientationValid, randint, randomizeOrientation, result, shuffle;
    randint = function (min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    };
    // Fisher-Yates shuffle adapted from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    shuffle = function (array) {
        var currentIndex, randomIndex, temporaryValue;
        currentIndex = array.length;
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = randint(0, currentIndex - 1);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
    };
    getNumSwaps = function (arr) {
        var cur, cycleLength, i, k, numSwaps, ref, seen, x;
        numSwaps = 0;
        seen = (function () {
            var k, ref, results;
            results = [];
            for (x = k = 0, ref = arr.length - 1; (0 <= ref ? k <= ref : k >= ref); x = 0 <= ref ? ++k : --k) {
                results.push(false);
            }
            return results;
        })();
        while (true) {
            // We compute the cycle decomposition
            cur = -1;
            for (i = k = 0, ref = arr.length - 1; (0 <= ref ? k <= ref : k >= ref); i = 0 <= ref ? ++k : --k) {
                if (!seen[i]) {
                    cur = i;
                    break;
                }
            }
            if (cur === -1) {
                break;
            }
            cycleLength = 0;
            while (!seen[cur]) {
                seen[cur] = true;
                cycleLength++;
                cur = arr[cur];
            }
            // A cycle is equivalent to cycleLength + 1 swaps
            numSwaps += cycleLength + 1;
        }
        return numSwaps;
    };
    arePermutationsValid = function (cp, ep) {
        var numSwaps;
        numSwaps = getNumSwaps(ep) + getNumSwaps(cp);
        return numSwaps % 2 === 0;
    };
    generateValidRandomPermutation = function (cp, ep) {
        // Each shuffle only takes around 12 operations and there's a 50%
        // chance of a valid permutation so it'll finish in very good time
        // Get undefined subset
        var epu = ep.slice(8, 12);
        var cpu = cp.slice(8, 12);
        shuffle(epu);
        shuffle(cpu);
        while (!arePermutationsValid([...cp.slice(0, 8), ...cpu], [...ep.slice(0, 8), ...epu])) {
            shuffle(epu);
            shuffle(cpu);
        }
        ep = [...ep.slice(0, 8), ...epu];
        cp = [...cp.slice(0, 8), ...cpu];
    };
    randomizeOrientation = function (arr, numOrientations) {
        var i, k, ori, ref;
        ori = 0;
        for (i = k = 0, ref = arr.length - 1; (0 <= ref ? k <= ref : k >= ref); i = 0 <= ref ? ++k : --k) {
            ori += (arr[i] = randint(0, numOrientations - 1));
        }
    };
    isOrientationValid = function (arr, numOrientations) {
        return arr.reduce(function (a, b) {
            return a + b;
        }) % numOrientations === 0;
    };
    generateValidRandomOrientation = function (co, eo) {
        // There is a 1/2 and 1/3 probably respectively of each of these
        // succeeding so the probability of them running 10 times before
        // success is already only 1% and only gets exponentially lower
        // and each generation is only in the 10s of operations which is nothing
        randomizeOrientation(co, 3);
        while (!isOrientationValid(co, 3)) {
            randomizeOrientation(co, 3);
        }
        randomizeOrientation(eo, 2);
        while (!isOrientationValid(eo, 2)) {
            randomizeOrientation(eo, 2);
        }
    };
    result = function () {
        console.log("definedEdges");
        console.log(this.de);
        generateValidRandomPermutation(this.cp, this.ep);
        generateValidRandomOrientation(this.co, this.eo);
        return this;
    };
    return result;
})();

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
        var frontCenter = RUBIK_COLORS_A.indexOf(this.frontFace[4]);
        // cube.center = [...cube.center.slice(frontCenter, 6), ...cube.center.slice(0, frontCenter)];
        // if (frontCenter % 2 === 1) { // swap once more if needed for a valid configuration
        //     let temp = cube.center[1];
        //     cube.center[1] = cube.center[4];
        //     cube.center[4] = temp;
        // }

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
                            cube.ep[i] = j;
                            cube.eo[i] = (EDGE_COLORS[j][0] === definedEdges[i]) ? 0 : 1;
                            usedEdges[j] = 1;
                            break;
                        }
                    } else if (i < 11) {
                        // place the reamaining 4
                        cube.ep[i] = j;
                        cube.eo[i] = 0;
                        usedEdges[j] = 1;
                        break;
                    } else { // last edge
                        cube.ep[i] = j;
                        cube.eo[i] = cube.eo.reduce((a, b) => a + b, 0) % 2; // parity must be assured
                        usedEdges[j] = 1;
                    }
                }
            }
        }
        cube.randomizeSideFaces();
        Cube.initSolver();
        console.log(cube);
        var movesToSolve1 = cube.solve();
        cube.move(movesToSolve1);
        console.log("Is solved? :", cube.isSolved())
    }
}