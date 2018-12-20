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
const path = require("path");
const pug = require("pug");
const vscode_1 = require("vscode");
const models_1 = require("./runners/models");
const testResultManager_1 = require("./testResultManager");
const testReportUtils_1 = require("./utils/testReportUtils");
class TestReportProvider {
    initialize(context) {
        this.context = context;
        this.compiledReportTemplate = pug.compileFile(this.context.asAbsolutePath(path.join('resources', 'templates', 'report.pug')));
    }
    report(tests) {
        return __awaiter(this, void 0, void 0, function* () {
            const position = testReportUtils_1.getReportPosition();
            if (!this.panel) {
                this.panel = vscode_1.window.createWebviewPanel('testRunnerReport', 'Java Test Report', position, {
                    localResourceRoots: [
                        vscode_1.Uri.file(path.join(this.context.extensionPath, 'resources', 'templates', 'css')),
                    ],
                    enableScripts: true,
                    retainContextWhenHidden: true,
                    enableFindWidget: true,
                });
                this.panel.onDidDispose(() => {
                    this.panel = undefined;
                }, null, this.context.subscriptions);
            }
            this.panel.webview.html = yield exports.testReportProvider.provideHtmlContent(tests);
            this.panel.reveal(position);
        });
    }
    update(tests) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.panel) {
                this.panel.webview.html = yield exports.testReportProvider.provideHtmlContent(tests);
            }
        });
    }
    provideHtmlContent(tests) {
        return __awaiter(this, void 0, void 0, function* () {
            const allResultsMap = new Map();
            const passedResultMap = new Map();
            const failedResultMap = new Map();
            let allCount = 0;
            let passedCount = 0;
            let failedCount = 0;
            let skippedCount = 0;
            for (const test of tests) {
                const result = testResultManager_1.testResultManager.getResult(vscode_1.Uri.parse(test.uri).fsPath, test.fullName);
                allCount++;
                if (result) {
                    this.putMethodResultIntoMap(allResultsMap, test, result);
                    switch (result.status) {
                        case models_1.TestStatus.Pass:
                            this.putMethodResultIntoMap(passedResultMap, test, result);
                            passedCount++;
                            break;
                        case models_1.TestStatus.Fail:
                            this.putMethodResultIntoMap(failedResultMap, test, result);
                            failedCount++;
                            break;
                        case models_1.TestStatus.Skip:
                            skippedCount++;
                            break;
                    }
                }
            }
            return this.compiledReportTemplate({
                tests: allResultsMap,
                passedTests: passedResultMap,
                failedTests: failedResultMap,
                allCount,
                passedCount,
                failedCount,
                skippedCount,
                cssFile: this.cssFileUri,
            });
        });
    }
    dispose() {
        if (this.panel) {
            this.panel.dispose();
        }
    }
    putMethodResultIntoMap(map, test, result) {
        const classFullName = test.fullName.substr(0, test.fullName.indexOf('#'));
        const methods = map.get(classFullName);
        if (methods) {
            methods.push({ displayName: test.displayName, result });
        }
        else {
            map.set(classFullName, [{ displayName: test.displayName, result }]);
        }
    }
    get cssFileUri() {
        const cssFilePath = this.context.asAbsolutePath(path.join('resources', 'templates', 'css', 'report.css'));
        return vscode_1.Uri.file(cssFilePath).with({ scheme: 'vscode-resource' }).toString();
    }
}
exports.testReportProvider = new TestReportProvider();
//# sourceMappingURL=testReportProvider.js.map