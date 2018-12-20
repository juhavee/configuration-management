"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const logger_1 = require("../../logger/logger");
const protocols_1 = require("../../protocols");
const models_1 = require("../models");
class BaseRunnerResultAnalyzer {
    constructor(tests) {
        this.tests = tests;
        this.testResults = new Map();
        this.regex = /@@<TestRunner-({[\s\S]*?})-TestRunner>/gm;
    }
    analyzeData(data) {
        logger_1.logger.info(data);
        let match;
        do {
            match = this.regex.exec(data);
            if (match) {
                try {
                    this.processData(match[1]);
                }
                catch (error) {
                    logger_1.logger.error(`Failed to parse output data: ${data}`, error);
                }
            }
        } while (match);
    }
    analyzeError(error) {
        logger_1.logger.info(error);
    }
    feedBack() {
        const result = [];
        for (const test of this.tests) {
            this.processTestItemRecursively(test, result);
        }
        return result;
    }
    processTestItemRecursively(testItem, resultList) {
        if (testItem.level === protocols_1.TestLevel.Method) {
            resultList.push(this.processMethod(testItem));
        }
        else {
            testItem.children.forEach((child) => this.processTestItemRecursively(child, resultList));
        }
    }
    processMethod(test) {
        let testResultDetails = this.testResults.get(test.fullName);
        if (!testResultDetails) {
            testResultDetails = { status: models_1.TestStatus.Skip };
        }
        return {
            displayName: test.displayName,
            fullName: test.fullName,
            uri: vscode_1.Uri.parse(test.uri).toString(),
            result: testResultDetails,
        };
    }
    decodeContent(content) {
        if (!content) {
            return content;
        }
        return content.replace(new RegExp('&#x40;', 'gm'), '@');
    }
    get outputRegex() {
        return this.regex;
    }
}
exports.BaseRunnerResultAnalyzer = BaseRunnerResultAnalyzer;
//# sourceMappingURL=BaseRunnerResultAnalyzer.js.map