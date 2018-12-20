"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const commands_1 = require("../commands");
var Jdtls;
(function (Jdtls) {
    function getProjects(params) {
        return vscode_1.commands.executeCommand(commands_1.Commands.EXECUTE_WORKSPACE_COMMAND, commands_1.Commands.JAVA_PROJECT_LIST, params);
    }
    Jdtls.getProjects = getProjects;
    function getPackageData(params) {
        return vscode_1.commands.executeCommand(commands_1.Commands.EXECUTE_WORKSPACE_COMMAND, commands_1.Commands.JAVA_GETPACKAGEDATA, params);
    }
    Jdtls.getPackageData = getPackageData;
    function resolvePath(params) {
        return vscode_1.commands.executeCommand(commands_1.Commands.EXECUTE_WORKSPACE_COMMAND, commands_1.Commands.JAVA_RESOLVEPATH, params);
    }
    Jdtls.resolvePath = resolvePath;
})(Jdtls = exports.Jdtls || (exports.Jdtls = {}));
//# sourceMappingURL=jdtls.js.map