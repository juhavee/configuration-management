"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const commands_1 = require("./constants/commands");
const models_1 = require("./runners/models");
class TestStatusBarProvider {
    constructor() {
        this.statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left, Number.MIN_VALUE);
        this.commandCache = new Map();
    }
    show() {
        this.statusBarItem.show();
    }
    showRunningTest() {
        this.update('$(sync~spin) Running tests...', 'View test output', commands_1.JavaTestRunnerCommands.SHOW_TEST_OUTPUT);
    }
    showFailure() {
        this.update('$(issue-opened) Failed to run tests', 'View test output', commands_1.JavaTestRunnerCommands.SHOW_TEST_OUTPUT);
    }
    showTestResult(results) {
        if (results.length === 0) {
            this.statusBarItem.hide();
            return;
        }
        let failedNum = 0;
        let passedNum = 0;
        for (const result of results) {
            if (result.result.status === models_1.TestStatus.Fail) {
                failedNum++;
            }
            else if (result.result.status === models_1.TestStatus.Pass) {
                passedNum++;
            }
        }
        this.update(`$(x) ${failedNum} $(check) ${passedNum}`, 'View test report', this.getCommandWithArgs(commands_1.JavaTestRunnerCommands.SHOW_TEST_REPORT, [results]));
    }
    update(text, tooltip, command, args) {
        this.statusBarItem.text = text;
        this.statusBarItem.tooltip = tooltip;
        this.statusBarItem.command = this.getCommandWithArgs(command, args);
        this.statusBarItem.show();
    }
    dispose() {
        this.statusBarItem.dispose();
        for (const disposable of this.commandCache.values()) {
            disposable.dispose();
        }
        this.commandCache.clear();
    }
    getCommandWithArgs(command, args) {
        if (!args) {
            return command;
        }
        const commandWithArgs = `${command}-args`;
        const registeredCommand = this.commandCache.get(commandWithArgs);
        if (registeredCommand) {
            registeredCommand.dispose();
        }
        this.commandCache.set(commandWithArgs, vscode_1.commands.registerCommand(commandWithArgs, () => {
            vscode_1.commands.executeCommand(command, ...args);
        }));
        return commandWithArgs;
    }
}
exports.testStatusBarProvider = new TestStatusBarProvider();
//# sourceMappingURL=testStatusBarProvider.js.map