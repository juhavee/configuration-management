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
const commandUtils_1 = require("../utils/commandUtils");
const protocolUtils_1 = require("../utils/protocolUtils");
const executeTests_1 = require("./executeTests");
function openTextDocumentForNode(node) {
    return __awaiter(this, void 0, void 0, function* () {
        const document = yield vscode_1.workspace.openTextDocument(vscode_1.Uri.file(node.fsPath));
        yield vscode_1.window.showTextDocument(document, { preserveFocus: true, selection: node.range });
    });
}
exports.openTextDocumentForNode = openTextDocumentForNode;
function runTestsFromExplorer(node) {
    return __awaiter(this, void 0, void 0, function* () {
        return executeTestsFromExplorer(false /* isDebug */, true /* isDefaultConfig */, node);
    });
}
exports.runTestsFromExplorer = runTestsFromExplorer;
function debugTestsFromExplorer(node) {
    return __awaiter(this, void 0, void 0, function* () {
        return executeTestsFromExplorer(true /* isDebug */, true /* isDefaultConfig */, node);
    });
}
exports.debugTestsFromExplorer = debugTestsFromExplorer;
function runTestsWithConfigFromExplorer(node) {
    return __awaiter(this, void 0, void 0, function* () {
        return executeTestsFromExplorer(false /* isDebug */, false /* isDefaultConfig */, node);
    });
}
exports.runTestsWithConfigFromExplorer = runTestsWithConfigFromExplorer;
function debugTestsWithFromExplorer(node) {
    return __awaiter(this, void 0, void 0, function* () {
        return executeTestsFromExplorer(true /* isDebug */, false /* isDefaultConfig */, node);
    });
}
exports.debugTestsWithFromExplorer = debugTestsWithFromExplorer;
function executeTestsFromExplorer(isDebug, isDefaultConfig, node) {
    return __awaiter(this, void 0, void 0, function* () {
        return vscode_1.window.withProgress({ location: vscode_1.ProgressLocation.Notification, cancellable: true }, (progress, token) => __awaiter(this, void 0, void 0, function* () {
            progress.report({ message: 'Searching test items...' });
            const searchParam = protocolUtils_1.constructSearchTestItemParams(node);
            const tests = yield commandUtils_1.searchTestItemsAll(searchParam);
            if (token.isCancellationRequested) {
                return;
            }
            return executeTests_1.executeTests(tests, isDebug, isDefaultConfig, progress, token);
        }));
    });
}
//# sourceMappingURL=explorerCommands.js.map