"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const commands_1 = require("./commands");
class Settings {
    static initialize(context) {
        context.subscriptions.push(vscode_1.workspace.onDidChangeConfiguration((e) => {
            if (!e.affectsConfiguration("java.dependency")) {
                return;
            }
            const updatedConfig = vscode_1.workspace.getConfiguration("java.dependency");
            if (updatedConfig.showOutline !== this._depdendencyConfig.showOutline) {
                vscode_1.commands.executeCommand(commands_1.Commands.VIEW_PACKAGE_REFRESH);
            }
            this._depdendencyConfig = updatedConfig;
        }));
    }
    static showOutline() {
        return this._depdendencyConfig.get("showOutline");
    }
    static syncWithFolderExplorer() {
        return this._depdendencyConfig.get("syncWithFolderExplorer");
    }
}
Settings._depdendencyConfig = vscode_1.workspace.getConfiguration("java.dependency");
exports.Settings = Settings;
//# sourceMappingURL=settings.js.map