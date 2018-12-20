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
const commands_1 = require("../constants/commands");
function searchTestItems(params) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield executeJavaLanguageServerCommand(commands_1.JavaTestRunnerDelegateCommands.SEARCH_TEST_ITEMS, JSON.stringify(params))) || [];
    });
}
exports.searchTestItems = searchTestItems;
function searchTestItemsAll(request) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield executeJavaLanguageServerCommand(commands_1.JavaTestRunnerDelegateCommands.SEARCH_TEST_ITEMS_ALL, JSON.stringify(request))) || [];
    });
}
exports.searchTestItemsAll = searchTestItemsAll;
function searchTestCodeLens(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield executeJavaLanguageServerCommand(commands_1.JavaTestRunnerDelegateCommands.SEARCH_TEST_CODE_LENS, uri)) || [];
    });
}
exports.searchTestCodeLens = searchTestCodeLens;
function resolveRuntimeClassPath(paths) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield executeJavaLanguageServerCommand(commands_1.JavaTestRunnerDelegateCommands.RESOLVE_RUNTIME_CLASSPATH, paths)) || [];
    });
}
exports.resolveRuntimeClassPath = resolveRuntimeClassPath;
function getProjectInfo(folderUri) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield executeJavaLanguageServerCommand(commands_1.JavaTestRunnerDelegateCommands.GET_PROJECT_INFO, folderUri.toString())) || [];
    });
}
exports.getProjectInfo = getProjectInfo;
function executeJavaLanguageServerCommand(...rest) {
    return vscode_1.commands.executeCommand(commands_1.JavaLanguageServerCommands.EXECUTE_WORKSPACE_COMMAND, ...rest);
}
//# sourceMappingURL=commandUtils.js.map