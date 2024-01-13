import type {ChangeOperation} from '/@/model/ChangeOperation';
import type {ChangeTarget} from '/@/model/ChangeTarget';
import type {EffectType} from '/@/model/EffectType';
import type {Effect} from '/@/model/Effect';

export interface EffectToDisplay {
  id: string,
  wasActivated: boolean,
  description: string | null,
  operation: ChangeOperation,
  target: ChangeTarget,
  value: number,
  type: EffectType,
}

export function from(id: string, wasActivated: boolean, source: Effect): EffectToDisplay {
  return {
    id: id,
    wasActivated: wasActivated,
    description: source.description,
    operation: source.operation,
    target: source.target,
    value: source.value,
    type: source.type,
  };
}
