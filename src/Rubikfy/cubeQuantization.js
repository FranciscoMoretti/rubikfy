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

}