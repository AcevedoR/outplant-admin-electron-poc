import type {ChangeOperation} from '/@/model/ChangeOperation';
import type {ChangeTarget} from '/@/model/ChangeTarget';
import type {EffectType} from '/@/model/EffectType';
import type {Effect} from '/@/model/Effect';

export interface EffectToDisplay {
  id: string;
  wasActivated: boolean;
  description: string | null;
  operation: ChangeOperation;
  target: ChangeTarget;
  value: number;
  type: EffectType;
}

export function getFullEffects(
  effectIDs: Record<string, boolean> | null,
  chainEffects: Record<string, Effect>,
) {
  const populatedEffects: EffectToDisplay[] = [];
  if (!effectIDs) {
    return populatedEffects;
  }

  for (const effectName in effectIDs) {
    const effect = chainEffects[effectName];
    if (!effect) {
      throw new Error('effect in event should exist in the Chain');
    }
    populatedEffects.push({
      id: effectName,
      wasActivated: effectIDs[effectName],
      ...effect,
    });
  }
  return populatedEffects;
}
