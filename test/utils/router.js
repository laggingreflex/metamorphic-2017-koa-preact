export default () => {
  const routes = {}
  const mockRoute = (path, fn) => {
    routes[path] = fn;
  }
  return { get: mockRoute, post: mockRoute, routes: () => routes };
}
