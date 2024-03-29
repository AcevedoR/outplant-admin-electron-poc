<script lang="ts">

  let buttonProps = {
    class: [$$restProps.class],
  };
</script>
<button on:click>
  <slot />
</button>

<style>
  button {
    display: inline-block;
    padding: 10px 20px;
    margin: 10px;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
    border: 2px solid black;
    background-color: rgba(213, 193, 145, 0.65);
  }

  button:hover {
    background-color: #deab36;
    color: #fff;
  }
</style>
