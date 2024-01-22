<script lang="ts">
  import {getChainsFilenames} from '/@/lib/ElectronAPIUtils';

  export let currentChainsDirectory: string;
  let chainsFilenamesPromise = getChainsFilenames(currentChainsDirectory)
    .then(chains => {
      // display first Chain at initial load
      if (chains && chains.length > 0) {
          chainFileSelection = chains[0];
          onSelectChange();
          return chains;
        }
      },
    );
  let chainFileSelection: string;

  export let onChainSelectionChange: (chainsFileSelection: string) => void;
  const onSelectChange = (): void => {
    onChainSelectionChange(`${currentChainsDirectory}/${chainFileSelection}`);
  };
</script>

<div id="chains-file-selection">

  <div id="current-directory">
    {currentChainsDirectory}/
  </div>

  {#await chainsFilenamesPromise}
    Getting your Chains directory filenames
  {:then chainsFilenames}
    <select bind:value={chainFileSelection} on:change={onSelectChange}>
      {#each chainsFilenames as chainFilename}
        <option value={chainFilename}>{chainFilename}</option>
      {/each}
    </select>
  {:catch someError}
    System error: {someError.message}.
  {/await}
</div>
<style>
    :global(#chains-file-selection) {
        position: absolute;
        margin: 10px;
        z-index: 3;
        background-color: rgb(239, 239, 239);
        display: flex;
        padding: 2px;
    }

    :global(#chains-file-selection #current-directory) {
        margin: 0 0 0 10px;
    }

    :global(#chains-file-selection select) {
        margin: 0 10px;
    }
</style>
