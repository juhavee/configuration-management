"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const protocols_1 = require("../protocols");
class TestTreeNode {
    constructor(_name, _fullName, _level, _fsPath, _range, _children) {
        this._name = _name;
        this._fullName = _fullName;
        this._level = _level;
        this._fsPath = _fsPath;
        this._range = _range;
        this._children = _children;
    }
    get name() {
        return this._name;
    }
    get fullName() {
        return this._fullName;
    }
    get fsPath() {
        return this._fsPath;
    }
    get range() {
        return this._range;
    }
    get isMethod() {
        return this.level === protocols_1.TestLevel.Method;
    }
    get level() {
        return this._level;
    }
    get children() {
        return this._children;
    }
    set children(children) {
        this._children = children;
    }
}
exports.TestTreeNode = TestTreeNode;
//# sourceMappingURL=TestTreeNode.js.map