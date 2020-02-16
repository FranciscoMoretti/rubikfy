
const CENTER_COLORS = ['U', 'R', 'F', 'D', 'L', 'B'];
const CORNER_COLORS = [['U', 'R', 'F'], ['U', 'F', 'L'], ['U', 'L', 'B'], ['U', 'B', 'R'], ['D', 'F', 'R'], ['D', 'L', 'F'], ['D', 'B', 'L'], ['D', 'R', 'B']];

export function toColorCountDictionary(colorCount) {
    let colorRepetitions = [];
    for (let j = 0; j < CENTER_COLORS.length; j++)
        colorRepetitions.push({ 'color': CENTER_COLORS[j], 'count': colorCount[j] });
    return colorRepetitions;
}

export function toOrderedColorCountDictionary(colorCount) {
    let colorRepetitions = toColorCountDictionary(colorCount);
    colorRepetitions.sort(function (a, b) {
        return ((a.count < b.count) ? 1 : ((a.count === b.count) ? 0 : -1));
    });
    return colorRepetitions;
}

export function sortCornerCubeletsByColorCountOrder(orderedColorCountDictionary) {
    let resultInd = 0;
    let resultArr = [];
    let usedCorners = Array(8).fill(0);
    for (let i = 0; i < orderedColorCountDictionary.length; i++) {
        if (orderedColorCountDictionary[i].count === 0) {
            break;
        }
        let prevInd = resultInd;
        for (let j = 0; j < CORNER_COLORS.length; j++) {
            if (usedCorners[j] === 0 && CORNER_COLORS[j].includes(orderedColorCountDictionary[i].color)) {
                resultArr[resultInd] = CORNER_COLORS[j]
                usedCorners[j] = 1
                resultInd++
            }
        }
        // Move the cubelets that also contains the next most repited color to the last position of this color sequence
        if (resultInd - prevInd > 1) {
            let ofThisColor = resultArr.slice(prevInd, resultInd);
            if (i + 1 < orderedColorCountDictionary.length) {
                let nextColor = orderedColorCountDictionary[i + 1].color;
                ofThisColor.sort(function (a, b) {
                    let a_of_color = a.includes(nextColor);
                    let b_of_color = b.includes(nextColor);
                    return ((a_of_color && !b_of_color) ? 1 : ((a_of_color === b_of_color) ? 0 : -1));
                });
                resultArr.splice(prevInd, resultInd - prevInd, ...ofThisColor);
            }
        }
    }
    return resultArr;
}

export function removeInfinityCountingParity(orderedCornerCubelet, colorRepetitions, colorCosts) {
    let availableCorners = Array(orderedCornerCubelet.length).fill(true);
    let parityCount = 0;
    for (let i = 0; i < colorRepetitions.length; i++) {
        let colorIndex = CENTER_COLORS.indexOf(colorRepetitions[i].color);
        let orderedColorIndex = 0;
        let numFound = 0;
        if (colorCosts[colorIndex] === Infinity) {
            for (let j = 0; j < 8; j++) {
                if (availableCorners[j] === true && orderedCornerCubelet[j].includes(colorRepetitions[i].color)) {
                    parityCount += orderedCornerCubelet[j].indexOf(colorRepetitions[i].color);
                    availableCorners[j] = false;
                    numFound++;
                }
                if (numFound === colorRepetitions[i].count) {
                    break;
                }
            }
        } else {
            let remainingCorners = []
            let remainingIndex = 0;
            for (let j = 0; j < orderedCornerCubelet.length; j++) {
                if (availableCorners[j]) {
                    remainingCorners[remainingIndex++] = orderedCornerCubelet[j];
                }
            }
            return { remainingCornerCubelets: remainingCorners, parityCountOfRemoved: parityCount }
        }
    }
    throw "couldn't find all repetitions of Inifinty costs "
}

export function toColorCostDictionary(colorCosts) {
    let colorCostsDict = [];
    for (let j = 0; j < CENTER_COLORS.length; j++)
        colorCostsDict.push({ 'color': CENTER_COLORS[j], 'cost': colorCosts[j] });
    return colorCostsDict;
}

