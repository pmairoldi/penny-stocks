import { Modifier } from "./modifier";
import { Tile } from "./tile";
import { getRandomItem, removeItem } from "./utils";

type Row = Tile[];

interface BoardState {
  rows: Row[];
}
export interface Board {
  state: BoardState;
  updateTile: (
    row: number,
    column: number,
    callback: (tile: Tile) => Tile
  ) => Board;
}

const countForRow = (row: number) => {
  if (row > 6) {
    return 13 - 1 * (row - 6);
  } else if (row < 6) {
    return 7 + 1 * row;
  } else {
    return 13;
  }
};

const tileAtRowColumn = (
  row: number,
  column: number,
  getModifier: () => Modifier
): Tile => {
  if ([0, 12].includes(row) && [2, 4].includes(column)) {
    return {
      type: "modifier",
      row: row,
      column: column,
      modifier: getModifier(),
      marker: null,
    };
  } else if ([1, 11].includes(row) && [1, 3, 4, 6].includes(column)) {
    return {
      type: "modifier",
      row: row,
      column: column,
      modifier: getModifier(),
      marker: null,
    };
  } else if ([2, 10].includes(row) && [3, 5].includes(column)) {
    return {
      type: "modifier",
      row: row,
      column: column,
      modifier: getModifier(),
      marker: null,
    };
  } else if ([3, 9].includes(row) && [2, 7].includes(column)) {
    return {
      type: "modifier",
      row: row,
      column: column,
      modifier: getModifier(),
      marker: null,
    };
  } else if ([4, 8].includes(row) && [1, 4, 5, 6, 9].includes(column)) {
    return {
      type: "modifier",
      row: row,
      column: column,
      modifier: getModifier(),
      marker: null,
    };
  } else if ([5, 7].includes(row) && [0, 2, 4, 7, 9, 11].includes(column)) {
    return {
      type: "modifier",
      row: row,
      column: column,
      modifier: getModifier(),
      marker: null,
    };
  } else if ([6].includes(row) && [0, 1, 4, 6, 8, 11, 12].includes(column)) {
    return {
      type: "modifier",
      row: row,
      column: column,
      modifier: column === 6 ? "plus-5" : getModifier(),
      marker: null,
    };
  } else if (row === 2 && column === 0) {
    return {
      type: "start",
      row: row,
      column: column,
      marker: "blue",
    };
  } else if (row === 2 && column === 8) {
    return {
      type: "start",
      row: row,
      column: column,
      marker: "purple",
    };
  } else if (row === 10 && column === 0) {
    return {
      type: "start",
      row: row,
      column: column,
      marker: "yellow",
    };
  } else if (row === 10 && column === 8) {
    return {
      type: "start",
      row: row,
      column: column,
      marker: "red",
    };
  } else {
    return { type: "default", row: row, column: column, marker: null };
  }
};

const createModifers = (): Modifier[] => {
  const create = (modifier: Modifier, count: number) =>
    new Array<Modifier>(count).fill(modifier);

  return [
    ...create("plus-1", 5),
    ...create("plus-2", 8),
    ...create("plus-3", 6),
    ...create("minus-1", 3),
    ...create("minus-2", 6),
    ...create("minus-3", 4),
    ...create("payday", 8),
    ...create("illness", 8),
  ];
};

const updateTile = (state: BoardState) => {
  return (
    row: number,
    column: number,
    callback: (tile: Tile) => Tile
  ): Board => {
    const { rows } = state;
    const updatedRows = rows.slice();
    const tiles = updatedRows[row].slice();
    const tile = tiles[column];

    tiles[column] = callback({ ...tile });
    updatedRows[row] = tiles;

    const updated = { rows: updatedRows };

    return boardFromState(updated);
  };
};

export function createBoard(): Board {
  const modifiers = createModifers();
  const getModifier = (): Modifier => {
    var modifer = getRandomItem(modifiers);

    removeItem(modifiers, (item) => item === modifer);

    return modifer;
  };

  const rows = new Array<{ tiles: Tile[] }>(13)
    .fill((null as unknown) as { tiles: Tile[] })
    .map((_, row) => {
      const count = countForRow(row);
      return new Array<Tile>(count)
        .fill((null as unknown) as Tile)
        .map((_, column) => {
          return tileAtRowColumn(row, column, getModifier);
        });
    });

  const state = { rows: rows };
  return boardFromState(state);
}

export function boardFromState(state: BoardState): Board {
  return {
    state: state,
    updateTile: updateTile(state),
  };
}

export function boardFromJSON(json: { [key: string]: any }): Board {
  const state: BoardState = {
    rows: json.rows,
  };

  return {
    state: state,
    updateTile: updateTile(state),
  };
}
