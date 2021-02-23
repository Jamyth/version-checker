#!/usr/bin/env node
import { VersionChecker } from "./VersionChecker";
import yargs from "yargs";

interface Arguments {
  directory: string;
}

class VersionCheckerCLI {
  static init() {
    this.commands(yargs);
    return yargs;
  }

  private static commands(yargs: yargs.Argv) {
    yargs.command([""], false, () => {}, this.run);
  }

  private static run(args: yargs.Arguments<Arguments>) {
    const { directory } = args;
    new VersionChecker({
      projectDirectory: directory,
    }).run();
  }
}

const cli = VersionCheckerCLI.init();

cli.argv;
