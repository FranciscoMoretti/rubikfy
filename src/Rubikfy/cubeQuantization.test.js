// const sum = require('./sum');
import CubeQuantization,
{
    toOrderedColorCountDictionary, lastCornerColorWithOrientationChecked, sortCornerCubeletsByColorCountOrder,
    removeInfinityCountingParity, toOrderedColorCostDictionary, parityCountOfCorners, toOrderedColorSumArray
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
    orderedCornerColorCosts: [
        { "color": "R", "cost": 34937 },
        { "color": "B", "cost": 73619 },
        { "color": "D", "cost": 112094 },
        { "color": "U", "cost": 195075 },
        { "color": "F", "cost": Infinity },
        { "color": "L", "cost": Infinity }],
    resultColorIdx: 5,
}

const TC2 = {
    lastCornerColorCosts: [Infinity, Infinity, Infinity, 112094, 30426, 73619],
    colorCount: [2, 1, 4, 0, 0, 0],
    orderedColorCountDictionary: [
        { "color": "F", "count": 4 },
        { "color": "U", "count": 2 },
        { "color": "R", "count": 1 },
        { "color": "D", "count": 0 },
        { "color": "L", "count": 0 },
        { "color": "B", "count": 0 }],
    orderedCornerCubelets: [
        ["D", "F", "R"],
        ["D", "L", "F"],
        ["U", "R", "F"],
        ["U", "F", "L"],
        ["U", "L", "B"],
        ["U", "B", "R"],
        ["D", "R", "B"],
        ["D", "B", "L"]],
    infinityCostsRemoved: {
        parityCountOfRemoved: 7, // or 10 -> should be able to handle multiple
        remainingCornerCubelets: [["D", "B", "L"]],
        remainingColorRepetitions: [
            { "color": "D", "count": 0, },
            { "color": "L", "count": 0, },
            { "color": "B", "count": 0, },],
    },
    orderedCornerColorCosts: [
        { "color": "L", "cost": 30426 },
        { "color": "B", "cost": 73619 },
        { "color": "D", "cost": 112094 },
        { "color": "U", "cost": Infinity },
        { "color": "R", "cost": Infinity },
        { "color": "F", "cost": Infinity }],
    resultColorIdx: 4,
}

const TC3 = {
    lastCornerColorCosts: [195075, 34937, 19493, 112094, 30426, Infinity],
    colorCount: [0, 0, 2, 0, 1, 4],
    orderedColorCountDictionary: [
        { "color": "B", "count": 4 },
        { "color": "F", "count": 2 },
        { "color": "L", "count": 1 },
        { "color": "U", "count": 0 },
        { "color": "R", "count": 0 },
        { "color": "D", "count": 0 }],
    orderedCornerCubelets: [
        ["U", "L", "B"],
        ["U", "B", "R"],
        ["D", "R", "B"],
        ["D", "B", "L"],
        ["D", "F", "R"],
        ["U", "R", "F"],
        ["D", "L", "F"],
        ["U", "F", "L"]],
    infinityCostsRemoved: {
        parityCountOfRemoved: 6, // or 10 -> should be able to handle multiple
        remainingCornerCubelets: [
            ["D", "F", "R"],
            ["U", "R", "F"],
            ["D", "L", "F"],
            ["U", "F", "L"]],
        remainingColorRepetitions: [
            { "color": "F", "count": 2 },
            { "color": "L", "count": 1 },
            { "color": "U", "count": 0 },
            { "color": "R", "count": 0 },
            { "color": "D", "count": 0 }]
    },
    orderedCornerColorCosts: [
        { "color": "F", "cost": 19493 },
        { "color": "L", "cost": 30426 },
        { "color": "R", "cost": 34937 },
        { "color": "D", "cost": 112094 },
        { "color": "U", "cost": 195075 },
        { "color": "B", "cost": Infinity }],
    resultColorIdx: 4,
}

