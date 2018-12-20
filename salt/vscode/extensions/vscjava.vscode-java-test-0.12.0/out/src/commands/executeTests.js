"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const commands_1 = require("../constants/commands");
const runnerExecutor_1 = require("../runners/runnerExecutor");
const testConfigManager_1 = require("../testConfigManager");
function runTests(tests) {
    return __awaiter(this, void 0, void 0, function* () {
        return vscode_1.window.withProgress({ location: vscode_1.ProgressLocation.Notification, cancellable: true }, (progress, token) => {
            return executeTests(tests, false /* isDebug */, true /* isDefaultConfig */, progress, token);
        });
    });
}
exports.runTests = runTests;
function debugTests(tests) {
    return __awaiter(this, void 0, void 0, function* () {
        return vscode_1.window.withProgress({ location: vscode_1.ProgressLocation.Notification, cancellable: true }, (progress, token) => {
            return executeTests(tests, true /* isDebug */, true /* isDefaultConfig */, progress, token);
        });
    });
}
exports.debugTests = debugTests;
function executeTests(tests, isDebug, isDefaultConfig, progress, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = yield getTestConfig(tests, isDebug, isDefaultConfig);
        token.onCancellationRequested(() => {
            vscode_1.commands.executeCommand(commands_1.JavaTestRunnerCommands.JAVA_TEST_CANCEL);
        });
        progress.report({ message: 'Running tests...' });
        return runnerExecutor_1.runnerExecutor.run(tests, isDebug, config);
    });
}
exports.executeTests = executeTests;
function getTestConfig(tests, isDebug, isDefaultConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const configGroups = yield testConfigManager_1.testConfigManager.loadRunConfig(tests, isDebug);
        if (isDefaultConfig) {
            if (configGroups.length !== 1 || !configGroups[0].default) {
                return undefined;
            }
            const runConfig = configGroups[0];
            const candidates = runConfig.items.filter((item) => item.name === runConfig.default);
            if (candidates.length === 0) {
                vscode_1.window.showWarningMessage(`There is no config with name: ${runConfig.default}.`);
                return undefined;
            }
            if (candidates.length > 1) {
                vscode_1.window.showWarningMessage(`Duplicate configs with default name: ${runConfig.default}.`);
            }
            return candidates[0];
        }
        if (configGroups.length > 1) {
            vscode_1.window.showWarningMessage('It is not supported to run tests with config from multi root.');
        }
        const configItems = [];
        for (const config of configGroups) {
            configItems.push(...config.items);
        }
        const choices = [];
        for (const configItem of configItems) {
            choices.push({
                label: configItem.name,
                description: `Project name: ${configItem.projectName}`,
                item: configItem,
            });
        }
        const selection = yield vscode_1.window.showQuickPick(choices, { placeHolder: 'Select test config' });
        if (!selection) {
            throw new Error('Please specify the test config to use!');
        }
        return selection.item;
    });
}
//# sourceMappingURL=executeTests.js.map