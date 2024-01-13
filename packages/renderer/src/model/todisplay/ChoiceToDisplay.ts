import type {ChoiceOutcomeToDisplay} from './ChoiceOutcomeToDisplay';
import type {EffectToDisplay} from '/@/model/todisplay/EffectToDisplay';
import type {Choice} from '/@/model/Choice';
import type {Effect} from '/@/model/Effect';
import type {ChoiceOutcome} from '/@/model/ChoiceOutcome';
import {getFullEffects} from '/@/model/todisplay/EffectToDisplay';

export interface ChoiceToDisplay {
  text: string,
  next: Array<ChoiceOutcomeToDisplay>,
  effects: EffectToDisplay[],
}

function convertToChoiceOutcomeToDisplay(source: ChoiceOutcome[], chainEffects: Record<string, Effect>): ChoiceOutcomeToDisplay[] {
  const res: ChoiceOutcomeToDisplay[] = [];
  for (const choiceOutcome of source as ChoiceOutcome[]) {
    res.push(
      {
        ...choiceOutcome,
        effects: getFullEffects(choiceOutcome.effects, chainEffects),
      },
    );
  }
  return res;
}

export function fromChoice(source: Choice, chainEffects: Record<string, Effect>): ChoiceToDisplay {
  return {
    text: source.text,
    next: convertToChoiceOutcomeToDisplay(source.next, chainEffects),
    effects: getFullEffects(source.effects, chainEffects),
  };
}
