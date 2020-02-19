// const sum = require('./sum');
import { toCompleteCube } from './incompleteCube'

// References:
// COLORS = ['U', 'R', 'F', 'D', 'L', 'B'];
// CORNER_COLORS = [['U', 'R', 'F'], ['U', 'F', 'L'], ['U', 'L', 'B'], ['U', 'B', 'R'], ['D', 'F', 'R'], ['D', 'L', 'F'], ['D', 'B', 'L'], ['D', 'R', 'B']];

// TEST CASES:

const TC1 = {
    frontFace: ["F", "F", "F", "L", "R", "F", "L", "L", "F"],
    backFace: ["R", "R", "R", "L", "L", "F", "L", "L", "F"],
}

test.only("Function toCompleteCube TC1", () => {
    let completedCube = toCompleteCube(TC1.frontFace, TC1.backFace);
    let frontFaceResult = completedCube.slice(0, 9);
    let backFaceresult = completedCube.slice(27, 36);
    expect([frontFaceResult, backFaceresult]).toStrictEqual([TC1.frontFace.join(""), TC1.backFace.join("")]);
});
