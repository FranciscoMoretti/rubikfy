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


// HACK!!!!!
// SWAPED THE CORNER_COLORS index 1 and 2 BECAUSE INDEXING WAS ON THE OPOSITE WAY OF CUBEJS 
const CORNER_COLORS = [['U', 'F', 'R'], ['U', 'L', 'F'], ['U', 'B', 'L'], ['U', 'R', 'B'], ['D', 'R', 'F'], ['D', 'F', 'L'], ['D', 'L', 'B'], ['D', 'B', 'R']];

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


Cube.prototype.randomizeSideFaces = (function () {
    var arePermutationsValid, generateValidRandomOrientation, generateValidRandomPermutation, getNumSwaps, isOrientationValid, randint, randomizeOrientation, result, shuffle;
    randint = function (min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    };
    // Fisher-Yates shuffle adapted from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    shuffle = (array) => {
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
        // var cpu = cp.slice(8, 12);
        shuffle(epu);
        // shuffle(cpu);
        while (!arePermutationsValid(cp, [...ep.slice(0, 8), ...epu])) {
            shuffle(epu);
            // shuffle(cpu);
        }
        return [...ep.slice(0, 8), ...epu];
        // cp = [...cp.slice(0, 8), ...cpu];
    };
    randomizeOrientation = (arr, numOrientations) => {
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
        // randomizeOrientation(co, 3);
        // while (!isOrientationValid(co, 3)) {
        //     randomizeOrientation(co, 3);
        // }
        // Get undefined subset
        var eou = eo.slice(8, 12);
        randomizeOrientation(eou, 2);
        while (!isOrientationValid([...eo.slice(0, 8), ...eou], 2)) {
            randomizeOrientation(eou, 2);
        }
        return [...eo.slice(0, 8), ...eou];
    };
    result = function () {
        console.log("definedEdges");
        this.ep = generateValidRandomPermutation(this.cp, this.ep);
        this.eo = generateValidRandomOrientation(this.co, this.eo);
        console.log("Whats this?");
        console.log(this);
        return this;
    };
    return result;
})();

const RUBIK_COLORS_EXTENDED = Object.assign({}, RUBIK_COLORS, { E: { r: 100, g: 100, b: 100 } }) // add the empty element

function rubikToRGB(rubik) { return RUBIK_COLORS_EXTENDED[rubik] };

export function colorsOfEdgesOfFaces(frontFace, backFace) {
    return [frontFace[5], frontFace[7], frontFace[3], frontFace[1],
    backFace[5], backFace[1], backFace[3], backFace[7]];
    }

export function colorsOfCornersOfFaces(frontFace, backFace) {
    return [frontFace[8], frontFace[6], frontFace[0], frontFace[2],
    backFace[2], backFace[0], backFace[6], backFace[8]];
};

export function toCubeEdges(definedEdges) {
        // Count the used colors on front and back face
        let colorRef = RUBIK_COLORS_A;
        let colorCount = Array(6).fill(0);
        for (let i = 0; i < definedEdges.length; i++) {
            colorCount[RUBIK_COLORS_A.indexOf(definedEdges[i])]++
        }

        //1) combine the arrays:
        let colorRepetitions = [];
        for (let j = 0; j < colorRef.length; j++)
            colorRepetitions.push({ 'color': colorRef[j], 'count': colorCount[j] });

        //2) sort:
        colorRepetitions.sort(function (a, b) {
            return ((a.count < b.count) ? 1 : ((a.count === b.count) ? 0 : -1));
        });

    // Initialize edge positions and edge orientations
    let ep = Array(12).fill(-1);
    let eo = Array(12).fill(0);

        var usedEdges = Array(12).fill(0);
        for (let i = 0; i < colorRepetitions.length; i++) {
            let edgeColorIndex = 0;
            let definedEdgeIndex = 0;
            while (colorRepetitions[i].count > 0) {
                // find the next avaiable cubelet
                while (usedEdges[edgeColorIndex] === 1 ||
                    !EDGE_COLORS[edgeColorIndex].includes(colorRepetitions[i].color)) {
                    edgeColorIndex++;
                }
                // find the next defined position
                while (definedEdges[definedEdgeIndex] !== colorRepetitions[i].color) {
                    definedEdgeIndex++;
                }
                // place on the cube edge array
            ep[definedEdgeIndex] = edgeColorIndex;
            eo[definedEdgeIndex] = (EDGE_COLORS[edgeColorIndex][0] === definedEdges[definedEdgeIndex]) ? 0 : 1;
                usedEdges[edgeColorIndex] = 1;
                colorRepetitions[i].count--;
                // start checking  at the next one
                edgeColorIndex++;
                definedEdgeIndex++;
            }
        }

        // place the rest of the edges
        let startingPos = 8
        for (let i = 0; i < 12; i++) {
            if (usedEdges[i] === 0) {
            ep[startingPos] = i;
                if (startingPos < 11) {
                eo[startingPos] = 0;
                } else {// for the last one, respect the orientation parity
                eo[11] = eo.reduce((a, b) => a + b, 0) % 2;
                }
                startingPos++;
                usedEdges[i] = 1;
            }
        }
    return [ep, eo]
    }

