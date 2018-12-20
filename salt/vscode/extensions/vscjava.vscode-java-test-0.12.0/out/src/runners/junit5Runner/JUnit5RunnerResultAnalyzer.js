"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRunnerResultAnalyzer_1 = require("../baseRunner/BaseRunnerResultAnalyzer");
const models_1 = require("../models");
const TEST_START = 'testStarted';
const TEST_IGNORED = 'testIgnored';
const TEST_FINISH = 'testFinished';
class JUnit5RunnerResultAnalyzer extends BaseRunnerResultAnalyzer_1.BaseRunnerResultAnalyzer {
    processData(data) {
        const outputData = JSON.parse(data);
        if (outputData.attributes.type !== JUnit5TestType.Test) {
            return;
        }
        const res = this.testResults.get(this.parseFullyQualifiedNameFromId(outputData.attributes.id));
        switch (outputData.name) {
            case TEST_START:
                if (!res) {
                    this.testResults.set(this.parseFullyQualifiedNameFromId(outputData.attributes.id), {
                        status: undefined,
                    });
                }
                break;
            case TEST_IGNORED:
                this.testResults.set(this.parseFullyQualifiedNameFromId(outputData.attributes.id), {
                    status: models_1.TestStatus.Skip,
                    details: this.decodeContent(outputData.attributes.details),
                });
                break;
            case TEST_FINISH:
                // Do not update result if already has a failed result for current test - For @ParameterizedTest
                if (!res || res.status === models_1.TestStatus.Fail) {
                    return;
                }
                res.status = this.parseTestStatus(outputData.attributes.status);
                res.details = this.decodeContent(outputData.attributes.details);
                res.duration = outputData.attributes.duration;
                break;
        }
    }
    parseFullyQualifiedNameFromId(id) {
        if (!id) {
            return id;
        }
        const regex = /\[class:(.*?)\]\/\[(?:method|test-template):(.*)\]/gm;
        const match = regex.exec(id);
        if (match && match.length === 3) {
            let methodName = match[2];
            const index = methodName.indexOf('(');
            if (index >= 0) {
                methodName = methodName.substring(0, index);
            }
            return `${match[1]}#${methodName}`;
        }
        return '';
    }
    parseTestStatus(status) {
        switch (status) {
            case JUnit5TestStatus.Failed:
                return models_1.TestStatus.Fail;
            case JUnit5TestStatus.Successful:
                return models_1.TestStatus.Pass;
            case JUnit5TestStatus.Aborted:
                return models_1.TestStatus.Skip;
        }
    }
}
exports.JUnit5RunnerResultAnalyzer = JUnit5RunnerResultAnalyzer;
var JUnit5TestType;
(function (JUnit5TestType) {
    JUnit5TestType["Test"] = "TEST";
    JUnit5TestType["Container"] = "CONTAINER";
})(JUnit5TestType || (JUnit5TestType = {}));
var JUnit5TestStatus;
(function (JUnit5TestStatus) {
    JUnit5TestStatus["Failed"] = "FAILED";
    JUnit5TestStatus["Successful"] = "SUCCESSFUL";
    JUnit5TestStatus["Aborted"] = "ABORTED";
})(JUnit5TestStatus || (JUnit5TestStatus = {}));
//# sourceMappingURL=JUnit5RunnerResultAnalyzer.js.map