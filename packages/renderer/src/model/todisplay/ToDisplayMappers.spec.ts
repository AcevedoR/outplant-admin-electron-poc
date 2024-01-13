import {describe, expect, it} from 'vitest';
import {fromChoice} from './ChoiceToDisplay';
import type {Effect} from '../Effect';
import type {Choice} from '../Choice';
import type {Event} from '../Event';
import {fromEvent} from './EventToDisplay';

describe('test mapping object to display', () => {
  it('should map Choice', () => {
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
  it('should map Event', () => {
    const source: Event = {
      text: 'event text',
      next: [{event: 'next event id', weight: 2, in: 3, effects: {myEffectName: false}}],
      effects: {myEffectName: false},
      choices: [{
        next: [
          {
            event: 'choice next event id',
            weight: 2,
            in: 3,
            effects: {myEffectName: false},
          },
        ],
        effects: {myEffectName: false},
        text: 'choice test',
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

    const eventToDisplay = fromEvent(source, 'my-event-id', chainEffects);
    expect(eventToDisplay).toEqual(
      {
        id: 'my-event-id',
        text: 'event text',
        next: [{
          event: 'next event id',
          weight: 2,
          in: 3,
          effects: [{
            id: 'myEffectName',
            wasActivated: false,
            type: 'instant',
            target: 'population',
            value: 1,
            operation: 'add',
            description: 'desc',
          }],
        }],
        effects: [{
          id: 'myEffectName',
          wasActivated: false,
          type: 'instant',
          target: 'population',
          value: 1,
          operation: 'add',
          description: 'desc',
        }],
        choices: [{
          next: [
            {
              event: 'choice next event id',
              weight: 2,
              in: 3,
              effects: [{
                id: 'myEffectName',
                wasActivated: false,
                type: 'instant',
                target: 'population',
                value: 1,
                operation: 'add',
                description: 'desc',
              }],
            },
          ],
          effects: [{
            id: 'myEffectName',
            wasActivated: false,
            type: 'instant',
            target: 'population',
            value: 1,
            operation: 'add',
            description: 'desc',
          }],
          text: 'choice test',
        }],

      },
    );
  });
});
