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

    quantizeCubeFrontBack(frontRGB, backRGB, rubik_colors_rgb) {
        var rubik_colors = this.centerColor.map(function (val) { return rubik_colors_rgb[val]; });

        var centers = [frontRGB[4], backRGB[4]];
        var quantizedCenters = this.quantizeCenters(centers, rubik_colors);

        var front_rubik = [];
        var back_rubik = [];
        front_rubik[4] = quantizedCenters[0];
        back_rubik[4] = quantizedCenters[1];

        return [front_rubik, back_rubik];
    }


}