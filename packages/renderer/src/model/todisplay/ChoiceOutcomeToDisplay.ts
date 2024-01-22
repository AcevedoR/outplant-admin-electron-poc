import type {EffectToDisplay} from '/@/model/todisplay/EffectToDisplay';

export interface ChoiceOutcomeToDisplay {
  event: string;
  in: number | null;
  weight: number | null;
  effects: EffectToDisplay[];
}