const TC4 = {
    lastCornerColorCosts: [195075, 34937, 19493, 112094, 30426, 73619],
    colorCount: [2, 0, 2, 0, 1, 2],
    orderedColorCountDictionary: [
        { "color": "U", "count": 2 },
        { "color": "F", "count": 2 },
        { "color": "B", "count": 2 },
        { "color": "L", "count": 1 },
        { "color": "R", "count": 0 },
        { "color": "D", "count": 0 }],
    orderedCornerCubelets: [
        { "corner": ["U", "F", "L"], "count": 5 },
        { "corner": ["U", "L", "B"], "count": 5 },
        { "corner": ["U", "R", "F"], "count": 4 },
        { "corner": ["U", "B", "R"], "count": 4 },
        { "corner": ["D", "L", "F"], "count": 3 },
        { "corner": ["D", "B", "L"], "count": 3 },
        { "corner": ["D", "F", "R"], "count": 2 },
        { "corner": ["D", "R", "B"], "count": 2 }],
    infinityCostsRemoved: {
        parityCountOfRemoved: 0, // or 10 -> should be able to handle multiple
        remainingCornerCubelets: [
            { "corner": ["U", "F", "L"], "count": 5 },
            { "corner": ["U", "L", "B"], "count": 5 },
            { "corner": ["U", "R", "F"], "count": 4 },
            { "corner": ["U", "B", "R"], "count": 4 },
            { "corner": ["D", "L", "F"], "count": 3 },
            { "corner": ["D", "B", "L"], "count": 3 },
            { "corner": ["D", "F", "R"], "count": 2 },
            { "corner": ["D", "R", "B"], "count": 2 }],
        remainingColorRepetitions: [
            { "color": "U", "count": 2 },
            { "color": "F", "count": 2 },
            { "color": "B", "count": 2 },
            { "color": "L", "count": 1 },
            { "color": "R", "count": 0 },
            { "color": "D", "count": 0 }],
    },
    orderedCornerColorCosts: [
        { color: "F", cost: 19493 },
        { color: "L", cost: 30426 },
        { color: "R", cost: 34937 },
        { color: "B", cost: 73619 },
        { color: "D", cost: 112094 },
        { color: "U", cost: 195075 },],
    resultColorIdx: 2,
}

const TC5 = {
    lastCornerColorCosts: [195075, 34937, 19493, 112094, 30426, 73619],
    colorCount: [1, 1, 3, 1, 0, 1],
    resultColorIdx: 4,
}

