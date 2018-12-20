"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const jdtls_1 = require("../java/jdtls");
const nodeData_1 = require("../java/nodeData");
const packageRootNodeData_1 = require("../java/packageRootNodeData");
const dataNode_1 = require("./dataNode");
const explorerNode_1 = require("./explorerNode");
const fileNode_1 = require("./fileNode");
const folderNode_1 = require("./folderNode");
const packageNode_1 = require("./packageNode");
const typeRootNode_1 = require("./typeRootNode");
class PackageRootNode extends dataNode_1.DataNode {
    constructor(nodeData, parent, _project) {
        super(nodeData, parent);
        this._project = _project;
    }
    loadData() {
        return jdtls_1.Jdtls.getPackageData({ kind: nodeData_1.NodeKind.PackageRoot, projectUri: this._project.nodeData.uri, rootPath: this.nodeData.path });
    }
    createChildNodeList() {
        const result = [];
        if (this.nodeData.children && this.nodeData.children.length) {
            this.sort();
            this.nodeData.children.forEach((data) => {
                if (data.kind === nodeData_1.NodeKind.Package) {
                    result.push(new packageNode_1.PackageNode(data, this, this._project, this));
                }
                else if (data.kind === nodeData_1.NodeKind.File) {
                    result.push(new fileNode_1.FileNode(data, this));
                }
                else if (data.kind === nodeData_1.NodeKind.Folder) {
                    result.push(new folderNode_1.FolderNode(data, this, this._project, this));
                }
                else if (data.kind === nodeData_1.NodeKind.TypeRoot) {
                    result.push(new typeRootNode_1.TypeRootNode(data, this));
                }
            });
        }
        return result;
    }
    get iconPath() {
        const data = this.nodeData;
        if (data.entryKind === packageRootNodeData_1.PackageRootKind.K_BINARY) {
            return explorerNode_1.ExplorerNode.resolveIconPath("jar");
        }
        else {
            return explorerNode_1.ExplorerNode.resolveIconPath("packagefolder");
        }
    }
}
exports.PackageRootNode = PackageRootNode;
//# sourceMappingURL=packageRootNode.js.map