export function toCubeCorners(definedCorners) {
        // Count the used colors on front and back face
        let colorRef = RUBIK_COLORS_A;
        let colorCount = Array(6).fill(0);
        for (let i = 0; i < definedCorners.length; i++) {
            colorCount[RUBIK_COLORS_A.indexOf(definedCorners[i])]++
        }

        //1) combine the arrays:
        let colorRepetitions = [];
        for (let j = 0; j < colorRef.length; j++)
            colorRepetitions.push({ 'color': colorRef[j], 'count': colorCount[j] });

        //2) sort:
        colorRepetitions.sort(function (a, b) {
            return ((a.count < b.count) ? 1 : ((a.count === b.count) ? 0 : -1));
        });


        // ORDERED_CORNER_COLORS -> CONER_COLORS ordered by colorRepetition (priority)
        // 1st) order in repetition order of any element of corner
        // 2nd) if it has the next color in repetitions amount (decreasing), place that corner in the last part of the ones that comply with 1st.

        // TODO: add array with indexes that change with CORNER_COLORS to optimize search
        let resultInd = 0;
        let resultArr = [];
        let usedCorners = Array(8).fill(0);
        for (let i = 0; i < colorRepetitions.length; i++) {
            if (colorRepetitions[i].count === 0) {
                break;
            }
            let prevInd = resultInd;
            for (let j = 0; j < CORNER_COLORS.length; j++) {
                if (usedCorners[j] === 0 && CORNER_COLORS[j].includes(colorRepetitions[i].color)) {
                    resultArr[resultInd] = CORNER_COLORS[j]
                    usedCorners[j] = 1
                    resultInd++
                }
            }
            // Move the cubelets that also contains the next most repited color to the last position of this color sequence
            if (resultInd - prevInd > 1) {
                let ofThisColor = resultArr.slice(prevInd, resultInd);
                if (i + 1 < colorRepetitions.length) {
                    let nextColor = colorRepetitions[i + 1].color;
                    ofThisColor.sort(function (a, b) {
                        let a_of_color = a.includes(nextColor);
                        let b_of_color = b.includes(nextColor);
                        return ((a_of_color && !b_of_color) ? 1 : ((a_of_color === b_of_color) ? 0 : -1));
                    });
                    resultArr.splice(prevInd, resultInd - prevInd, ...ofThisColor);
                }
            }
        }

        var ordereedColorArr = resultArr;
    let cp = Array(8).fill(-1);
    let co = Array(8).fill(0);
        usedCorners = Array(8).fill(0);

        for (let i = 0; i < colorRepetitions.length; i++) {
            let cornerColorIndex = 0;
            let definedCornerIndex = 0;
            // In decreasing order of repetitions
            while (colorRepetitions[i].count > 0) {

                // Find the first available corner that has the desired color
                while (usedCorners[cornerColorIndex] === 1 ||
                    !ordereedColorArr[cornerColorIndex].includes(colorRepetitions[i].color)) {
                    cornerColorIndex++;
                }
                // Find the desired position for the color to be placed 
                while (definedCorners[definedCornerIndex] !== colorRepetitions[i].color) {
                    definedCornerIndex++;
                }

                // place on the cube corner array with the reference index
            cp[definedCornerIndex] = CORNER_COLORS.indexOf(ordereedColorArr[cornerColorIndex]);
            co[definedCornerIndex] =
                    (ordereedColorArr[cornerColorIndex][0] === definedCorners[definedCornerIndex]) ? 0 :
                        (ordereedColorArr[cornerColorIndex][1] === definedCorners[definedCornerIndex]) ? 1 : 2;
                usedCorners[cornerColorIndex] = 1;
                colorRepetitions[i].count--;

                cornerColorIndex++;
                definedCornerIndex++;
            }
        }
    return [cp, co];
    }

