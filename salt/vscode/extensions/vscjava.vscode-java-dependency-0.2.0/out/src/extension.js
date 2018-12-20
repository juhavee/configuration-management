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
const commands_1 = require("./commands");
const projectController_1 = require("./controllers/projectController");
const services_1 = require("./services");
const settings_1 = require("./settings");
const dependencyExplorer_1 = require("./views/dependencyExplorer");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        yield vscode_extension_telemetry_wrapper_1.initializeFromJsonFile(context.asAbsolutePath("./package.json"));
        return vscode_extension_telemetry_wrapper_1.instrumentOperation("activation", activateExtension)(context);
    });
}
exports.activate = activate;
function activateExtension(operationId, context) {
    vscode_1.commands.executeCommand("setContext", "extensionActivated", true);
    services_1.Services.initialize(context);
    settings_1.Settings.initialize(context);
    const projectController = new projectController_1.ProjectController(context);
    const instrumented = vscode_extension_telemetry_wrapper_1.instrumentOperation(commands_1.Commands.JAVA_PROJECT_CREATE, () => projectController.createJavaProject());
    context.subscriptions.push(vscode_1.commands.registerCommand(commands_1.Commands.JAVA_PROJECT_CREATE, instrumented));
    context.subscriptions.push(new dependencyExplorer_1.DependencyExplorer(context));
}
// this method is called when your extension is deactivated
function deactivate() {
    return __awaiter(this, void 0, void 0, function* () {
        yield vscode_extension_telemetry_wrapper_1.dispose();
    });
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map