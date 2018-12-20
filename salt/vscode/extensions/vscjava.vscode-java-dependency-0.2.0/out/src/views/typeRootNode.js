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
const vscode_1 = require("vscode");
const vscode_extension_telemetry_wrapper_1 = require("vscode-extension-telemetry-wrapper");
const commands_1 = require("../commands");
const typeRootNodeData_1 = require("../java/typeRootNodeData");
const services_1 = require("../services");
const settings_1 = require("../settings");
const dataNode_1 = require("./dataNode");
const documentSymbolNode_1 = require("./documentSymbolNode");
const explorerNode_1 = require("./explorerNode");
const symbolNode_1 = require("./symbolNode");
class TypeRootNode extends dataNode_1.DataNode {
    constructor(nodeData, parent) {
        super(nodeData, parent);
    }
    loadData() {
        return vscode_1.workspace.openTextDocument(vscode_1.Uri.parse(this.nodeData.uri)).then((doc) => {
            return this.getSymbols(doc);
        });
    }
    createChildNodeList() {
        const data = this.nodeData;
        const result = [];
        if (this.nodeData.children && this.nodeData.children.length) {
            // After DocumentSymbolProvider api change at
            // https://github.com/eclipse/eclipse.jdt.ls/issues/780, the vscode.executeDocumentSymbolProvider
            // will return DocumentSymbol[]
            if (this.nodeData.children && this.nodeData.children.length && this.nodeData.children[0].hasOwnProperty("children")) {
                // if the element in children is DocumentSymbol
                this.nodeData.children.forEach((symbolInfo) => {
                    result.push(new documentSymbolNode_1.DocumentSymbolNode(symbolInfo, this));
                });
            }
            else {
                // if the element in children is SymbolInformation
                data.symbolTree = this.buildSymbolTree(this.nodeData.children);
                const directChildren = data.symbolTree.get(this.nodeData.name);
                if (directChildren && directChildren.length) {
                    directChildren.forEach((symbolInfo) => {
                        result.push(new symbolNode_1.SymbolNode(symbolInfo, this));
                    });
                }
            }
        }
        return result;
    }
    get iconPath() {
        const data = this.nodeData;
        if (data.entryKind === typeRootNodeData_1.TypeRootKind.K_BINARY) {
            return explorerNode_1.ExplorerNode.resolveIconPath("classfile");
        }
        else {
            return services_1.Services.context.asAbsolutePath("./images/file-type-java.svg");
        }
    }
    hasChildren() {
        return settings_1.Settings.showOutline();
    }
    getSymbols(document) {
        return __awaiter(this, void 0, void 0, function* () {
            let error;
            const operationId = vscode_extension_telemetry_wrapper_1.createUuid();
            const startAt = Date.now();
            vscode_extension_telemetry_wrapper_1.sendOperationStart(operationId, "vscode.executeDocumentSymbolProvider");
            try {
                return yield vscode_1.commands.executeCommand("vscode.executeDocumentSymbolProvider", document.uri);
            }
            catch (err) {
                error = err;
                throw err;
            }
            finally {
                const duration = Date.now() - startAt;
                vscode_extension_telemetry_wrapper_1.sendOperationEnd(operationId, "vscode.executeDocumentSymbolProvider", duration, error);
            }
        });
    }
    buildSymbolTree(symbols) {
        const res = new Map();
        symbols.forEach((symbol) => {
            if (!res.has(symbol.containerName)) {
                res.set(symbol.containerName, []);
            }
            res.get(symbol.containerName).push(symbol);
        });
        return res;
    }
    get command() {
        return {
            title: "Open source file content",
            command: commands_1.Commands.VIEW_PACKAGE_OPEN_FILE,
            arguments: [this.uri],
        };
    }
}
exports.TypeRootNode = TypeRootNode;
//# sourceMappingURL=typeRootNode.js.map