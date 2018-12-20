"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
var TestLevel;
(function (TestLevel) {
    TestLevel[TestLevel["Root"] = 0] = "Root";
    TestLevel[TestLevel["Folder"] = 1] = "Folder";
    TestLevel[TestLevel["Package"] = 2] = "Package";
    TestLevel[TestLevel["Class"] = 3] = "Class";
    TestLevel[TestLevel["NestedClass"] = 4] = "NestedClass";
    TestLevel[TestLevel["Method"] = 5] = "Method";
})(TestLevel = exports.TestLevel || (exports.TestLevel = {}));
var TestKind;
(function (TestKind) {
    TestKind[TestKind["JUnit"] = 0] = "JUnit";
    TestKind[TestKind["JUnit5"] = 1] = "JUnit5";
    TestKind[TestKind["TestNG"] = 2] = "TestNG";
})(TestKind = exports.TestKind || (exports.TestKind = {}));
//# sourceMappingURL=protocols.js.map