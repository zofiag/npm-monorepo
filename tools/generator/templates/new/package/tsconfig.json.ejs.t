---
to: <%= absPath %>/tsconfig.json
---
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "lib"
  },
  "include": [
    "./src"
  ],
}