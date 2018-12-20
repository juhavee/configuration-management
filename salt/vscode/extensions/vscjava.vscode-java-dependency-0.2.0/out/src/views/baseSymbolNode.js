"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const commands_1 = require("../commands");
const services_1 = require("../services");
const explorerNode_1 = require("./explorerNode");
class BaseSymbolNode extends explorerNode_1.ExplorerNode {
    constructor(symbolInfo, parent) {
        super(parent);
        this.symbolInfo = symbolInfo;
        this.parent = parent;
    }
    get iconPath() {
        if (BaseSymbolNode._iconMap.has(this.symbolInfo.kind)) {
            const iconFileName = BaseSymbolNode._iconMap.get(this.symbolInfo.kind);
            return {
                light: services_1.Services.context.asAbsolutePath(`./images/symbols/${iconFileName}_16x.svg`),
                dark: services_1.Services.context.asAbsolutePath(`./images/symbols/${iconFileName}_inverse_16x.svg`),
            };
        }
    }
    get command() {
        return {
            title: "Go to outline",
            command: commands_1.Commands.VIEW_PACKAGE_OUTLINE,
            arguments: [this.getParent().uri, this.range],
        };
    }
}
BaseSymbolNode._iconMap = new Map([
    [vscode_1.SymbolKind.Package, "Namespace"],
    [vscode_1.SymbolKind.Class, "Class"],
    [vscode_1.SymbolKind.Interface, "Interface"],
    [vscode_1.SymbolKind.Enum, "Enumerator"],
    [vscode_1.SymbolKind.EnumMember, "EnumItem"],
    [vscode_1.SymbolKind.Constant, "Constant"],
    [vscode_1.SymbolKind.Method, "Method"],
    [vscode_1.SymbolKind.Function, "Method"],
    [vscode_1.SymbolKind.Constructor, "Method"],
    [vscode_1.SymbolKind.Field, "Field"],
    [vscode_1.SymbolKind.Property, "Property"],
    [vscode_1.SymbolKind.Variable, "LocalVariable"],
    [vscode_1.SymbolKind.Constant, "Constant"],
]);
exports.BaseSymbolNode = BaseSymbolNode;
//# sourceMappingURL=baseSymbolNode.js.map