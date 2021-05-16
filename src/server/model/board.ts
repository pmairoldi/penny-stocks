import { Marker } from "./marker";
import { Modifier } from "./modifier";
import { Tile } from "./tile";
import { getRandomItem, removeItem } from "./utils";

type Row = Tile[];

interface BoardState {
  rows: Row[];
}

export interface Board {
  state: BoardState;
  setMarker: (row: number, column: number, marker: Marker) => Board;
  canPlaceMarker: (row: number, column: number, marker: Marker) => boolean;
  hasActionTilesRemaining: () => boolean;
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
    ...create("crash", 8),
  ];
};

const canPlaceMarker = (state: BoardState) => {
  const validateCurrentRow = (
    row: Row,
    columnIndex: number
  ): (Marker | null)[] => {
    const markers = new Array<Marker | null>();

    if (columnIndex - 1 >= 0) {
      const before = row[columnIndex - 1];
      markers.push(before.marker);
    }

    if (columnIndex + 1 < row.length) {
      const after = row[columnIndex + 1];
      markers.push(after.marker);
    }

    return markers;
  };

  const validateBeforeOrAfterRow = (
    row: Row,
    columnIndex: number,
    currentRowSize: number
  ): (Marker | null)[] => {
    const markers = new Array<Marker | null>();

    if (row.length < currentRowSize) {
      if (columnIndex < row.length) {
        const rowBeforeColumn = row[columnIndex];
        markers.push(rowBeforeColumn.marker);
      }

      if (columnIndex - 1 >= 0) {
        const rowBeforeColumnBefore = row[columnIndex - 1];
        markers.push(rowBeforeColumnBefore.marker);
      }
    } else {
      if (columnIndex < row.length) {
        const rowBeforeColumn = row[columnIndex];
        markers.push(rowBeforeColumn.marker);
      }

      if (columnIndex + 1 >= 0) {
        const rowBeforeColumnAfter = row[columnIndex + 1];
        markers.push(rowBeforeColumnAfter.marker);
      }
    }

    return markers;
  };

  return (row: number, column: number, marker: Marker): boolean => {
    const markers = new Array<Marker | null>();
    const currentRow = state.rows[row];

    markers.push(...validateCurrentRow(currentRow, column));

    if (row - 1 >= 0) {
      const rowBefore = state.rows[row - 1];
      markers.push(
        ...validateBeforeOrAfterRow(rowBefore, column, currentRow.length)
      );
    }

    if (row + 1 < state.rows.length) {
      const rowAfter = state.rows[row + 1];
      markers.push(
        ...validateBeforeOrAfterRow(rowAfter, column, currentRow.length)
      );
    }

    return markers.some((m) => m === marker);
  };
};

const updateTileMarker = (tile: Tile, marker: Marker) => {
  switch (tile.type) {
    case "default":
      return { ...tile, marker: marker };
    case "modifier":
      return { ...tile, marker: marker };
    case "start":
      return { ...tile };
  }
};

const setMarker = (state: BoardState) => {
  return (row: number, column: number, marker: Marker): Board => {
    const { rows } = state;
    const updatedRows = rows.slice();
    const tiles = updatedRows[row].slice();
    const tile = tiles[column];

    tiles[column] = updateTileMarker(tile, marker);
    updatedRows[row] = tiles;

    const updated = { rows: updatedRows };

    return boardFromState(updated);
  };
};

const hasActionTilesRemaining = (state: BoardState) => {
  return () => {
    const { rows } = state;
    const actionsTiles = rows.reduce((acc, elem) => {
      const tiles = elem.filter((e) => {
        if (
          e.type === "modifier" &&
          (e.modifier === "crash" || e.modifier === "payday")
        ) {
          return e.marker == null;
        } else {
          return false;
        }
      });

      return acc.concat(...tiles);
    }, new Array<Tile>());

    console.log(actionsTiles);
    return actionsTiles.length > 0;
  };
};

export function createBoard(): Board {
  const modifiers = createModifers();
  const getModifier = (): Modifier => {
    var modifer = getRandomItem(modifiers);

    removeItem(modifiers, (item) => item === modifer);

    return modifer;
  };

  const rowCount = 13;
  const rows = new Array<{ tiles: Tile[] }>(rowCount)
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
    setMarker: setMarker(state),
    canPlaceMarker: canPlaceMarker(state),
    hasActionTilesRemaining: hasActionTilesRemaining(state),
  };
}

export interface BoardDTO {
  rows: Row[];
}

export function boardFromJSON(json: BoardDTO): Board {
  const state: BoardState = {
    rows: json.rows,
  };

  return {
    state: state,
    setMarker: setMarker(state),
    canPlaceMarker: canPlaceMarker(state),
    hasActionTilesRemaining: hasActionTilesRemaining(state),
  };
}

export function jsonFromBoard(board: Board): BoardDTO {
  return {
    rows: board.state.rows,
  };
}
