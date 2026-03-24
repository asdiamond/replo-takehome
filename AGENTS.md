<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# instructions for this repo

for frontend state we use react-query. 

here is how calls to our backend are structured: 
- feature/ // a top level feature folder
- feature/api.ts // the fetch calls to the backend
- feature/hooks.ts // the react query hooks, using api.ts 
- feature/types.ts // the shared types between api.ts and hooks.ts, also exposed to components
