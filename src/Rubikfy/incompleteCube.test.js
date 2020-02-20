// const sum = require('./sum');
import {
    toCompleteCube, toCubeEdges, colorsOfEdgesOfFaces,
    toCubeCorners, colorsOfCornersOfFaces,
} from './incompleteCube'

// References:
// COLORS = ['U', 'R', 'F', 'D', 'L', 'B'];
// CORNER_COLORS = [['U', 'R', 'F'], ['U', 'F', 'L'], ['U', 'L', 'B'], ['U', 'B', 'R'], ['D', 'F', 'R'], ['D', 'L', 'F'], ['D', 'B', 'L'], ['D', 'R', 'B']];
const EDGE_COLORS = [['U', 'R'], ['U', 'F'], ['U', 'L'], ['U', 'B'], ['D', 'R'], ['D', 'F'], ['D', 'L'], ['D', 'B'], ['F', 'R'], ['F', 'L'], ['B', 'L'], ['B', 'R']];
// HACK!!!!!
// SWAPED THE CORNER_COLORS index 1 and 2 BECAUSE INDEXING WAS ON THE OPOSITE WAY OF CUBEJS 
const CORNER_COLORS = [['U', 'F', 'R'], ['U', 'L', 'F'], ['U', 'B', 'L'], ['U', 'R', 'B'], ['D', 'R', 'F'], ['D', 'F', 'L'], ['D', 'L', 'B'], ['D', 'B', 'R']];

// TEST CASES:

const TC1 = {
    frontFace: ["F", "F", "F", "L", "R", "F", "L", "L", "F"],
    backFace: ["R", "R", "R", "L", "L", "F", "L", "L", "F"],
}

test.only("Function toCubeEdges TC1", () => {
    let definedEdges = colorsOfEdgesOfFaces(TC1.frontFace, TC1.backFace);
    let [ep, eo] = toCubeEdges(definedEdges);
    let resultEdgesFaces = [];
    for (let i = 0; i < 8; i++) {
        resultEdgesFaces[i] = EDGE_COLORS[ep[i]][eo[i]];
    };
    expect(definedEdges).toStrictEqual(resultEdgesFaces);
});

test.only("Function toCubeCorners TC1", () => {
    let definedCorners = colorsOfCornersOfFaces(TC1.frontFace, TC1.backFace);
    let [cp, co] = toCubeCorners(definedCorners);
    let resultCornersFaces = [];
    for (let i = 0; i < 8; i++) {
        resultCornersFaces[i] = CORNER_COLORS[cp[i]][co[i]];
    };
    expect(definedCorners).toStrictEqual(resultCornersFaces);
});

test.only("Function toCompleteCube TC1", () => {
    let completedCube = toCompleteCube(TC1.frontFace, TC1.backFace);
    let frontFaceResult = completedCube.slice(0, 9);
    let backFaceresult = completedCube.slice(27, 36);
    expect([frontFaceResult, backFaceresult]).toStrictEqual([TC1.frontFace.join(""), TC1.backFace.join("")]);
});
