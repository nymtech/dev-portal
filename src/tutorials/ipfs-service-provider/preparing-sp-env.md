# Preparing Your Service Provider Environment

Before we get into modifying our Service Provider code, w'ell need to amend a few things in our applications configuration. Ensure you are now working in the `service-provider` directory of the project.

## Modifying our `package.json`.
```json
{
  "name": "service-provider",
  "version": "1.0.0",
  "description": "",
  "type": "module", <-- Insert Line
  "main": "index.js",
  "scripts": {
    "start:dev": "nodemon ts-node-esm src/index.ts", <-- Modify Line
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "devDependencies": {
    "@types/node": "^18.14.0",
    "@types/ws": "^8.5.4",
    "nodemon": "^2.0.20",
    "ts-node": "^10.9.1",
    "typescript": "^4.9.5"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "ipfs-core": "^0.16.0", <-- Insert Line
    "multiformats": "^9.6.5", <-- Insert Line
    "node-fetch": "^3.3.0", <-- Insert Line
    "ws": "^8.12.0"
  },
}

```

## Modifying our `tsconfig.json`.

Copy and paste the code below into your `tsconfig.json`. There are a number of line changes required inside this file to make it work with our `package.json` and it will be a-lot easier to just replace the file contents.

```json
{
  "compilerOptions": {
    "target": "ES6",
    "lib": [
      "es6"
    ],
    "module": "ES6",
    "rootDir": "src",
    "resolveJsonModule": true,
    "allowJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true, 
    "moduleResolution": "node",
    "strict": true,
    "noImplicitAny": true,
    "skipLibCheck": true,
    "noEmit": true,
  },
  "ts-node": {
    "esm": true
  },
  "include": [
    "src"
  ]
}
```

Lets ensure our new project dependencies are installed. Open a new terminal in our `service-provider` folder and run:

```
npm install
```

With our project environment set up, lets move onto modifying our service provider code in the next section.



