"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const jdtls_1 = require("../java/jdtls");
const services_1 = require("../services");
const dataNode_1 = require("./dataNode");
const projectNode_1 = require("./projectNode");
class WorkspaceNode extends dataNode_1.DataNode {
    constructor(nodeData, parent) {
        super(nodeData, parent);
    }
    loadData() {
        return jdtls_1.Jdtls.getProjects(this.nodeData.uri);
    }
    createChildNodeList() {
        const result = [];
        if (this.nodeData.children && this.nodeData.children.length) {
            this.nodeData.children.forEach((nodeData) => {
                result.push(new projectNode_1.ProjectNode(nodeData, this));
            });
        }
        return result;
    }
    get iconPath() {
        return services_1.Services.context.asAbsolutePath("./images/root-folder.svg");
    }
}
exports.WorkspaceNode = WorkspaceNode;
//# sourceMappingURL=workspaceNode.js.map