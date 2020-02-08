export function reshapeArrayToCubeFaceGrid(grid_width, grid_height, array) {
    const rowOneOffset = grid_width * 3;
    const rowTwoOffset = 2 * grid_width * 3;
    const rowCubeOffset = 3 * grid_width * 3;
    const cubeFaceGrid = [];
    for (let row = 0; row < grid_height; row++) {
        cubeFaceGrid[row] = [];
        const row_offset = row * rowCubeOffset;
        for (let col = 0; col < grid_width; col++) {
            const col_offset = col * 3;
            cubeFaceGrid[row][col] =
                [array.slice(row_offset + col_offset, row_offset + col_offset + 3),
                array.slice(row_offset + col_offset + rowOneOffset, row_offset + col_offset + rowOneOffset + 3),
                array.slice(row_offset + col_offset + rowTwoOffset, row_offset + col_offset + rowTwoOffset + 3)];
        }
    }
    return cubeFaceGrid;
};

