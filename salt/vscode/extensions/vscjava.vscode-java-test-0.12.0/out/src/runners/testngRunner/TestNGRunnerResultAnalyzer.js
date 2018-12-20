"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRunnerResultAnalyzer_1 = require("../baseRunner/BaseRunnerResultAnalyzer");
const models_1 = require("../models");
const TEST_START = 'testStarted';
const TEST_FAIL = 'testFailed';
const TEST_FINISH = 'testFinished';
class TestNGRunnerResultAnalyzer extends BaseRunnerResultAnalyzer_1.BaseRunnerResultAnalyzer {
    processData(data) {
        const outputData = JSON.parse(data);
        switch (outputData.name) {
            case TEST_START:
                this.testResults.set(outputData.attributes.name, {
                    status: undefined,
                });
                break;
            case TEST_FAIL:
                const failedResult = this.testResults.get(outputData.attributes.name);
                if (!failedResult) {
                    return;
                }
                failedResult.status = models_1.TestStatus.Fail;
                failedResult.message = this.decodeContent(outputData.attributes.message);
                failedResult.details = this.decodeContent(outputData.attributes.details);
                break;
            case TEST_FINISH:
                const finishedResult = this.testResults.get(outputData.attributes.name);
                if (!finishedResult) {
                    return;
                }
                if (!finishedResult.status) {
                    finishedResult.status = models_1.TestStatus.Pass;
                }
                finishedResult.duration = outputData.attributes.duration;
                break;
        }
    }
}
exports.TestNGRunnerResultAnalyzer = TestNGRunnerResultAnalyzer;
var TestNGOutputType;
(function (TestNGOutputType) {
    TestNGOutputType[TestNGOutputType["Info"] = 0] = "Info";
    TestNGOutputType[TestNGOutputType["Error"] = 1] = "Error";
})(TestNGOutputType || (TestNGOutputType = {}));
//# sourceMappingURL=TestNGRunnerResultAnalyzer.js.map