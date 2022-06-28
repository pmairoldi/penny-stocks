import { ModifierDTO } from "@penny-stocks/shared";

export const textForModifier = (modifier: ModifierDTO) => {
  switch (modifier) {
    case "crash":
      return "Crash";
    case "payday":
      return "Dividend";
    case "plus-1":
      return "+1";
    case "plus-2":
      return "+2";
    case "plus-3":
      return "+3";
    case "plus-5":
      return "+5";
    case "minus-1":
      return "-1";
    case "minus-2":
      return "-2";
    case "minus-3":
      return "-3";
  }
};
