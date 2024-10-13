import type {ChangeOperation} from './ChangeOperation';
import type {ChangeTarget} from './ChangeTarget';
import type {EffectType} from './EffectType';

export interface Effect {
  description?: string;
  operation: ChangeOperation;
  target: ChangeTarget;
  value: number;
  type: EffectType;
}