// problematic test-case
const TC6 = {
    lastCornerColorCosts: [25459, 39509, 38713, 16366, 31242, 21867],
    colorCount: [2, 0, 1, 3, 0, 1],
    resultColorIdx: 4,
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

const PCC_TC3 = {
    orderedColorCount: [
        { "color": "D", "count": 0, },
        { "color": "L", "count": 0, },
        { "color": "B", "count": 0, },],
    cubelets: [],
    resultParity: 0,
}

const PCC_TC4 = {
    orderedColorCount: [
        { "color": "F", "count": 2 },
        { "color": "L", "count": 1 },
        { "color": "U", "count": 0 },
        { "color": "R", "count": 0 },
        { "color": "D", "count": 0 }],
    cubelets: [
        ["U", "R", "F"],
        ["D", "L", "F"],
        ["U", "F", "L"]],
    resultParity: 6,
}

const PCC_TC5 = {
    orderedColorCount: [
        { "color": "U", "count": 2 },
        { "color": "F", "count": 2 },
        { "color": "B", "count": 2 },
        { "color": "L", "count": 1 },
        { "color": "R", "count": 0 },
        { "color": "D", "count": 0 }],
    // CORNER_COLORS = [['U', 'R', 'F'], ['U', 'F', 'L'], ['U', 'L', 'B'], ['U', 'B', 'R'], ['D', 'F', 'R'], ['D', 'L', 'F'], ['D', 'B', 'L'], ['D', 'R', 'B']];

    cornerColorCounts: [4, 5, 5, 4, 2, 3, -1, 2],
    // cubelets: [
    //     { "corner": ["U", "F", "L"], "count": 5 },
    //     { "corner": ["U", "L", "B"], "count": 5 },
    //     { "corner": ["U", "R", "F"], "count": 4 },
    //     { "corner": ["U", "B", "R"], "count": 4 },
    //     { "corner": ["D", "L", "F"], "count": 3 },
    //     { "corner": ["D", "B", "L"], "count": 3 },
    //     { "corner": ["D", "F", "R"], "count": 2 },
    //     { "corner": ["D", "R", "B"], "count": 2 }],
    resultParity: 7,
}

const PCC_TC6 = {
    orderedColorCount: [
        { color: 'F', count: 3 },
        { color: 'U', count: 1 },
        { color: 'R', count: 1 },
        { color: 'D', count: 1 },
        { color: 'B', count: 1 },
        { color: 'L', count: 0 }],
    cornerColorCounts: [5, 4, -1, 3, 5, 4, 2, 3],
    resultParity: 7,
}

test("Function toOrderedColorCountDictionary TC1", () => {
    expect(toOrderedColorCountDictionary(TC1.colorCount)).toStrictEqual(TC1.orderedColorCountDictionary);
});

test("Function toOrderedColorCountDictionary TC2", () => {
    expect(toOrderedColorCountDictionary(TC2.colorCount)).toStrictEqual(TC2.orderedColorCountDictionary);
});

test("Function toOrderedColorCountDictionary TC3", () => {
    expect(toOrderedColorCountDictionary(TC3.colorCount)).toStrictEqual(TC3.orderedColorCountDictionary);
});

test("Function toOrderedColorCountDictionary TC4", () => {
    expect(toOrderedColorCountDictionary(TC4.colorCount)).toStrictEqual(TC4.orderedColorCountDictionary);
});



test("Function toColorSumArray TC4", () => {
    expect(toOrderedColorSumArray(TC4.colorCount)).toStrictEqual(TC4.orderedCornerCubelets);
});

// test("Function sortCornerCubeletsByColorCountOrder TC1", () => {
//     expect(sortCornerCubeletsByColorCountOrder(TC1.orderedColorCountDictionary)).toStrictEqual(TC1.orderedCornerCubelets);
// });

// test("Function sortCornerCubeletsByColorCountOrder TC2", () => {
//     expect(sortCornerCubeletsByColorCountOrder(TC2.orderedColorCountDictionary)).toStrictEqual(TC2.orderedCornerCubelets);
// });

// test("Function sortCornerCubeletsByColorCountOrder TC3", () => {
//     expect(sortCornerCubeletsByColorCountOrder(TC3.orderedColorCountDictionary)).toStrictEqual(TC3.orderedCornerCubelets);
// });

// test("Function sortCornerCubeletsByColorCountOrder TC4", () => {
//     expect(sortCornerCubeletsByColorCountOrder(TC4.orderedColorCountDictionary)).toStrictEqual(TC4.orderedCornerCubelets);
// });

test("removeInfinityCountingParity TC1", () => {
    expect(removeInfinityCountingParity(TC1.orderedCornerCubelets, TC1.orderedColorCountDictionary, TC1.lastCornerColorCosts)
    ).toStrictEqual(TC1.infinityCostsRemoved);
})

test("removeInfinityCountingParity TC2", () => {
    expect(removeInfinityCountingParity(TC2.orderedCornerCubelets, TC2.orderedColorCountDictionary, TC2.lastCornerColorCosts)
    ).toStrictEqual(TC2.infinityCostsRemoved);
})

test("removeInfinityCountingParity TC3", () => {
    expect(removeInfinityCountingParity(TC3.orderedCornerCubelets, TC3.orderedColorCountDictionary, TC3.lastCornerColorCosts)
    ).toStrictEqual(TC3.infinityCostsRemoved);
})

test("removeInfinityCountingParity TC4", () => {
    expect(removeInfinityCountingParity(TC4.orderedCornerCubelets, TC4.orderedColorCountDictionary, TC4.lastCornerColorCosts)
    ).toStrictEqual(TC4.infinityCostsRemoved);
})

test("toOrderedColorCostDictionary TC1", () => {
    expect(toOrderedColorCostDictionary(TC1.lastCornerColorCosts)
    ).toStrictEqual(TC1.orderedCornerColorCosts);
})

test("toOrderedColorCostDictionary TC2", () => {
    expect(toOrderedColorCostDictionary(TC2.lastCornerColorCosts)
    ).toStrictEqual(TC2.orderedCornerColorCosts);
})

test("toOrderedColorCostDictionary TC3", () => {
    expect(toOrderedColorCostDictionary(TC3.lastCornerColorCosts)
    ).toStrictEqual(TC3.orderedCornerColorCosts);
})

test("toOrderedColorCostDictionary TC4", () => {
    expect(toOrderedColorCostDictionary(TC4.lastCornerColorCosts)
    ).toStrictEqual(TC4.orderedCornerColorCosts);
})

test("parityCountOfCorners PCC_TC1", () => {
    expect(parityCountOfCorners(
        PCC_TC1.cubelets,
        PCC_TC1.orderedColorCount)
    ).toBe(PCC_TC1.resultParity);
})

test("parityCountOfCorners PCC_TC2", () => {
    expect(parityCountOfCorners(
        PCC_TC2.cubelets,
        PCC_TC2.orderedColorCount)
    ).toBe(PCC_TC2.resultParity);
})

test("parityCountOfCorners PCC_TC3", () => {
    expect(parityCountOfCorners(
        PCC_TC3.cubelets,
        PCC_TC3.orderedColorCount)
    ).toBe(PCC_TC3.resultParity);
})

test("parityCountOfCorners PCC_TC4", () => {
    expect(parityCountOfCorners(
        PCC_TC4.cubelets,
        PCC_TC4.orderedColorCount)
    ).toBe(PCC_TC4.resultParity);
})

test("parityCountOfCorners PCC_TC5", () => {
    expect(parityCountOfCorners(
        PCC_TC5.cornerColorCounts,
        PCC_TC5.orderedColorCount)
    ).toBe(PCC_TC5.resultParity);
})
PCC_TC6

test("parityCountOfCorners PCC_TC6", () => {
    expect(parityCountOfCorners(
        PCC_TC6.cornerColorCounts,
        PCC_TC6.orderedColorCount)
    ).toBe(PCC_TC6.resultParity);
})

test.only("Define Last Corner TC1", () => {
    var lastCornerColorCosts = TC1.lastCornerColorCosts;
    var colorCount = TC1.colorCount;
    var lastCornerColorIndex = lastCornerColorWithOrientationChecked(lastCornerColorCosts, colorCount);
    expect(lastCornerColorIndex).toBe(TC1.resultColorIdx);
});

test.only("Define Last Corner TC2", () => {
    var lastCornerColorCosts = TC2.lastCornerColorCosts;
    var colorCount = TC2.colorCount;
    var lastCornerColorIndex = lastCornerColorWithOrientationChecked(lastCornerColorCosts, colorCount);
    expect(lastCornerColorIndex).toBe(TC2.resultColorIdx);
});

test.only("Define Last Corner TC3", () => {
    var lastCornerColorCosts = TC3.lastCornerColorCosts;
    var colorCount = TC3.colorCount;
    var lastCornerColorIndex = lastCornerColorWithOrientationChecked(lastCornerColorCosts, colorCount);
    expect(lastCornerColorIndex).toBe(TC3.resultColorIdx);
});

test.only("Define Last Corner TC4", () => {
    var lastCornerColorCosts = TC4.lastCornerColorCosts;
    var colorCount = TC4.colorCount;
    var lastCornerColorIndex = lastCornerColorWithOrientationChecked(lastCornerColorCosts, colorCount);
    expect(lastCornerColorIndex).toBe(TC4.resultColorIdx);
});

test.only("Define Last Corner TC5", () => {
    var lastCornerColorCosts = TC5.lastCornerColorCosts;
    var colorCount = TC5.colorCount;
    var lastCornerColorIndex = lastCornerColorWithOrientationChecked(lastCornerColorCosts, colorCount);
    expect(lastCornerColorIndex).toBe(TC5.resultColorIdx);
});
