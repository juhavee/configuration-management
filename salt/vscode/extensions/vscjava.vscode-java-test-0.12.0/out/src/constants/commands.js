"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
var JavaLanguageServerCommands;
(function (JavaLanguageServerCommands) {
    JavaLanguageServerCommands.EXECUTE_WORKSPACE_COMMAND = 'java.execute.workspaceCommand';
})(JavaLanguageServerCommands = exports.JavaLanguageServerCommands || (exports.JavaLanguageServerCommands = {}));
var JavaTestRunnerDelegateCommands;
(function (JavaTestRunnerDelegateCommands) {
    JavaTestRunnerDelegateCommands.SEARCH_TEST_ITEMS = 'vscode.java.test.search.items';
    JavaTestRunnerDelegateCommands.SEARCH_TEST_ITEMS_ALL = 'vscode.java.test.search.items.all';
    JavaTestRunnerDelegateCommands.SEARCH_TEST_CODE_LENS = 'vscode.java.test.search.codelens';
    JavaTestRunnerDelegateCommands.RESOLVE_RUNTIME_CLASSPATH = 'vscode.java.test.runtime.classpath';
    JavaTestRunnerDelegateCommands.GET_PROJECT_INFO = 'vscode.java.test.project.info';
})(JavaTestRunnerDelegateCommands = exports.JavaTestRunnerDelegateCommands || (exports.JavaTestRunnerDelegateCommands = {}));
var JavaTestRunnerCommands;
(function (JavaTestRunnerCommands) {
    JavaTestRunnerCommands.OPEN_DOCUMENT_FOR_NODE = 'java.test.explorer.select';
    JavaTestRunnerCommands.REFRESH_EXPLORER = 'java.test.explorer.refresh';
    JavaTestRunnerCommands.RUN_TEST_FROM_CODELENS = 'java.test.run';
    JavaTestRunnerCommands.DEBUG_TEST_FROM_CODELENS = 'java.test.debug';
    JavaTestRunnerCommands.RUN_TEST_FROM_EXPLORER = 'java.test.explorer.run';
    JavaTestRunnerCommands.DEBUG_TEST_FROM_EXPLORER = 'java.test.explorer.debug';
    JavaTestRunnerCommands.RUN_TEST_WITH_CONFIG_FROM_EXPLORER = 'java.test.explorer.run.config';
    JavaTestRunnerCommands.DEBUG_TEST_WITH_CONFIG_FROM_EXPLORER = 'java.test.explorer.debug.config';
    JavaTestRunnerCommands.SHOW_TEST_REPORT = 'java.test.show.report';
    JavaTestRunnerCommands.SHOW_TEST_OUTPUT = 'java.test.show.output';
    JavaTestRunnerCommands.OPEN_TEST_LOG = 'java.test.open.log';
    JavaTestRunnerCommands.JAVA_TEST_CANCEL = 'java.test.cancel';
})(JavaTestRunnerCommands = exports.JavaTestRunnerCommands || (exports.JavaTestRunnerCommands = {}));
//# sourceMappingURL=commands.js.map