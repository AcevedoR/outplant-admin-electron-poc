import type {ChoiceOutcomeToDisplay} from './ChoiceOutcomeToDisplay';
import type {EffectToDisplay} from '/@/model/todisplay/EffectToDisplay';
import type {Choice} from '/@/model/Choice';
import type {Effect} from '/@/model/Effect';
import type {ChoiceOutcome} from '/@/model/ChoiceOutcome';

export interface ChoiceToDisplay {
  text: string,
  next: Array<ChoiceOutcomeToDisplay>,
  effects: EffectToDisplay[],
}

function getFullEffects(effectIDs: Record<string, boolean> | null, chainEffects: Record<string, Effect>) {
  const populatedEffects: EffectToDisplay[] = [];
  if (!effectIDs) {
    return populatedEffects;
  }

  for (const effectName in effectIDs) {
    const effect = chainEffects[effectName];
    if (!effect) {
      throw new Error('effect in event should exist in the Chain');
    }
    populatedEffects.push(
      {
        id: effectName,
        wasActivated: effectIDs[effectName],
        ...effect,
      },
    );
  }
  return populatedEffects;
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
