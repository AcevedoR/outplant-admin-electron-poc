// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type {ChoiceOutcome} from './ChoiceOutcome';

export interface Choice {
  text: string;
  next: Array<ChoiceOutcome>;
  effects: Record<string, boolean> | null;
}
