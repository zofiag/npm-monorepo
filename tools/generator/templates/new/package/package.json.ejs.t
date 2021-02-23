---
to: <%= absPath %>/package.json
---
{
  "name": "@namespace/<%= h.changeCase.paramCase(packageName) %>",
  "version": "1.0.0",
  "main": "lib/index.js",
  "private": true,
  "scripts": {
    "build": "tsc",
    "dev": "tsc -w --preserveWatchOutput",
    "test": "echo \"T.B.D.\""
  },
  "peerDependencies": {
    "typescript": "^4.0.0"
  }
}
