import type {EffectToDisplay} from '/@/model/todisplay/EffectToDisplay';
import type {Effect} from '/@/model/Effect';
import type {Next} from '/@/model/Next';
import {getFullEffects} from '/@/model/todisplay/EffectToDisplay';

export interface NextToDisplay {
  event: string,
  in: number | null,
  weight: number | null,
  effects: EffectToDisplay[],
}

export function fromNext(source: Next, chainEffects: Record<string, Effect>): NextToDisplay {
  return {
    effects: getFullEffects(source.effects, chainEffects),
    event: source.event,
    in: source.in,
    weight: source.weight,
  };
}
