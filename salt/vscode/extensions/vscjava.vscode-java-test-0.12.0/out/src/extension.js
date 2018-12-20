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
const fse = require("fs-extra");
const os = require("os");
const path = require("path");
const vscode_1 = require("vscode");
const vscode_extension_telemetry_wrapper_1 = require("vscode-extension-telemetry-wrapper");
const codeLensProvider_1 = require("./codeLensProvider");
const executeTests_1 = require("./commands/executeTests");
const explorerCommands_1 = require("./commands/explorerCommands");
const logCommands_1 = require("./commands/logCommands");
const commands_1 = require("./constants/commands");
const explorerNodeManager_1 = require("./explorer/explorerNodeManager");
const testExplorer_1 = require("./explorer/testExplorer");
const logger_1 = require("./logger/logger");
const runnerExecutor_1 = require("./runners/runnerExecutor");
const testReportProvider_1 = require("./testReportProvider");
const testResultManager_1 = require("./testResultManager");
const testStatusBarProvider_1 = require("./testStatusBarProvider");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        yield vscode_extension_telemetry_wrapper_1.initializeFromJsonFile(context.asAbsolutePath('./package.json'));
        yield vscode_extension_telemetry_wrapper_1.instrumentOperation('activation', doActivate)(context);
    });
}
exports.activate = activate;
function deactivate() {
    return __awaiter(this, void 0, void 0, function* () {
        yield vscode_extension_telemetry_wrapper_1.dispose();
        yield runnerExecutor_1.runnerExecutor.cleanUp(false /* isCancel */);
    });
}
exports.deactivate = deactivate;
function doActivate(_operationId, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const javaHome = yield getJavaHome();
        if (!javaHome) {
            throw new Error('Could not find Java home.');
        }
        const watcher = vscode_1.workspace.createFileSystemWatcher('**/*.{[jJ][aA][vV][aA]}');
        watcher.onDidChange((uri) => {
            const node = explorerNodeManager_1.explorerNodeManager.getNode(uri.fsPath);
            if (node) {
                testExplorer_1.testExplorer.refresh(node);
            }
        });
        watcher.onDidDelete((uri) => {
            explorerNodeManager_1.explorerNodeManager.removeNode(uri.fsPath);
            testExplorer_1.testExplorer.refresh();
        });
        watcher.onDidCreate(() => {
            testExplorer_1.testExplorer.refresh();
        });
        testExplorer_1.testExplorer.initialize(context);
        runnerExecutor_1.runnerExecutor.initialize(javaHome, context);
        testReportProvider_1.testReportProvider.initialize(context);
        const storagePath = context.storagePath || path.join(os.tmpdir(), 'java_test_runner');
        yield fse.ensureDir(storagePath);
        logger_1.logger.initialize(storagePath);
        context.subscriptions.push(vscode_1.window.registerTreeDataProvider(testExplorer_1.testExplorer.testExplorerViewId, testExplorer_1.testExplorer), explorerNodeManager_1.explorerNodeManager, testStatusBarProvider_1.testStatusBarProvider, testResultManager_1.testResultManager, testReportProvider_1.testReportProvider, logger_1.logger, watcher, vscode_1.languages.registerCodeLensProvider({ scheme: 'file', language: 'java' }, codeLensProvider_1.testCodeLensProvider), instrumentAndRegisterCommand(commands_1.JavaTestRunnerCommands.OPEN_DOCUMENT_FOR_NODE, (node) => __awaiter(this, void 0, void 0, function* () { return yield explorerCommands_1.openTextDocumentForNode(node); })), instrumentAndRegisterCommand(commands_1.JavaTestRunnerCommands.REFRESH_EXPLORER, (node) => testExplorer_1.testExplorer.refresh(node)), instrumentAndRegisterCommand(commands_1.JavaTestRunnerCommands.RUN_TEST_FROM_CODELENS, (tests) => __awaiter(this, void 0, void 0, function* () { return yield executeTests_1.runTests(tests); })), instrumentAndRegisterCommand(commands_1.JavaTestRunnerCommands.DEBUG_TEST_FROM_CODELENS, (tests) => __awaiter(this, void 0, void 0, function* () { return yield executeTests_1.debugTests(tests); })), instrumentAndRegisterCommand(commands_1.JavaTestRunnerCommands.RUN_TEST_FROM_EXPLORER, (node) => __awaiter(this, void 0, void 0, function* () { return yield explorerCommands_1.runTestsFromExplorer(node); })), instrumentAndRegisterCommand(commands_1.JavaTestRunnerCommands.DEBUG_TEST_FROM_EXPLORER, (node) => __awaiter(this, void 0, void 0, function* () { return yield explorerCommands_1.debugTestsFromExplorer(node); })), instrumentAndRegisterCommand(commands_1.JavaTestRunnerCommands.RUN_TEST_WITH_CONFIG_FROM_EXPLORER, (node) => __awaiter(this, void 0, void 0, function* () { return yield explorerCommands_1.runTestsWithConfigFromExplorer(node); })), instrumentAndRegisterCommand(commands_1.JavaTestRunnerCommands.DEBUG_TEST_WITH_CONFIG_FROM_EXPLORER, (node) => __awaiter(this, void 0, void 0, function* () { return yield explorerCommands_1.debugTestsWithFromExplorer(node); })), instrumentAndRegisterCommand(commands_1.JavaTestRunnerCommands.SHOW_TEST_REPORT, (tests) => __awaiter(this, void 0, void 0, function* () { return yield testReportProvider_1.testReportProvider.report(tests); })), instrumentAndRegisterCommand(commands_1.JavaTestRunnerCommands.SHOW_TEST_OUTPUT, () => logCommands_1.showOutputChannel()), instrumentAndRegisterCommand(commands_1.JavaTestRunnerCommands.OPEN_TEST_LOG, () => __awaiter(this, void 0, void 0, function* () { return yield logCommands_1.openLogFile(storagePath); })), instrumentAndRegisterCommand(commands_1.JavaTestRunnerCommands.JAVA_TEST_CANCEL, () => __awaiter(this, void 0, void 0, function* () { return yield runnerExecutor_1.runnerExecutor.cleanUp(true /* isCancel */); })));
        yield vscode_1.commands.executeCommand('setContext', 'java.test.activated', true);
    });
}
function instrumentAndRegisterCommand(name, cb) {
    const instrumented = vscode_extension_telemetry_wrapper_1.instrumentOperation(name, (_operationId, ...args) => __awaiter(this, void 0, void 0, function* () { return yield cb(...args); }));
    return vscode_1.commands.registerCommand(name, instrumented);
}
function getJavaHome() {
    return __awaiter(this, void 0, void 0, function* () {
        const extension = vscode_1.extensions.getExtension('redhat.java');
        try {
            const extensionApi = yield extension.activate();
            if (extensionApi && extensionApi.javaRequirement) {
                return extensionApi.javaRequirement.java_home;
            }
        }
        catch (error) {
            // Swallow the error
        }
        return '';
    });
}
//# sourceMappingURL=extension.js.map