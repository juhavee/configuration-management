"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_1 = require("vscode");
const commands_1 = require("../constants/commands");
const protocols_1 = require("../protocols");
const commandUtils_1 = require("../utils/commandUtils");
const protocolUtils_1 = require("../utils/protocolUtils");
const explorerNodeManager_1 = require("./explorerNodeManager");
const TestTreeNode_1 = require("./TestTreeNode");
class TestExplorer {
    constructor() {
        this.testExplorerViewId = 'testExplorer';
        this.onDidChangeTreeDataEventEmitter = new vscode_1.EventEmitter();
        // tslint:disable-next-line:member-ordering
        this.onDidChangeTreeData = this.onDidChangeTreeDataEventEmitter.event;
    }
    initialize(context) {
        this._context = context;
    }
    getTreeItem(element) {
        return {
            label: element.name,
            collapsibleState: this.resolveCollapsibleState(element),
            command: this.resolveCommand(element),
            iconPath: this.resolveIconPath(element),
            contextValue: element.level.toString(),
        };
    }
    getChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            let children = [];
            if (!element) {
                const folders = vscode_1.workspace.workspaceFolders;
                if (folders) {
                    children = folders.map((folder) => new TestTreeNode_1.TestTreeNode(folder.name, folder.name, protocols_1.TestLevel.Folder, folder.uri.fsPath));
                }
            }
            else {
                if (!element.children) {
                    element.children = yield this.getChildrenOfTreeNode(element);
                    explorerNodeManager_1.explorerNodeManager.storeNodes(...element.children);
                }
                children = element.children;
            }
            return children.sort((a, b) => a.name.localeCompare(b.name));
        });
    }
    refresh(element) {
        if (element) {
            element.children = undefined;
        }
        this.onDidChangeTreeDataEventEmitter.fire(element);
    }
    getChildrenOfTreeNode(element) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchParams = protocolUtils_1.constructSearchTestItemParams(element);
            const results = yield commandUtils_1.searchTestItems(searchParams);
            return results.map((result) => new TestTreeNode_1.TestTreeNode(result.displayName, result.fullName, result.level, vscode_1.Uri.parse(result.uri).fsPath, result.range));
        });
    }
    resolveCollapsibleState(element) {
        if (element.isMethod) {
            return vscode_1.TreeItemCollapsibleState.None;
        }
        return vscode_1.TreeItemCollapsibleState.Collapsed;
    }
    resolveIconPath(element) {
        switch (element.level) {
            case protocols_1.TestLevel.Method:
                return {
                    dark: this._context.asAbsolutePath(path.join('resources', 'media', 'dark', 'method.svg')),
                    light: this._context.asAbsolutePath(path.join('resources', 'media', 'light', 'method.svg')),
                };
            case protocols_1.TestLevel.Class:
            case protocols_1.TestLevel.NestedClass:
                return {
                    dark: this._context.asAbsolutePath(path.join('resources', 'media', 'dark', 'class.svg')),
                    light: this._context.asAbsolutePath(path.join('resources', 'media', 'light', 'class.svg')),
                };
            case protocols_1.TestLevel.Package:
                return {
                    dark: this._context.asAbsolutePath(path.join('resources', 'media', 'dark', 'package.svg')),
                    light: this._context.asAbsolutePath(path.join('resources', 'media', 'light', 'package.svg')),
                };
            default:
                return undefined;
        }
    }
    resolveCommand(element) {
        if (element.level >= protocols_1.TestLevel.Class) {
            return {
                command: commands_1.JavaTestRunnerCommands.OPEN_DOCUMENT_FOR_NODE,
                title: '',
                arguments: [element],
            };
        }
        return undefined;
    }
}
exports.TestExplorer = TestExplorer;
exports.testExplorer = new TestExplorer();
//# sourceMappingURL=testExplorer.js.map