import type {Writable} from 'svelte/store';
import {writable} from 'svelte/store';
import type {ChoiceToDisplay} from '/@/model/todisplay/ChoiceToDisplay';
import type {EventToDisplay} from '/@/model/todisplay/EventToDisplay';

export const selectedContent: Writable<ChoiceToDisplay | EventToDisplay | undefined> =
  writable(undefined); // TODO use this store everywhere now ?
