export default function getViewChain(view, chain = []) {
  chain.push(view);
  if (view.parent) {
    getViewChain(view.parent, chain);
  }
  return chain;
}
