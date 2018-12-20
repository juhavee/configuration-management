"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const protocols_1 = require("../../protocols");
const BaseRunner_1 = require("../baseRunner/BaseRunner");
const JUnit5RunnerResultAnalyzer_1 = require("./JUnit5RunnerResultAnalyzer");
class JUnit5Runner extends BaseRunner_1.BaseRunner {
    constructCommandParams() {
        return [...super.constructCommandParams(), 'junit5', ...this.constructParamsForTests()];
    }
    getTestResultAnalyzer() {
        return new JUnit5RunnerResultAnalyzer_1.JUnit5RunnerResultAnalyzer(this.tests);
    }
    constructParamsForTests() {
        const params = [];
        for (const test of this.tests) {
            if (test.level === protocols_1.TestLevel.Class || test.level === protocols_1.TestLevel.NestedClass) {
                params.push('-c', test.fullName);
            }
            else if (test.level === protocols_1.TestLevel.Method) {
                params.push('-m', test.fullName);
            }
        }
        return params;
    }
}
exports.JUnit5Runner = JUnit5Runner;
//# sourceMappingURL=JUnit5Runner.js.map