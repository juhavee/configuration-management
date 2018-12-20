"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const containerNodeData_1 = require("../java/containerNodeData");
const jdtls_1 = require("../java/jdtls");
const nodeData_1 = require("../java/nodeData");
const telemetry_1 = require("../telemetry");
const containerNode_1 = require("./containerNode");
const dataNode_1 = require("./dataNode");
const explorerNode_1 = require("./explorerNode");
const packageRootNode_1 = require("./packageRootNode");
class ProjectNode extends dataNode_1.DataNode {
    constructor(nodeData, parent) {
        super(nodeData, parent);
    }
    loadData() {
        let result = [];
        return jdtls_1.Jdtls.getPackageData({ kind: nodeData_1.NodeKind.Project, projectUri: this.nodeData.uri }).then((res) => {
            if (!res) {
                telemetry_1.Telemetry.sendEvent("get children of project node return undefined");
            }
            const sourceContainer = [];
            res.forEach((node) => {
                const containerNode = node;
                if (containerNode.entryKind === containerNodeData_1.ContainerEntryKind.CPE_SOURCE) {
                    sourceContainer.push(containerNode);
                }
                else {
                    result.push(node);
                }
            });
            if (sourceContainer.length > 0) {
                return Promise.all(sourceContainer.map((c) => jdtls_1.Jdtls.getPackageData({ kind: nodeData_1.NodeKind.Container, projectUri: this.uri, path: c.path })))
                    .then((rootPackages) => {
                    if (!rootPackages) {
                        telemetry_1.Telemetry.sendEvent("get children from container node return undefined");
                    }
                    result = result.concat(...rootPackages);
                    return result;
                });
            }
            else {
                return result;
            }
        });
    }
    createChildNodeList() {
        const result = [];
        if (this.nodeData.children && this.nodeData.children.length) {
            this.nodeData.children.forEach((data) => {
                if (data.kind === nodeData_1.NodeKind.Container) {
                    result.push(new containerNode_1.ContainerNode(data, this, this));
                }
                else if (data.kind === nodeData_1.NodeKind.PackageRoot) {
                    result.push(new packageRootNode_1.PackageRootNode(data, this, this));
                }
            });
        }
        result.sort((a, b) => {
            return b.nodeData.kind - a.nodeData.kind;
        });
        return result;
    }
    get iconPath() {
        return explorerNode_1.ExplorerNode.resolveIconPath("project");
    }
}
exports.ProjectNode = ProjectNode;
//# sourceMappingURL=projectNode.js.map