"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const baseSymbolNode_1 = require("./baseSymbolNode");
class SymbolNode extends baseSymbolNode_1.BaseSymbolNode {
    constructor(symbolInfo, parent) {
        super(symbolInfo, parent);
    }
    getChildren() {
        const res = [];
        if (this._children && this._children.length) {
            this._children.forEach((child) => {
                res.push(new SymbolNode(child, this.getParent()));
            });
        }
        return res;
    }
    getTreeItem() {
        if (this.symbolInfo) {
            const parentData = this.getParent().nodeData;
            if (parentData && parentData.symbolTree) {
                this._children = parentData.symbolTree.get(this.symbolInfo.name);
            }
            const item = new vscode_1.TreeItem(this.symbolInfo.name, (this._children && this._children.length) ? vscode_1.TreeItemCollapsibleState.Collapsed : vscode_1.TreeItemCollapsibleState.None);
            item.iconPath = this.iconPath;
            item.command = this.command;
            return item;
        }
    }
    get range() {
        return this.symbolInfo.location.range;
    }
}
exports.SymbolNode = SymbolNode;
//# sourceMappingURL=symbolNode.js.map