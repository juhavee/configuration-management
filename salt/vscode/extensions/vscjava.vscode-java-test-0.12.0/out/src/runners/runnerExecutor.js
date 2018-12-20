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
const cp = require("child_process");
const vscode_1 = require("vscode");
const codeLensProvider_1 = require("../codeLensProvider");
const configs_1 = require("../constants/configs");
const logger_1 = require("../logger/logger");
const protocols_1 = require("../protocols");
const testReportProvider_1 = require("../testReportProvider");
const testResultManager_1 = require("../testResultManager");
const testStatusBarProvider_1 = require("../testStatusBarProvider");
const cpUtils_1 = require("../utils/cpUtils");
const Junit4Runner_1 = require("./junit4Runner/Junit4Runner");
const JUnit5Runner_1 = require("./junit5Runner/JUnit5Runner");
const TestNGRunner_1 = require("./testngRunner/TestNGRunner");
class RunnerExecutor {
    initialize(javaHome, context) {
        this._javaHome = javaHome;
        this._context = context;
    }
    run(testItems, isDebug = false, config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isRunning) {
                vscode_1.window.showInformationMessage('A test session is currently running. Please wait until it finishes.');
                return;
            }
            if (testItems.length === 0) {
                logger_1.logger.info('No test items found.');
                return;
            }
            this._isRunning = true;
            testStatusBarProvider_1.testStatusBarProvider.showRunningTest();
            try {
                this._runnerMap = this.classifyTestsByKind(testItems);
                const finalResults = [];
                for (const [runner, tests] of this._runnerMap.entries()) {
                    if (config && config.preLaunchTask.length > 0) {
                        this._preLaunchTask = cp.exec(config.preLaunchTask, {
                            maxBuffer: configs_1.CHILD_PROCESS_MAX_BUFFER_SIZE,
                            cwd: config.workingDirectory,
                        });
                        yield this.execPreLaunchTask();
                    }
                    yield runner.setup(tests, isDebug, config);
                    const results = yield runner.run();
                    testResultManager_1.testResultManager.storeResult(...results);
                    finalResults.push(...results);
                }
                testStatusBarProvider_1.testStatusBarProvider.showTestResult(finalResults);
                codeLensProvider_1.testCodeLensProvider.refresh();
                testReportProvider_1.testReportProvider.update(finalResults);
            }
            catch (error) {
                vscode_1.window.showErrorMessage(`${error}`);
                testStatusBarProvider_1.testStatusBarProvider.showFailure();
            }
            finally {
                yield this.cleanUp(false);
            }
        });
    }
    cleanUp(isCancel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this._preLaunchTask) {
                    yield cpUtils_1.killProcess(this._preLaunchTask);
                    this._preLaunchTask = undefined;
                }
                const promises = [];
                if (this._runnerMap) {
                    for (const runner of this._runnerMap.keys()) {
                        promises.push(runner.cleanUp(isCancel));
                    }
                    this._runnerMap.clear();
                    this._runnerMap = undefined;
                }
                yield Promise.all(promises);
                if (isCancel) {
                    logger_1.logger.info('Test job is canceled.');
                }
            }
            catch (error) {
                logger_1.logger.error('Failed to clean up', error);
            }
            this._isRunning = false;
        });
    }
    classifyTestsByKind(tests) {
        const testMap = this.mapTestsByProjectAndKind(tests);
        return this.mapTestsByRunner(testMap);
    }
    mapTestsByProjectAndKind(tests) {
        const map = new Map();
        for (const test of tests) {
            if (!(test.kind in protocols_1.TestKind)) {
                logger_1.logger.error(`Unkonwn kind of test item: ${test.fullName}`);
                continue;
            }
            const key = test.project.concat(test.kind.toString());
            const testArray = map.get(key);
            if (testArray) {
                testArray.push(test);
            }
            else {
                map.set(key, [test]);
            }
        }
        return map;
    }
    mapTestsByRunner(testsPerProjectAndKind) {
        const map = new Map();
        for (const tests of testsPerProjectAndKind.values()) {
            const runner = this.getRunnerByKind(tests[0].kind);
            if (runner) {
                map.set(runner, tests);
            }
            else {
                vscode_1.window.showWarningMessage(`Cannot find matched runner to run the test: ${tests[0].kind}`);
            }
        }
        return map;
    }
    getRunnerByKind(kind) {
        switch (kind) {
            case protocols_1.TestKind.JUnit:
                return new Junit4Runner_1.JUnit4Runner(this._javaHome, this._context.storagePath, this._context.extensionPath);
            case protocols_1.TestKind.JUnit5:
                return new JUnit5Runner_1.JUnit5Runner(this._javaHome, this._context.storagePath, this._context.extensionPath);
            case protocols_1.TestKind.TestNG:
                return new TestNGRunner_1.TestNGRunner(this._javaHome, this._context.storagePath, this._context.extensionPath);
            default:
                return undefined;
        }
    }
    execPreLaunchTask() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (this._preLaunchTask) {
                    this._preLaunchTask.on('error', (err) => {
                        logger_1.logger.error('Failed to run pre-launch task', err);
                        reject(err);
                    });
                    this._preLaunchTask.stderr.on('data', (data) => {
                        logger_1.logger.info(data.toString());
                    });
                    this._preLaunchTask.stdout.on('data', (data) => {
                        logger_1.logger.info(data.toString());
                    });
                    this._preLaunchTask.on('close', (signal) => {
                        if (signal && signal !== 0) {
                            reject(new Error(`Prelaunch task exited with code ${signal}.`));
                        }
                        else {
                            resolve(signal);
                        }
                    });
                }
            });
        });
    }
}
exports.runnerExecutor = new RunnerExecutor();
//# sourceMappingURL=runnerExecutor.js.map