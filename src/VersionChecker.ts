import { TaskRunner } from "./util/TaskRunner";
import semver from "semver";
import fs from "fs";

interface VersionCheckerOptions {
  projectDirectory: string;
  skipLibs?: string[];
  onSuccess?: () => void;
}

/**
 * Start NPM Packages version checker, before starting Webpack Dev Server
 *
 * Constructor arguments:
 * - `projectDirectory`: project root folder contains package.json
 *  ```
 *  root/
 *  └── package.json
 *  ```
 *
 * - `skipLibs`: skip version checking if the array contains the package, Basically for monorepos
 *
 *  This Version checker currently only check exact match, symbols like ^1.0.0 will consider not match
 *  It is okay for our own projects (we use exact versioning)
 */
export class VersionChecker {
  private readonly projectDirectory: string;
  private readonly skipLibs: string[];
  private readonly onSuccess: () => void;
  private packages: Record<string, string> = {};

  constructor({
    projectDirectory,
    skipLibs,
    onSuccess,
  }: VersionCheckerOptions) {
    this.projectDirectory = projectDirectory;
    this.skipLibs = skipLibs ?? [];
    this.onSuccess = onSuccess ?? (() => {});
  }

  run() {
    new TaskRunner("VersionChecker").execute([
      {
        name: "Check and resolve package.json",
        execute: () => {
          const packageJsonPath = this.projectDirectory + "/package.json";
          if (!fs.existsSync(packageJsonPath)) {
            throw new Error(
              `package.json does not exist in ${this.projectDirectory}`
            );
          }

          const json = require(packageJsonPath);
          const packages = {
            ...json.devDependencies,
            ...json.dependencies,
          };
          this.skipLibs.forEach((packageName) => {
            delete packages[packageName];
          });
          this.packages = packages;
        },
      },
      {
        name: "Validate Package Versions in node_modules",
        execute: () => {
          Object.entries(this.packages).map(
            ([packageName, expectedVersion]) => {
              const packagePath = require.resolve(
                `${packageName}/package.json`,
                {
                  paths: [this.projectDirectory],
                }
              );
              const packageJson = require(packagePath);
              const installedVersion = packageJson.version;
              if (semver.lt(installedVersion, expectedVersion)) {
                throw new Error(
                  `[${packageName}] version not match, expected: ${expectedVersion}, installed: ${installedVersion}`
                );
              }
            }
          );
          this.onSuccess();
        },
      },
    ]);
  }
}
