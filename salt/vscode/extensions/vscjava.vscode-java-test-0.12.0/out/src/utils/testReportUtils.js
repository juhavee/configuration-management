"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
function getReportPosition() {
    const config = vscode_1.workspace.getConfiguration();
    const position = config.get('java.test.report.position', 'sideView');
    return position === 'sideView' ? vscode_1.ViewColumn.Two : vscode_1.ViewColumn.Active;
}
exports.getReportPosition = getReportPosition;
var TestReportType;
(function (TestReportType) {
    TestReportType[TestReportType["All"] = 0] = "All";
    TestReportType[TestReportType["Passed"] = 1] = "Passed";
    TestReportType[TestReportType["Failed"] = 2] = "Failed";
})(TestReportType = exports.TestReportType || (exports.TestReportType = {}));
//# sourceMappingURL=testReportUtils.js.map