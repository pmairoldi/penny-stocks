export type Marker = "red" | "blue" | "yellow" | "purple";

export interface PlacedMarker {
  type: Marker;
  playerId: string;
}
