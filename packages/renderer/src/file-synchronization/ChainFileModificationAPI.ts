import type {Chain} from '../model/Chain';
import type {ChoiceToDisplayId} from '../model/todisplay/ChoiceToDisplay';
import {updateChainFile} from '../ElectronAPIUtils';

export function editChoice(
  chainFileAbsolutePath: string,
  chain: Chain,
  choiceId: ChoiceToDisplayId,
  text: string,
): Promise<void> {
  const event = chain.events[choiceId.parentId];

  if (!event) {
    throw new Error('event should exist');
  }
  if (!event.choices) {
    throw new Error('event should contain choices');
  }

  const choice = event.choices[choiceId.choiceIndex];
  choice.text = text;
  console.log('modified choice text to: ' + choice.text);

  return requestUpdateChainFile(chainFileAbsolutePath, chain);
}

export function editEvent(
  chainFileAbsolutePath: string,
  chain: Chain,
  eventId: string,
  text: string,
): Promise<void> {
  const event = chain.events[eventId];

  if (!event) {
    throw new Error('event should exist');
  }

  event.text = text;
  console.log('modified event text to: ' + event.text);

  return requestUpdateChainFile(chainFileAbsolutePath, chain);
}

function requestUpdateChainFile(chainFileAbsolutePath: string, chain: Chain) {
  return updateChainFile(chainFileAbsolutePath, JSON.stringify(chain, null, 2));
}
