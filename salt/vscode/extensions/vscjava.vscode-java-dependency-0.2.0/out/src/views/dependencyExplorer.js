"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const jdtls_1 = require("../java/jdtls");
const settings_1 = require("../settings");
const utility_1 = require("../utility");
const dependencyDataProvider_1 = require("./dependencyDataProvider");
class DependencyExplorer {
    constructor(context) {
        this.context = context;
        this._dataProvider = new dependencyDataProvider_1.DependencyDataProvider(context);
        this._dependencyViewer = vscode_1.window.createTreeView("javaDependencyExplorer", { treeDataProvider: this._dataProvider });
        vscode_1.window.onDidChangeActiveTextEditor((textEditor) => {
            if (textEditor && textEditor.document && settings_1.Settings.syncWithFolderExplorer()) {
                this.reveal(textEditor.document.uri);
            }
        });
        this._dependencyViewer.onDidChangeVisibility((e) => {
            if (e.visible && this._selectionWhenHidden) {
                this._dependencyViewer.reveal(this._selectionWhenHidden);
                this._selectionWhenHidden = undefined;
            }
        });
    }
    dispose() {
    }
    reveal(uri) {
        jdtls_1.Jdtls.resolvePath(uri.toString()).then((paths) => {
            this.revealPath(this._dataProvider, paths);
        });
    }
    revealPath(current, paths) {
        if (!current) {
            return;
        }
        const res = current.getChildren();
        if (utility_1.Utility.isThenable(res)) {
            res.then((children) => {
                this.visitChildren(children, paths);
            });
        }
        else {
            this.visitChildren(res, paths);
        }
    }
    visitChildren(children, paths) {
        if (children && paths) {
            for (const c of children) {
                if (paths[0] && c.path === paths[0].path && c.nodeData.name === paths[0].name) {
                    if (paths.length === 1) {
                        if (this._dependencyViewer.visible) {
                            this._dependencyViewer.reveal(c);
                        }
                        else {
                            this._selectionWhenHidden = c;
                        }
                    }
                    else {
                        paths.shift();
                        this.revealPath(c, paths);
                    }
                    break;
                }
            }
        }
    }
}
exports.DependencyExplorer = DependencyExplorer;
//# sourceMappingURL=dependencyExplorer.js.map