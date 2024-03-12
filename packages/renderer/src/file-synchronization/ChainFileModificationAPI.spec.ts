import {describe, expect, it, vi} from 'vitest';
import type {Chain} from '../model/Chain';
import {createEvent, editChoice, editEvent} from './ChainFileModificationAPI';
import {ChoiceToDisplayId} from '../model/todisplay/ChoiceToDisplay';

describe('test modification API of a Chain', () => {
  const CHAIN_ABSOLUTE_PATH: string = 'dummy chain absolute path';
  const START_EVENT_ID: string = 'start';
  const EMPTY_CHAIN: Chain = {
    title: 'my-chain-id-1',
    events: {
      'start': {
        text: 'this is the chain start event text',
        effects: {},
        choices: [],
        next: null,
      },
    },
    effects: {},
    cooldown: 1,
    trigger: null,
    autoSelect: true,
  };

  vi.mock('../ElectronAPIUtils');

  it('should edit choice text', () => {
    const chain = deepCopy(EMPTY_CHAIN);
    chain.events[START_EVENT_ID].choices.push({
      text: 'my original choice text',
      effects: {},
      next: null,
    });

    const choiceId: ChoiceToDisplayId = new ChoiceToDisplayId(START_EVENT_ID, 0);
    const newText = 'my new text';

    editChoice(CHAIN_ABSOLUTE_PATH, chain, choiceId, newText);

    expect(chain.events[START_EVENT_ID].choices).toEqual([{
      text: newText,
      effects: {},
      next: null,
    }]);
  });

  it('should edit event text', () => {
    const chain = deepCopy(EMPTY_CHAIN);
    const newText = 'my new text';

    editEvent(CHAIN_ABSOLUTE_PATH, chain, START_EVENT_ID, newText);

    expect(chain.events[START_EVENT_ID]).toEqual(
      {
        text: newText,
        effects: {},
        choices: [],
        next: null,
      });
  });

  it('should create event with text only', async () => {
    const chain = deepCopy(EMPTY_CHAIN);
    const text = 'a new event with text';
    const eventId = 'my-new-event-id';

    await createEvent(CHAIN_ABSOLUTE_PATH, chain, {id: eventId, text: text, parentEventId: START_EVENT_ID});

    expect(chain.events[START_EVENT_ID].next, 'parent event.next should have been linked to new event').toEqual([{
      event: eventId,
      in: null,
      weight: null,
      effects: null,
    }]);

    expect(chain.events[eventId], 'event itself should have been created').toEqual({
      text: text,
      next: null,
      effects: null,
      choices: null,
    });
  });
});

function deepCopy(variable: Chain) {
  return JSON.parse(JSON.stringify(variable));
}
