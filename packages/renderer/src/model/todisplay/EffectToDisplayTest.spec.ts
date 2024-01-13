import { describe, expect, it } from 'vitest';
import {fromChoice} from './ChoiceToDisplay';
import type {Effect} from '../Effect';
import type {Choice} from '../Choice';

describe('test mapping', () => {
  it('should map', () => {
    const source: Choice = {
      effects: {myEffectName: true},
      text: 'some text',
      next: [{
        event: 'event name',
        effects: {myEffectName: false},
        weight: 2,
        in: 3,
      }],
    };
    const chainEffects: Record<string, Effect> = {
      myEffectName:
        {
          type: 'instant',
          target: 'population',
          value: 1,
          operation: 'add',
          description: 'desc',
        },
    };

    const choiceToDisplay = fromChoice(source, chainEffects);
    console.debug(choiceToDisplay);
    expect(choiceToDisplay).toEqual(
      {
        effects: [{
          id: 'myEffectName',
          wasActivated: true,
          type: 'instant',
          target: 'population',
          value: 1,
          operation: 'add',
          description: 'desc',
        }],
        text: 'some text',
        next: [{
          event: 'event name',
          effects: [{
            id: 'myEffectName',
            wasActivated: false,
            type: 'instant',
            target: 'population',
            value: 1,
            operation: 'add',
            description: 'desc',
          }],
          weight: 2,
          in: 3,
        }],
      },
    );
  });
});
