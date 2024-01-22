<script lang="ts">
  import ChainFlowViewer from '/@/chain-flow/ChainFlowViewer.svelte';
  import {getChain, getCurrentChainsDirectory} from '/@/ElectronAPIUtils';
  import FileSelectionOverlay from '/@/file-selection/FileSelectionOverlay.svelte';
  import type {Chain} from '/@/model/Chain';

  let selectedContent: string | undefined;

  function changeSelectedContent(changedSelectedContentEvent: {detail: {selectedContent: string}}) {
    selectedContent = changedSelectedContentEvent.detail.selectedContent;
  }

  let currentChainsDirectory: Promise<string> = getCurrentChainsDirectory();
  let chainPromise: Promise<Chain> | undefined = undefined;

  const onChainSelectionChange = (chainSelection: string): void => {
    chainPromise = getChain(chainSelection);
  };
</script>

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
    <ChainFlowViewer chain={ chain} {selectedContent} on:change={changeSelectedContent} />
  {:catch someError}
    System error: {someError.message}.
  {/await}
{/if}

{#if selectedContent !== undefined}
  <div id="admin-sidebar">

    <h1>Admin sidebar</h1>

    <div id="selected-content-display">
      <div>
        <h2>text</h2>
        <p>{selectedContent}</p>
      </div>

    </div>
  </div>
{/if}


<style>
    :global(#app) {
        display: flex;
        flex-direction: row;
    }

    :global(#app #chain-flow) {
        width: 100%;
    }

    :global(#app #admin-sidebar) {
        width: 33%;
        height: 100%;
        right: 0;
        display: block;
    }
</style>