export function toCompleteCube(frontFace, backFace) {
    var cube = new Cube();

    // PLACE CENTERS
    var frontCenter = RUBIK_COLORS_A.indexOf(frontFace[4]);
    cube.center = [...cube.center.slice(frontCenter, 6), ...cube.center.slice(0, frontCenter)];
    if (frontCenter % 2 === 1) { // swap once more if needed for a valid configuration
        let temp = cube.center[1];
        cube.center[1] = cube.center[4];
        cube.center[4] = temp;
    }

    // PLACE EDGES
    let definedEdges = colorsOfEdgesOfFaces(frontFace, backFace);

    [cube.ep, cube.eo] = toCubeEdges(definedEdges);

    // PLACE CORNERS
    let definedCorners = colorsOfCornersOfFaces(frontFace, backFace);

    [cube.cp, cube.co] = toCubeCorners(definedCorners);

    // get the right corner orientation parity
    let intermediateChange = [];
    let parityFound = false;
    {
        let rest = cube.co.reduce(function (a, b) {
            return a + b;
        }) % 3;
        parityFound = rest === 0 ? true : false;
        if (rest !== 0) {
            // combine corners until one switch gives the necessary difference
            for (let i = 0; i < 8; i++) {
                let pos1 = cube.cp[i];
                let ori1 = cube.co[i];
                let cubelet1 = CORNER_COLORS[pos1]; // definedCorners[i]
                let color1 = cubelet1[ori1];
                for (let j = i + 1; j < 8; j++) {
                    // if cubelets colors are swap-able
                    let pos2 = cube.cp[j];
                    let ori2 = cube.co[j];
                    let cubelet2 = CORNER_COLORS[pos2];
                    let color2 = cubelet2[ori2];
                    if (cubelet2.includes(color1) &&
                        cubelet1.includes(color2)) {
                        // check if the difference makes the parity right
                        let prevParity = ori1 + ori2;
                        let newParity = cubelet1.indexOf(color2) + cubelet2.indexOf(color1);
                        let difference = newParity - prevParity;
                        if (difference !== 0) {
                            intermediateChange = [i, j];
                        }
                        if ((rest + difference) % 3 === 0) {
                            //right parity found. Make the switch!
                            cube.cp[i] = pos2;
                            cube.cp[j] = pos1;
                            cube.co[i] = cubelet2.indexOf(color1);
                            cube.co[j] = cubelet1.indexOf(color2);
                            parityFound = true;
                            break;
                        }
                    }
                }
                if (parityFound === true) {
                    break;
                }
            }
        }
    }
    if (!parityFound && intermediateChange.length > 0) {
        // do the intermediate swap
        {
            let i = intermediateChange[0];
            let j = intermediateChange[1];
            let pos1 = cube.cp[i];
            let pos2 = cube.cp[j];
            let ori1 = cube.co[i];
            let ori2 = cube.co[j];
            let cubelet1 = CORNER_COLORS[pos1]; // definedCorners[i]
            let cubelet2 = CORNER_COLORS[pos2];
            let color1 = cubelet1[ori1];
            let color2 = cubelet2[ori2];
            cube.cp[i] = pos2;
            cube.cp[j] = pos1;
            cube.co[i] = cubelet2.indexOf(color1);
            cube.co[j] = cubelet1.indexOf(color2);
        }

        let rest = cube.co.reduce(function (a, b) {
            return a + b;
        }) % 3;
        if (rest !== 0) {
            // combine corners until one switch gives the necessary difference
            for (let i = 0; i < 8; i++) {
                let pos1 = cube.cp[i];
                let ori1 = cube.co[i];
                let cubelet1 = CORNER_COLORS[pos1]; // definedCorners[i]
                let color1 = cubelet1[ori1];
                for (let j = i + 1; j < 8; j++) {
                    // if cubelets colors are swap-able
                    let pos2 = cube.cp[j];
                    let ori2 = cube.co[j];
                    let cubelet2 = CORNER_COLORS[pos2];
                    let color2 = cubelet2[ori2];
                    if (cubelet2.includes(color1) &&
                        cubelet1.includes(color2)) {
                        // check if the difference makes the parity right
                        let prevParity = ori1 + ori2;
                        let newParity = cubelet1.indexOf(color2) + cubelet2.indexOf(color1);
                        let difference = newParity - prevParity;
                        if ((rest + difference) % 3 === 0) {
                            //right parity found. Make the switch!
                            cube.cp[i] = pos2;
                            cube.cp[j] = pos1;
                            cube.co[i] = cubelet2.indexOf(color1);
                            cube.co[j] = cubelet1.indexOf(color2);
                            parityFound = true;
                            break;
                        }
                    }
                }
                if (parityFound === true) {
                    break;
                }
            }
        }
    }
    var unresolvedString = cube.asString();
    return unresolvedString;

    // console.log(unresolvedString);
    // console.log(cube.ep);
    // Cube.initSolver();
    // // randomize middle layer edges position for general permutation parity and orientation for edges orientation parity
    // cube.randomizeSideFaces();
    // console.log(cube.B)
    // var movesToSolve1 = cube.solve();
    // cube.move(movesToSolve1);
    // console.log("Is solved? :", cube.isSolved())
    // console.log("Inverse solution")
    // console.log(Cube.inverse(movesToSolve1));
}

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



    tryFirstCompleteCube() {
        console.log("function tryFirstCompleteCube arguments")
        console.log(this.frontFace)
        console.log(this.backFace)

        toCompleteCube(this.frontFace, this.backFace);
    }
}