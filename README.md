# **Node Version Checker**

This package aims to provide a consistent version checking service while performing particular tasks.

While you are doing your tasks/ feature, you may sometimes having troubles from other features that might not be your problem, just like API changes in some of the packages, or one of your teammates pushed a buggy commit.

Maybe one of your teammates updates some of the packages that have big changes, your package.json updated but you have not install the correct version on your local machine.

This package come to rescue, you can add the checker wherever you want:

- build
- start
- etc.

## When will you need this package ?

- Working as a Team
- Some of your installed packages update frequently
- you name it. XD

## Installation

```bash
> yarn add node-version-checker
// or
> npm install node-version-checker
```

## Usage

This package provides two ways to use.

Use JS/TS script

```typescript
import { VersionChecker } from "node-version-checker";
import path from "path";

new VersionChecker({
  // Required
  projectDirectory: path.join(__dirname, "path to you root directory"),
  // Optional
  onSuccess: () => {
    // Some logic after the versions are all correct
  },
  skipLibs: [
    "package that you do not want to check the version, (some legacy package)",
  ],
});
```

or use in command line

```json
{
  "scripts": {
    "start": "node-version-checker directory='./' && some-start-scripts"
  }
}
```
