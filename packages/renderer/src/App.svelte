<script lang="ts">
  import ChainFlowViewer from '/@/chain-flow/ChainFlowViewer.svelte';
  import {getChain, getCurrentChainsDirectory} from '/@/ElectronAPIUtils';
  import FileSelectionOverlay from '/@/file-selection/FileSelectionOverlay.svelte';
  import type {Chain} from '/@/model/Chain';
  import type {ChoiceToDisplay} from '/@/model/todisplay/ChoiceToDisplay';
  import {
    createChoice,
    createChoiceOutcome,
    createEvent,
    editChoice,
    editEvent,
  } from '/@/file-synchronization/ChainFileModificationAPI';
  import type {EventToDisplay} from '/@/model/todisplay/EventToDisplay';
  import {isEventToDisplay} from '/@/model/todisplay/EventToDisplay.js';
  import ChoiceEditionSidebar from '/@/admin-view/ChoiceEditionSidebar.svelte';
  import EventEditionSidebar from '/@/admin-view/EventEditionSidebar.svelte';
  import type {CreateEvent} from '/@/file-synchronization/CreateEvent';
  import type {CreateChoice} from '/@/file-synchronization/CreateChoice';
  import type {CreateChoiceOutcome} from '/@/file-synchronization/CreateChoiceOutcome';

  let selectedContentToEdit: ChoiceToDisplay | EventToDisplay | undefined;

  function changeSelectedContent(changedSelectedContentEvent: {
    detail: {selectedContent: ChoiceToDisplay | undefined}
  }) {
    selectedContentToEdit = changedSelectedContentEvent.detail.selectedContent;
  }

  function modifyChain(chainFileAbsolutePath: string, chain: Chain, modificationEvent: {
    detail: {type: string, id: any, content: unknown}
  }): void {
    switch (modificationEvent.detail.type) {
      case 'updateChoice':
        editChoice(chainFileAbsolutePath, chain, modificationEvent.detail.id, modificationEvent.detail.content as string).then(v => onChainSelectionChange(chainFileAbsolutePath));
        break;
      case 'updateEvent':
        editEvent(chainFileAbsolutePath, chain, modificationEvent.detail.id, modificationEvent.detail.content as string).then(v => onChainSelectionChange(chainFileAbsolutePath));
        break;
      case 'createEvent':
        createEvent(chainFileAbsolutePath, chain, modificationEvent.detail.content as CreateEvent).then(v => onChainSelectionChange(chainFileAbsolutePath));
        break;
      case 'createChoice':
        createChoice(chainFileAbsolutePath, chain, modificationEvent.detail.content as CreateChoice).then(v => onChainSelectionChange(chainFileAbsolutePath));
        break;
      case 'createChoiceOutcome':
        createChoiceOutcome(chainFileAbsolutePath, chain, modificationEvent.detail.content as CreateChoiceOutcome).then(v => onChainSelectionChange(chainFileAbsolutePath));
        break;
      default:
        throw Error('unhandled modification event: ' + modificationEvent.detail.type);
    }
  }

  let currentChainsDirectory: Promise<string> = getCurrentChainsDirectory();
  let chainPromise: Promise<{chain: Chain, chainFileAbsolutePath: string}> | undefined = undefined;

  const onChainSelectionChange = (chainSelection: string): void => {
    // refresh the entire chain screen
    chainPromise = getChain(chainSelection);
  };
</script>

<svelte:window on:error={(errorEvent) => alert(errorEvent.message)}/>

{#await currentChainsDirectory}
  Getting directory path, this show be instantaneous
{:then x}
  <FileSelectionOverlay currentChainsDirectory={x} onChainSelectionChange={onChainSelectionChange} />
{:catch someError}
  System error: {someError.message}.
{/await}

{#if chainPromise}
  {#await chainPromise}
    Loading chain...
  {:then chain}
    <ChainFlowViewer chain={chain.chain} selectedContent={selectedContentToEdit} on:change={changeSelectedContent} />
    {#if selectedContentToEdit !== undefined}
      {#if isEventToDisplay(selectedContentToEdit) }
        <EventEditionSidebar selectedContentToEdit={selectedContentToEdit}
                             on:save={e => modifyChain(chain.chainFileAbsolutePath, chain.chain, e)} />
      {:else}
        <ChoiceEditionSidebar selectedContentToEdit={selectedContentToEdit}
                              on:save={e => modifyChain(chain.chainFileAbsolutePath, chain.chain, e)} />
      {/if}
    {/if}
  {:catch someError}
    System error: {someError.message}.
  {/await}
{/if}


<style>
  :global(#app) {
    display: flex;
    flex-direction: row;
  }

  :global(#app #chain-flow) {
    width: 100%;
  }
</style>
