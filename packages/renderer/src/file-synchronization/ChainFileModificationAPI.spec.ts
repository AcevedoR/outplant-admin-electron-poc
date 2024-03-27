import {describe, expect, it, vi} from 'vitest';
import type {Chain} from '../model/Chain';
import {
  createChoice,
  createEvent,
  editChoice,
  editEvent,
  linkEvent,
} from './ChainFileModificationAPI';
import {ChoiceToDisplayId} from '../model/todisplay/ChoiceToDisplay';

const START_EVENT_ID: string = 'start';
const CHAIN_ABSOLUTE_PATH: string = 'dummy chain absolute path';
const EMPTY_CHAIN: Chain = {
  title: 'my-chain-id-1',
  events: {
    start: {
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

describe('testing modification of an Event of a Chain', () => {
  it('should edit event text', () => {
    const chain = deepCopy(EMPTY_CHAIN);
    const newText = 'my new text';

    editEvent(CHAIN_ABSOLUTE_PATH, chain, START_EVENT_ID, newText);

    expect(chain.events[START_EVENT_ID]).toEqual({
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

    await createEvent(CHAIN_ABSOLUTE_PATH, chain, {
      id: eventId,
      text: text,
      parentEventId: START_EVENT_ID,
    });

    expect(
      chain.events[START_EVENT_ID].next,
      'parent event.next should have been linked to new event',
    ).toEqual([
      {
        event: eventId,
        in: null,
        weight: null,
        effects: null,
      },
    ]);

    expect(chain.events[eventId], 'event itself should have been created').toEqual({
      text: text,
      next: null,
      effects: null,
      choices: null,
    });
  });

  it('should not allow creating a choice on an event outcoming events', async () => {
    const chain = deepCopy(EMPTY_CHAIN);

    await given('given the start_event already has one outcoming event', async () => {
      await createEvent(CHAIN_ABSOLUTE_PATH, chain, {
        id: 'new-event-1',
        text: 'some text',
        parentEventId: START_EVENT_ID,
      });
    });

    expect(() =>
      createChoice(CHAIN_ABSOLUTE_PATH, chain, {
        text: 'some text',
        parentEventId: START_EVENT_ID,
      }),
    ).toThrowError('cannot create a choice on an event outcoming events');
  });

  it('should not allow creating an event on an event outcoming choices', async () => {
    const chain = deepCopy(EMPTY_CHAIN);

    await given('given the start_event already has one outcoming choice', async () => {
      await createChoice(CHAIN_ABSOLUTE_PATH, chain, {
        text: 'some text',
        parentEventId: START_EVENT_ID,
      });
    });

    expect(() =>
      createEvent(CHAIN_ABSOLUTE_PATH, chain, {
        id: 'eventid',
        text: 'some text',
        parentEventId: START_EVENT_ID,
      }),
    ).toThrowError('cannot create an event on an event outcoming choices');
  });

  it('should not allow linking an un-existing event', async () => {
    const chain = deepCopy(EMPTY_CHAIN);
    expect(() =>
      linkEvent(CHAIN_ABSOLUTE_PATH, chain, START_EVENT_ID, 'unexisting-event-id'),
    ).toThrowError('event should exist');
  });

  it('should not allow linking to an un-existing parent event', async () => {
    const chain = deepCopy(EMPTY_CHAIN);
    expect(() =>
      linkEvent(CHAIN_ABSOLUTE_PATH, chain, 'unexisting-parent-event-id', START_EVENT_ID),
    ).toThrowError('parent event should exist');
  });

  // TODO either ->choices or ->events but not both
});

describe('testing modification of a Choice of a Chain', () => {
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

    expect(chain.events[START_EVENT_ID].choices).toEqual([
      {
        text: newText,
        effects: {},
        next: null,
      },
    ]);
  });

  it('should create choice', async () => {
    const chain = deepCopy(EMPTY_CHAIN);
    const text = 'a new choice with text';

    await createChoice(CHAIN_ABSOLUTE_PATH, chain, {
      parentEventId: START_EVENT_ID,
      text: text,
    });

    expect(
      chain.events[START_EVENT_ID].choices,
      'choice should have been created on parent event',
    ).toEqual([
      {
        text: text,
        next: [],
        effects: null,
      },
    ]);
  });

  it('cannot create a choice from an unexisting event', async () => {
    const chain = deepCopy(EMPTY_CHAIN);
    const text = 'a new choice with text';

    expect(() =>
      createChoice(CHAIN_ABSOLUTE_PATH, chain, {
        parentEventId: 'unknown-parent-event-id',
        text: text,
      }),
    ).toThrowError('choice parent event does not exist');
  });
});

function deepCopy(variable: Chain) {
  return JSON.parse(JSON.stringify(variable));
}
async function given(description: string, f: () => Promise<void>) {
  await f();
}
