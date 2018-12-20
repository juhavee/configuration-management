"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const vscode_extension_telemetry_wrapper_1 = require("vscode-extension-telemetry-wrapper");
const commands_1 = require("../commands");
const jdtls_1 = require("../java/jdtls");
const nodeData_1 = require("../java/nodeData");
const telemetry_1 = require("../telemetry");
const projectNode_1 = require("./projectNode");
const workspaceNode_1 = require("./workspaceNode");
class DependencyDataProvider {
    constructor(context) {
        this.context = context;
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        // tslint:disable-next-line:member-ordering
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this._rootItems = null;
        context.subscriptions.push(vscode_1.commands.registerCommand(commands_1.Commands.VIEW_PACKAGE_REFRESH, vscode_extension_telemetry_wrapper_1.instrumentOperation(commands_1.Commands.VIEW_PACKAGE_REFRESH, () => this.refresh())));
        context.subscriptions.push(vscode_1.commands.registerCommand(commands_1.Commands.VIEW_PACKAGE_OPEN_FILE, vscode_extension_telemetry_wrapper_1.instrumentOperation(commands_1.Commands.VIEW_PACKAGE_OPEN_FILE, (_operationId, uri) => this.openFile(uri))));
        context.subscriptions.push(vscode_1.commands.registerCommand(commands_1.Commands.VIEW_PACKAGE_OUTLINE, vscode_extension_telemetry_wrapper_1.instrumentOperation(commands_1.Commands.VIEW_PACKAGE_OUTLINE, (_operationId, uri, range) => this.goToOutline(uri, range))));
    }
    refresh() {
        this._rootItems = null;
        this._onDidChangeTreeData.fire();
    }
    openFile(uri) {
        return vscode_1.workspace.openTextDocument(vscode_1.Uri.parse(uri)).then((res) => {
            return vscode_1.window.showTextDocument(res);
        });
    }
    goToOutline(uri, range) {
        return this.openFile(uri).then((editor) => {
            editor.revealRange(range, vscode_1.TextEditorRevealType.Default);
            editor.selection = new vscode_1.Selection(range.start, range.start);
            return vscode_1.commands.executeCommand("workbench.action.focusActiveEditorGroup");
        });
    }
    getTreeItem(element) {
        return element.getTreeItem();
    }
    getChildren(element) {
        if (!this._rootItems || !element) {
            return this.getRootNodes();
        }
        else {
            return element.getChildren();
        }
    }
    getParent(element) {
        return element.getParent();
    }
    getRootNodes() {
        return new Promise((resolve, reject) => {
            this._rootItems = new Array();
            const folders = vscode_1.workspace.workspaceFolders;
            telemetry_1.Telemetry.sendEvent("create workspace node(s)");
            if (folders && folders.length) {
                if (folders.length > 1) {
                    folders.forEach((folder) => this._rootItems.push(new workspaceNode_1.WorkspaceNode({
                        name: folder.name,
                        uri: folder.uri.toString(),
                        kind: nodeData_1.NodeKind.Workspace,
                    }, null)));
                    resolve(this._rootItems);
                }
                else {
                    jdtls_1.Jdtls.getProjects(folders[0].uri.toString()).then((result) => {
                        result.forEach((project) => {
                            this._rootItems.push(new projectNode_1.ProjectNode(project, null));
                        });
                        resolve(this._rootItems);
                    });
                }
            }
            else {
                reject("No workspace found");
            }
        });
    }
}
exports.DependencyDataProvider = DependencyDataProvider;
//# sourceMappingURL=dependencyDataProvider.js.map