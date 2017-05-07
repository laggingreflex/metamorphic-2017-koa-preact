
export const protect = (msg) => (ctx) => {
  if (!ctx.state.user) {
    ctx.status = 401;
    ctx.json = msg || 'Protected resource, use Authorization header to get access';
  }
}

