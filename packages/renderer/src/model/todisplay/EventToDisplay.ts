import type {Next} from '/@/model/Next';
import type {Event} from '/@/model/Event';
import type {Choice} from '/@/model/Choice';
import type {EffectToDisplay} from '/@/model/todisplay/EffectToDisplay';
import {getFullEffects} from '/@/model/todisplay/EffectToDisplay';
import type {Effect} from '/@/model/Effect';
import type {ChoiceToDisplay} from '/@/model/todisplay/ChoiceToDisplay';
import {fromChoice} from '/@/model/todisplay/ChoiceToDisplay';
import type {NextToDisplay} from '/@/model/todisplay/NextToDisplay';
import {fromNext} from '/@/model/todisplay/NextToDisplay';

export interface EventToDisplay {
  id: string;
  text: string;
  next: Array<NextToDisplay> | null;
  effects: EffectToDisplay[];
  choices: Array<ChoiceToDisplay> | null;
}

/**
 * user-defined type guard
 * see https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
 * @param item you want to check if it has EventToDisplay type
 */
export function isEventToDisplay(item: any): item is EventToDisplay {
  return 'choices' in item;
}

export function fromEvent(
  source: Event,
  sourceId: string,
  chainEffects: Record<string, Effect>,
): EventToDisplay {
  const fullChoices: ChoiceToDisplay[] = [];
  if (source.choices) {
    let i = 0;
    for (const choice of source.choices as Choice[]) {
      fullChoices.push(fromChoice(sourceId, i, choice, chainEffects));
      i = i + 1;
    }
  }
  const fullNexts: NextToDisplay[] = [];
  if (source.next) {
    for (const next of source.next as Next[]) {
      fullNexts.push(fromNext(next, chainEffects));
    }
  }
  return {
    id: sourceId,
    text: source.text,
    next: fullNexts,
    choices: fullChoices,
    effects: getFullEffects(source.effects, chainEffects),
  };
}
