"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRunner_1 = require("../baseRunner/BaseRunner");
const TestNGRunnerResultAnalyzer_1 = require("./TestNGRunnerResultAnalyzer");
class TestNGRunner extends BaseRunner_1.BaseRunner {
    constructCommandParams() {
        return [...super.constructCommandParams(), 'testng', ...this.tests.map((t) => t.fullName)];
    }
    getTestResultAnalyzer() {
        return new TestNGRunnerResultAnalyzer_1.TestNGRunnerResultAnalyzer(this.tests);
    }
}
exports.TestNGRunner = TestNGRunner;
//# sourceMappingURL=TestNGRunner.js.map