export type MarkerDTO = "red" | "blue" | "yellow" | "purple";

export interface PlacedMarkerDTO {
  type: MarkerDTO;
  playerId: string;
}
