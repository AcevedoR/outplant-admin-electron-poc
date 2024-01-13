
import App from './App.svelte';
declare module '@fortawesome/free-solid-svg-icons/index.es' {
  export * from '@fortawesome/free-solid-svg-icons';
}
const app = new App({
  target: document.getElementById('app'),
});
export default app;
