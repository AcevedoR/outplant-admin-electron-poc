import type {Effect} from './Effect';
import type {Event} from './Event';
import type {Trigger} from './Trigger';

export interface Chain {
  title: string;
  cooldown: number;
  trigger?: Trigger;
  events: Record<string, Event>;
  effects: Record<string, Effect>;
  autoSelect?: boolean;
}
