"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const jdtls_1 = require("../java/jdtls");
const nodeData_1 = require("../java/nodeData");
const dataNode_1 = require("./dataNode");
const explorerNode_1 = require("./explorerNode");
const packageRootNode_1 = require("./packageRootNode");
class ContainerNode extends dataNode_1.DataNode {
    constructor(nodeData, parent, _project) {
        super(nodeData, parent);
        this._project = _project;
    }
    loadData() {
        return jdtls_1.Jdtls.getPackageData({ kind: nodeData_1.NodeKind.Container, projectUri: this._project.uri, path: this.path });
    }
    createChildNodeList() {
        const result = [];
        if (this.nodeData.children && this.nodeData.children.length) {
            this.sort();
            this.nodeData.children.forEach((classpathNode) => {
                result.push(new packageRootNode_1.PackageRootNode(classpathNode, this, this._project));
            });
        }
        return result;
    }
    get iconPath() {
        return explorerNode_1.ExplorerNode.resolveIconPath("library");
    }
}
exports.ContainerNode = ContainerNode;
//# sourceMappingURL=containerNode.js.map