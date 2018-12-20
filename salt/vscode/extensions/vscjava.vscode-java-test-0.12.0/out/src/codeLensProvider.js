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
const commands_1 = require("./constants/commands");
const logger_1 = require("./logger/logger");
const protocols_1 = require("./protocols");
const models_1 = require("./runners/models");
const testResultManager_1 = require("./testResultManager");
const commandUtils_1 = require("./utils/commandUtils");
const platformUtils_1 = require("./utils/platformUtils");
class TestCodeLensProvider {
    constructor() {
        this.onDidChangeCodeLensesEmitter = new vscode_1.EventEmitter();
    }
    get onDidChangeCodeLenses() {
        return this.onDidChangeCodeLensesEmitter.event;
    }
    refresh() {
        this.onDidChangeCodeLensesEmitter.fire();
    }
    provideCodeLenses(document, _token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const testClasses = yield commandUtils_1.searchTestCodeLens(document.uri.toString());
                const codeLenses = [];
                for (const testClass of testClasses) {
                    codeLenses.push(...this.getCodeLenses(testClass));
                }
                return codeLenses;
            }
            catch (error) {
                logger_1.logger.error('Failed to provide Code Lens', error);
                return [];
            }
        });
    }
    getCodeLenses(testClass) {
        const result = [];
        result.push(...this.parseCodeLenses(testClass));
        if (testClass.children) {
            for (const testMethod of testClass.children) {
                result.push(...this.parseCodeLenses(testMethod));
            }
        }
        return result;
    }
    parseCodeLenses(test) {
        const codeLenses = [];
        codeLenses.push(new vscode_1.CodeLens(test.range, {
            title: 'Run Test',
            command: commands_1.JavaTestRunnerCommands.RUN_TEST_FROM_CODELENS,
            tooltip: 'Run Test',
            arguments: [[test]],
        }), new vscode_1.CodeLens(test.range, {
            title: 'Debug Test',
            command: commands_1.JavaTestRunnerCommands.DEBUG_TEST_FROM_CODELENS,
            tooltip: 'Debug Test',
            arguments: [[test]],
        }));
        if (this.hasTestResult(test)) {
            codeLenses.push(this.parseCodeLensForTestResult(test));
        }
        return codeLenses;
    }
    hasTestResult(test) {
        if (test.level === protocols_1.TestLevel.Method) {
            return testResultManager_1.testResultManager.hasResultWithFsPathAndFullName(vscode_1.Uri.parse(test.uri).fsPath, test.fullName);
        }
        else if (test.level === protocols_1.TestLevel.Class || test.level === protocols_1.TestLevel.NestedClass) {
            return testResultManager_1.testResultManager.hasResultWithFsPath(vscode_1.Uri.parse(test.uri).fsPath);
        }
        return false;
    }
    parseCodeLensForTestResult(test) {
        const testMethods = [];
        if (test.level === protocols_1.TestLevel.Method) {
            testMethods.push(test);
        }
        else {
            // Get methods from class
            testMethods.push(...test.children);
        }
        return new vscode_1.CodeLens(test.range, {
            title: this.getTestStatusIcon(testMethods),
            command: commands_1.JavaTestRunnerCommands.SHOW_TEST_REPORT,
            tooltip: 'Show Report',
            arguments: [testMethods],
        });
    }
    getTestStatusIcon(testMethods) {
        for (const method of testMethods) {
            const testResult = testResultManager_1.testResultManager.getResult(vscode_1.Uri.parse(method.uri).fsPath, method.fullName);
            if (!testResult || testResult.status === models_1.TestStatus.Skip) {
                return '?';
            }
            else if (testResult.status === models_1.TestStatus.Fail) {
                return '❌';
            }
        }
        return platformUtils_1.isDarwin() ? '✅' : '✔️';
    }
}
exports.testCodeLensProvider = new TestCodeLensProvider();
//# sourceMappingURL=codeLensProvider.js.map