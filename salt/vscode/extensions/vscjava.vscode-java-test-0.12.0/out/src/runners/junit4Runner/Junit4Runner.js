"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRunner_1 = require("../baseRunner/BaseRunner");
const JUnit4RunnerResultAnalyzer_1 = require("./JUnit4RunnerResultAnalyzer");
class JUnit4Runner extends BaseRunner_1.BaseRunner {
    constructCommandParams() {
        return [...super.constructCommandParams(), 'junit', ...this.tests.map((t) => t.fullName)];
    }
    getTestResultAnalyzer() {
        return new JUnit4RunnerResultAnalyzer_1.JUnit4RunnerResultAnalyzer(this.tests);
    }
}
exports.JUnit4Runner = JUnit4Runner;
//# sourceMappingURL=Junit4Runner.js.map