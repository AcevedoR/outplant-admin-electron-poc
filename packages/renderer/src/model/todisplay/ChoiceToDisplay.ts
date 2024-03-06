import type {ChoiceOutcomeToDisplay} from './ChoiceOutcomeToDisplay';
import type {EffectToDisplay} from '/@/model/todisplay/EffectToDisplay';
import type {Choice} from '/@/model/Choice';
import type {Effect} from '/@/model/Effect';
import type {ChoiceOutcome} from '/@/model/ChoiceOutcome';
import {getFullEffects} from '/@/model/todisplay/EffectToDisplay';

export interface ChoiceToDisplay {
  id: ChoiceToDisplayId;
  text: string;
  next: Array<ChoiceOutcomeToDisplay>;
  effects: EffectToDisplay[];
}

export class ChoiceToDisplayId {
  constructor(parentId: string, choiceIndex: number) {
    this.parentId = parentId;
    this.choiceIndex = choiceIndex;
  }

  parentId: string;
  choiceIndex: number;

  get(): string {
    return `${this.parentId}__choice-${this.choiceIndex}`;
  }
}

function convertToChoiceOutcomeToDisplay(
  parentId: ChoiceToDisplayId,
  source: ChoiceOutcome[],
  chainEffects: Record<string, Effect>,
): ChoiceOutcomeToDisplay[] {
  const res: ChoiceOutcomeToDisplay[] = [];
  let i = 0;
  for (const choiceOutcome of source as ChoiceOutcome[]) {
    res.push({
      ...choiceOutcome,
      id: `${parentId.get()}__outcome-${i}`,
      effects: getFullEffects(choiceOutcome.effects, chainEffects),
    });
    i = i + 1;
  }
  return res;
}

export function fromChoice(
  parentId: string,
  choiceIndex: number,
  source: Choice,
  chainEffects: Record<string, Effect>,
): ChoiceToDisplay {
  const choiceToDisplayId = new ChoiceToDisplayId(parentId, choiceIndex);
  return {
    id: choiceToDisplayId,
    text: source.text,
    next: convertToChoiceOutcomeToDisplay(choiceToDisplayId, source.next, chainEffects),
    effects: getFullEffects(source.effects, chainEffects),
  };
}
