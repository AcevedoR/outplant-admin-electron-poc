import type {TriggerComparator} from './TriggerComparator';
import type {TriggerTarget} from './TriggerTarget';

export interface Trigger {
  comparator: TriggerComparator;
  target: TriggerTarget;
  value: number;
}
