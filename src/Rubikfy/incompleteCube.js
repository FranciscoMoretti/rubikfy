const RUBIK_COLORS = {
    U: { r: 255, g: 255, b: 255 },
    F: { r: 137, g: 18, b: 20 },
    R: { r: 13, g: 72, b: 172 },
    B: { r: 255, g: 85, b: 37 },
    L: { r: 25, g: 155, b: 76 },
    D: { r: 254, g: 213, b: 47 },
};


export default class IncompleteCube {

    constructor() {
        this.frontFace = new Array(9).fill("E");
        this.backFace = new Array(9).fill("E");

        this.nearestColor = require('nearest-color').from(RUBIK_COLORS);
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
        }
    }

    setNodeRGBColor(face, nodeNumber, rgbColor) {
        var rubikColor = this.quantizeFilter(rgbColor);
        this.setNodeRubikColor(face, nodeNumber, rubikColor);
    }

    getFrontFaceMatrix() {
        return [this.frontFace.slice(0, 3), this.frontFace.slice(3, 6), this.frontFace.slice(6, 9)]
    }
}