export function toOrderedColorCostDictionary(colorCost) {
    let colorCostsDict = toColorCostDictionary(colorCost)
    colorCostsDict.sort(function (a, b) {
        return ((a.cost < b.cost) ? -1 : ((a.cost === b.cost) ? 0 : 1));
    });
    return colorCostsDict;
}
export default class CubeQuantization {
    // 26 Cubelets (6 centers + 8 corners + 12 edges)
    centerColor = ['U', 'R', 'F', 'D', 'L', 'B'];
    adjacencyMatrix = [ // adjacent indexes defined by the order of the faces
        [1, 2, 4, 5], // U
        [0, 2, 3, 5], // R
        [0, 1, 3, 4], // F
        [1, 2, 4, 5], // D
        [0, 2, 3, 5], // L
        [0, 1, 3, 4], // B
    ];

    // Centers relative position is fixed
    getOpositeCenter(center) {
        var ind = this.centerColor.indexOf(center);
        if (ind === -1) {
            return ""
        } else {
            return this.centerColor[(ind + 3) % 6];
        }
    }

    getOpositeCenterPairs() {
        var pairs = []
        for (let i = 0; i < 3; i++) {
            pairs.push([this.centerColor[i], this.centerColor[i + 3]]);
        }
        return pairs;
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

    quantizeCenters(centers, rubik_colors) {
        var distMat = this.distanceMatrix(centers, rubik_colors, this.distance);

        var distSumArr = [];
        for (let i = 0; i < 6; i++) {
            //Sum the cost of the center and it's oposite
            distSumArr[i] = distMat[0][i] + distMat[1][(i + 3) % 6];
        }
        var indOfBest = this.indexOfMin(distSumArr);

        return [this.centerColor[indOfBest], this.centerColor[(indOfBest + 3) % 6]];
    }

    setColToInfinity(matrix, col) {
        for (let j = 0; j < matrix.length; j++) {
            matrix[j][col] = Infinity;
        }
        return matrix;
    }

    quantizeCorners(corners, rubik_colors) {
        const math = require('mathjs')

        var distMat = this.distanceMatrix(corners, rubik_colors, this.distance);

        var quantizedColors = [];
        var unquantizedIndexes = [0, 1, 2, 3, 4, 5, 6, 7];
        var colorCount = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 8; i++) {
            var edgeRowIndex = this.indexOfMin(math.min(distMat, 1));
            var edgeCosts = distMat[edgeRowIndex];
            var colorColIndex = this.indexOfMin(edgeCosts);
            colorCount[colorColIndex]++;
            // Filter out colors of cubelets already used completely

            if (math.max(colorCount) < 3 || i === 7) { // There are enough cubelets or it's the last pick
                // do nothing?
            } else if (colorCount.includes(4)) {
                // remove from available
                let fourIndex = colorCount.indexOf(4);
                distMat = this.setColToInfinity(distMat, fourIndex);
                let adjacentsTo1 = this.adjacencyMatrix[fourIndex];
                for (let j = 0; j < 4; j++) {// Check adjacents sides
                    if (colorCount[adjacentsTo1[j]] === 2) {
                        // remove from available
                        distMat = this.setColToInfinity(distMat, adjacentsTo1[j]);
                        let adjacentsTo2 = this.adjacencyMatrix[adjacentsTo1[j]];
                        for (let k = 0; k < 4; k++) {// Check adjacents to both
                            if (adjacentsTo2[k] !== fourIndex && adjacentsTo1.includes(adjacentsTo2[k])) { // its adjacent to both
                                if (colorCount[adjacentsTo2[k]] === 1) {
                                    // remove from available
                                    distMat = this.setColToInfinity(distMat, adjacentsTo2[k]);
                                }

                            }
                        }
                    }
                }
            } else if (colorCount.includes(3)) {
                let threeIndex = colorCount.indexOf(3);
                let adjacentsTo1 = this.adjacencyMatrix[threeIndex];
                for (let j = 0; j < 4; j++) {// Check adjacents sides
                    if (colorCount[adjacentsTo1[j]] === 3) {
                        // remove from available if we have two adjacent sides with 3 each
                        distMat = this.setColToInfinity(distMat, threeIndex);
                        distMat = this.setColToInfinity(distMat, adjacentsTo1[j]);
                        let adjacentsTo2 = this.adjacencyMatrix[adjacentsTo1[j]];
                        for (let k = 0; k < 4; k++) {// Check adjacents to both
                            if (adjacentsTo2[k] !== threeIndex && adjacentsTo1.includes(adjacentsTo2[k])) { // its adjacent to both
                                if (colorCount[adjacentsTo2[k]] === 1) {
                                    // remove from available
                                    distMat = this.setColToInfinity(distMat, adjacentsTo2[k]);
                                }

                            }
                        }
                    } else if (colorCount[adjacentsTo1[j]] === 2) {
                        let adjacentsTo2 = this.adjacencyMatrix[adjacentsTo1[j]];
                        for (let k = 0; k < 4; k++) {// Check adjacents to both
                            if (adjacentsTo2[k] !== threeIndex && adjacentsTo1.includes(adjacentsTo2[k])) { // its adjacent to both
                                if (colorCount[adjacentsTo2[k]] === 2) {
                                    // remove from available
                                    distMat = this.setColToInfinity(distMat, threeIndex);
                                    distMat = this.setColToInfinity(distMat, adjacentsTo1[j]);
                                    distMat = this.setColToInfinity(distMat, adjacentsTo2[k]);
                                }

                            }
                        }
                    }
                }
            }
            quantizedColors[unquantizedIndexes[edgeRowIndex]] = this.centerColor[colorColIndex];
            distMat.splice(edgeRowIndex, 1);
            unquantizedIndexes.splice(edgeRowIndex, 1);
        }
        return quantizedColors;
    }

