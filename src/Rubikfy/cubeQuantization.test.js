// const sum = require('./sum');
import CubeQuantization,
{
    toOrderedColorCountDictionary, bestColorWithOrientationChecked, sortCornerCubeletsByColorCountOrder,
    removeInfinityCountingParity, toOrderedColorCostDictionary, parityCountOfCorners
}
    from './cubeQuantization'

// References:
// COLORS = ['U', 'R', 'F', 'D', 'L', 'B'];
// CORNER_COLORS = [['U', 'R', 'F'], ['U', 'F', 'L'], ['U', 'L', 'B'], ['U', 'B', 'R'], ['D', 'F', 'R'], ['D', 'L', 'F'], ['D', 'B', 'L'], ['D', 'R', 'B']];

// TEST CASES:

const TC1 = {
    lastCornerColorCosts: [195075, 34937, Infinity, 112094, Infinity, 73619],
    colorCount: [0, 1, 3, 0, 3, 0],
    orderedColorCountDictionary: [
        { "color": "F", "count": 3 },
        { "color": "L", "count": 3 },
        { "color": "R", "count": 1 },
        { "color": "U", "count": 0 },
        { "color": "D", "count": 0 },
        { "color": "B", "count": 0 }],
    orderedCornerCubelets: [
        ["U", "R", "F",],
        ["D", "F", "R",],
        ["U", "F", "L",],
        ["D", "L", "F",],
        ["U", "L", "B",],
        ["D", "B", "L",],
        ["D", "R", "B",],
        ["U", "B", "R",],],
    infinityCostsRemoved: {
        parityCountOfRemoved: 8, // or 10 -> should be able to handle multiple
        remainingCornerCubelets: [["D", "R", "B"], ["U", "B", "R"]],
        remainingColorRepetitions: [
            { "color": "R", "count": 1, },
            { "color": "U", "count": 0, },
            { "color": "D", "count": 0, },
            { "color": "B", "count": 0, },],
    },
    resultColorIdx: 5,
    orderedCornerColorCosts: [
        { "color": "R", "cost": 34937 },
        { "color": "B", "cost": 73619 },
        { "color": "D", "cost": 112094 },
        { "color": "U", "cost": 195075 },
        { "color": "F", "cost": Infinity },
        { "color": "L", "cost": Infinity }],
}

const PCC_TC1 = {
    orderedColorCount: [
        { "color": "R", "count": 1, },
        { "color": "U", "count": 0, },
        { "color": "D", "count": 0, },
        { "color": "B", "count": 0, },],
    cubelets: [["U", "B", "R"]],
    resultParity: 2,
}

const PCC_TC2 = {
    orderedColorCount: [
        { "color": "R", "count": 1, },
        { "color": "U", "count": 0, },
        { "color": "D", "count": 0, },
        { "color": "B", "count": 0, },],
    cubelets: [["D", "R", "B"]],
    resultParity: 1,
}

test("Function toOrderedColorCountDictionary TC1", () => {
    expect(toOrderedColorCountDictionary(TC1.colorCount)).toStrictEqual(TC1.orderedColorCountDictionary);
});

test("Function sortCornerCubeletsByColorCountOrder TC1", () => {
    expect(sortCornerCubeletsByColorCountOrder(TC1.orderedColorCountDictionary)).toStrictEqual(TC1.orderedCornerCubelets);
});

test("removeInfinityCountingParity TC1", () => {
    expect(removeInfinityCountingParity(TC1.orderedCornerCubelets, TC1.orderedColorCountDictionary, TC1.lastCornerColorCosts)
    ).toStrictEqual(TC1.infinityCostsRemoved);
})

test("toOrderedColorCostDictionary TC1", () => {
    expect(toOrderedColorCostDictionary(TC1.lastCornerColorCosts)
    ).toStrictEqual(TC1.orderedCornerColorCosts);
})

test("parityCountOfCorners TC1", () => {
    expect(parityCountOfCorners(
        PCC_TC1.cubelets,
        PCC_TC1.orderedColorCount)
    ).toBe(PCC_TC1.resultParity);
})

test("parityCountOfCorners TC2", () => {
    expect(parityCountOfCorners(
        PCC_TC2.cubelets,
        PCC_TC2.orderedColorCount)
    ).toBe(PCC_TC2.resultParity);
})

test("Define Last Corner TC1", () => {
    var lastCornerColorCosts = TC1.lastCornerColorCosts;
    var colorCount = TC1.colorCount;
    var lastCornerColorIndex = bestColorWithOrientationChecked(lastCornerColorCosts, colorCount);
    expect(lastCornerColorIndex).toBe(TC1.resultColorIdx);
});
