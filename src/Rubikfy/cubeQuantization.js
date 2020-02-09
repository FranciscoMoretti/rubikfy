import { min } from 'mathjs';

export default class CubeQuantization {
    // 26 Cubelets (6 centers + 8 corners + 12 edges)
    centerColor = ['U', 'R', 'F', 'D', 'L', 'B'];

    cornerColor = [['U', 'R', 'F'], ['U', 'F', 'L'], ['U', 'L', 'B'], ['U', 'B', 'R'], ['D', 'F', 'R'], ['D', 'L', 'F'], ['D', 'B', 'L'], ['D', 'R', 'B']];

    edgeColor = [['U', 'R'], ['U', 'F'], ['U', 'L'], ['U', 'B'], ['D', 'R'], ['D', 'F'], ['D', 'L'], ['D', 'B'], ['F', 'R'], ['F', 'L'], ['B', 'L'], ['B', 'R']];

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


        return [front_rubik, back_rubik];
    }


}