    quantizeEdges(edges, rubik_colors) {
        const math = require('mathjs')

        var distMat = this.distanceMatrix(edges, rubik_colors, this.distance);

        var quantizedColors = [];
        var unquantizedIndexes = [0, 1, 2, 3, 4, 5, 6, 7];
        var colorCount = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 8; i++) {
            var edgeRowIndex = this.indexOfMin(math.min(distMat, 1));
            var edgeCosts = distMat[edgeRowIndex];
            var colorColIndex = this.indexOfMin(edgeCosts);
            colorCount[colorColIndex]++;
            // Filter out colors of cubelets already used completely
            if (colorCount[colorColIndex] >= 3) {
                if ((colorCount[colorColIndex] === 4) || // If we used the 4 cubelets, then don't use anymore
                    (colorCount[colorColIndex] === 3 && //If it's only 3, check if other already used four
                        colorCount[(colorColIndex + 3) % 6] !== 4 && // if it's the oposite, then it's ok
                        colorCount.includes(4))) // if it's not the oposite, then dont'use it anymore
                {
                    for (let j = 0; j < distMat.length; j++) {
                        distMat[j][colorColIndex] = Infinity;
                    }
                }
            }
            quantizedColors[unquantizedIndexes[edgeRowIndex]] = this.centerColor[colorColIndex];
            distMat.splice(edgeRowIndex, 1);
            unquantizedIndexes.splice(edgeRowIndex, 1);
        }
        return quantizedColors;
    }

    quantizeCubeFrontBack(frontRGB, backRGB, rubik_colors_rgb) {
        var rubik_colors = this.centerColor.map(function (val) { return rubik_colors_rgb[val]; });

        var centers = [frontRGB[4], backRGB[4]];
        var quantizedCenters = this.quantizeCenters(centers, rubik_colors);

        var edges = [frontRGB[1], frontRGB[3], frontRGB[5], frontRGB[7], backRGB[1], backRGB[3], backRGB[5], backRGB[7]];
        var quantizedEdges = this.quantizeEdges(edges, rubik_colors);

        var corners = [frontRGB[0], frontRGB[2], frontRGB[6], frontRGB[8], backRGB[0], backRGB[2], backRGB[6], backRGB[8]];
        var quantizedCorners = this.quantizeCorners(corners, rubik_colors);

        var front_rubik = [];
        var back_rubik = [];
        front_rubik[4] = quantizedCenters[0];
        back_rubik[4] = quantizedCenters[1];

        front_rubik[1] = quantizedEdges[0];
        front_rubik[3] = quantizedEdges[1];
        front_rubik[5] = quantizedEdges[2];
        front_rubik[7] = quantizedEdges[3];

        back_rubik[1] = quantizedEdges[4];
        back_rubik[3] = quantizedEdges[5];
        back_rubik[5] = quantizedEdges[6];
        back_rubik[7] = quantizedEdges[7];

        front_rubik[0] = quantizedCorners[0];
        front_rubik[2] = quantizedCorners[1];
        front_rubik[6] = quantizedCorners[2];
        front_rubik[8] = quantizedCorners[3];

        back_rubik[0] = quantizedCorners[4];
        back_rubik[2] = quantizedCorners[5];
        back_rubik[6] = quantizedCorners[6];
        back_rubik[8] = quantizedCorners[7];


        return [front_rubik, back_rubik];
    }


}