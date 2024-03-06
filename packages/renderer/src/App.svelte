<script lang="ts">
  import ChainFlowViewer from '/@/chain-flow/ChainFlowViewer.svelte';
  import {getChain, getCurrentChainsDirectory} from '/@/ElectronAPIUtils';
  import FileSelectionOverlay from '/@/file-selection/FileSelectionOverlay.svelte';
  import type {Chain} from '/@/model/Chain';
  import AdminSidebar from '/@/admin-view/AdminSidebar.svelte';
  import type {ChoiceToDisplay} from '/@/model/todisplay/ChoiceToDisplay';
  import {editChoice} from '/@/file-synchronization/ChainFileModificationAPI';

  let selectedContentToEdit: ChoiceToDisplay | undefined;

  function changeSelectedContent(changedSelectedContentEvent: {detail: {selectedContent: ChoiceToDisplay | undefined}}) {
    selectedContentToEdit = changedSelectedContentEvent.detail.selectedContent;
  }

  function modifyChain(chainFileAbsolutePath:string, chain: Chain, modificationEvent: {detail:{type: string, id: any, content: string}}):void{
    switch (modificationEvent.detail.type) {
      case 'updateChoice': editChoice(chainFileAbsolutePath, chain, modificationEvent.detail.id, modificationEvent.detail.content).then(v => onChainSelectionChange(chainFileAbsolutePath));
      break;
      default: throw Error();
    }
  }

  let currentChainsDirectory: Promise<string> = getCurrentChainsDirectory();
  let chainPromise: Promise<{chain:Chain, chainFileAbsolutePath: string}> | undefined = undefined;

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
    <ChainFlowViewer chain={chain.chain} selectedContent={selectedContentToEdit} on:change={changeSelectedContent} />
    {#if selectedContentToEdit !== undefined}
      <AdminSidebar selectedContentToEdit={selectedContentToEdit} on:save={e => modifyChain(chain.chainFileAbsolutePath, chain.chain, e)}/>
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
