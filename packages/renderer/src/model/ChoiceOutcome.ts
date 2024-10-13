import { Condition } from "./Choice";

export interface ChoiceOutcome {
  event: string;
  in?: number;
  weight?: number;
  effects?: Record<string, boolean>;
  if?: Condition;
}
