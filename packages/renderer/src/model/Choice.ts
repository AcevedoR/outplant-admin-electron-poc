import type {ChoiceOutcome} from './ChoiceOutcome';

export interface Choice {
  text: string;
  next: Array<ChoiceOutcome>;
  effects: Record<string, boolean> | null;
  if?: Condition;
}

export type Condition = StateCondition | VariableCondition | { allOf: Condition[] } | { anyOf: Condition[] };

export type StateCondition = {
  comparator: Comparator;
  target: StateVariable;
  value: number;

};

export type StateVariable = 'population' | 'ecology' | 'money';

export type Comparator = 'lt' | 'lte' | 'eq' | 'gte' | 'gt';

export type VariableCondition = {
  comparator: VariableComparator;
  target: string;
  value: string;
}

export type VariableComparator = 'eq' | 'not';
