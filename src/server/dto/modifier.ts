export type PlayerModifierDTO = "payday" | "crash";

export type PriceModifierDTO =
  | "plus-1"
  | "plus-2"
  | "plus-3"
  | "plus-5"
  | "minus-1"
  | "minus-2"
  | "minus-3";

export type ModifierDTO = PlayerModifierDTO | PriceModifierDTO;
