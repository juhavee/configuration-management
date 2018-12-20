"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class TestResultManager {
    constructor() {
        this.testResultMap = new Map();
    }
    storeResult(...results) {
        for (const result of results) {
            const fsPath = vscode_1.Uri.parse(result.uri).fsPath;
            if (!this.testResultMap.has(fsPath)) {
                this.testResultMap.set(fsPath, {
                    methodsMap: new Map(),
                    isDirty: false,
                });
            }
            this.testResultMap.get(fsPath).methodsMap.set(result.fullName, result.result);
        }
    }
    getResult(fsPath, testFullName) {
        const resultsInFsPath = this.testResultMap.get(fsPath);
        if (resultsInFsPath) {
            return resultsInFsPath.methodsMap.get(testFullName);
        }
        return undefined;
    }
    hasResultWithFsPath(fsPath) {
        return this.testResultMap.has(fsPath);
    }
    hasResultWithFsPathAndFullName(fsPath, testFullName) {
        return !!this.getResult(fsPath, testFullName);
    }
    dispose() {
        this.testResultMap.clear();
    }
}
exports.testResultManager = new TestResultManager();
//# sourceMappingURL=testResultManager.js.map