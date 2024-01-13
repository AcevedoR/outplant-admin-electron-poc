<script lang="ts">
  import ChainFlowViewer from '/@/ChainFlowViewer.svelte';

  let selectedContent: string | undefined;

  function changeSelectedContent(changedSelectedContentEvent) {
    console.debug(changedSelectedContentEvent);
    selectedContent = changedSelectedContentEvent.detail.selectedContent;
  }

</script>

<ChainFlowViewer {selectedContent} on:change={changeSelectedContent} />

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
