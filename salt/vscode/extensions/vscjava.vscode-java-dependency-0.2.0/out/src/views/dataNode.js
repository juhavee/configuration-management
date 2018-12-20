"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const telemetry_1 = require("../telemetry");
const explorerNode_1 = require("./explorerNode");
class DataNode extends explorerNode_1.ExplorerNode {
    constructor(_nodeData, parent) {
        super(parent);
        this._nodeData = _nodeData;
    }
    getTreeItem() {
        if (this._nodeData) {
            const item = new vscode_1.TreeItem(this._nodeData.name, this.hasChildren() ? vscode_1.TreeItemCollapsibleState.Collapsed : vscode_1.TreeItemCollapsibleState.None);
            item.iconPath = this.iconPath;
            item.command = this.command;
            return item;
        }
    }
    get nodeData() {
        return this._nodeData;
    }
    get uri() {
        return this._nodeData.uri;
    }
    get path() {
        return this._nodeData.path;
    }
    getChildren() {
        if (!this._nodeData.children) {
            return this.loadData().then((res) => {
                if (!res) {
                    telemetry_1.Telemetry.sendEvent("load data get undefined result", { node_kind: this._nodeData.kind.toString() });
                }
                this._nodeData.children = res;
                return this.createChildNodeList();
            });
        }
        return this.createChildNodeList();
    }
    sort() {
        this.nodeData.children.sort((a, b) => {
            if (a.kind === b.kind) {
                return a.name < b.name ? -1 : 1;
            }
            else {
                return a.kind - b.kind;
            }
        });
    }
    hasChildren() {
        return true;
    }
}
exports.DataNode = DataNode;
//# sourceMappingURL=dataNode.js.map