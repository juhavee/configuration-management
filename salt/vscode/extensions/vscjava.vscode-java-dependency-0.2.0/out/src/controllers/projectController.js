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
const fse = require("fs-extra");
const path = require("path");
const vscode_1 = require("vscode");
const xml2js = require("xml2js");
const telemetry_1 = require("../telemetry");
const utility_1 = require("../utility");
class ProjectController {
    constructor(context) {
        this.context = context;
    }
    createJavaProject() {
        return __awaiter(this, void 0, void 0, function* () {
            telemetry_1.Telemetry.sendEvent("create project start");
            const javaVersion = yield this.getJavaVersion();
            if (!javaVersion) {
                return;
            }
            const location = yield vscode_1.window.showOpenDialog({
                defaultUri: vscode_1.workspace.rootPath ? vscode_1.Uri.file(vscode_1.workspace.rootPath) : undefined,
                canSelectFiles: false,
                canSelectFolders: true,
                openLabel: "Select the location",
            });
            if (!location || !location.length) {
                return;
            }
            const basePath = location[0].fsPath;
            const projectName = yield vscode_1.window.showInputBox({
                prompt: "Input a java project name",
                validateInput: (name) => {
                    if (name && !name.match(/^[^*~/\\]+$/)) {
                        return "Please input a valid project name";
                    }
                    if (name && fse.pathExistsSync(path.join(basePath, name))) {
                        return "A project with this name already exists.";
                    }
                    return null;
                },
            });
            if (!projectName) {
                return;
            }
            if (yield this.scaffoldJavaProject(basePath, projectName, javaVersion)) {
                telemetry_1.Telemetry.sendEvent("create project end successfully");
                return vscode_1.commands.executeCommand("vscode.openFolder", vscode_1.Uri.file(path.join(basePath, projectName)), true);
            }
        });
    }
    scaffoldJavaProject(basePath, projectName, javaVersion) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectRoot = path.join(basePath, projectName);
            const templateRoot = path.join(this.context.extensionPath, "templates");
            const projectFile = path.join(projectRoot, ".project");
            try {
                let jdkSpecificTemplateRoot = path.join(templateRoot, `Java${javaVersion}`);
                if (!(yield fse.pathExists(jdkSpecificTemplateRoot))) {
                    // fall back to 8
                    jdkSpecificTemplateRoot = path.join(templateRoot, `Java8`);
                }
                yield fse.ensureDir(projectRoot);
                yield Promise.all([
                    fse.copy(path.join(templateRoot, "App.java.sample"), path.join(projectRoot, "src", "app", "App.java")),
                    fse.copy(jdkSpecificTemplateRoot, projectRoot),
                    fse.copy(path.join(templateRoot, ".project"), path.join(projectRoot, ".project")),
                    fse.ensureDir(path.join(projectRoot, "bin")),
                ]);
                // replace the project name with user input project name
                const xml = yield fse.readFile(projectFile, "utf8");
                const jsonObj = yield utility_1.Utility.parseXml(xml);
                jsonObj.projectDescription.name = projectName;
                const builder = new xml2js.Builder();
                const newXml = builder.buildObject(jsonObj);
                yield fse.writeFile(projectFile, newXml);
            }
            catch (error) {
                vscode_1.window.showErrorMessage(error.message);
                telemetry_1.Telemetry.sendEvent("scaffold java project exception", error);
                return;
            }
            return true;
        });
    }
    getJavaVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            let javaVersion;
            try {
                const javaHome = yield utility_1.Utility.checkJavaRuntime();
                javaVersion = yield utility_1.Utility.checkJavaVersion(javaHome);
            }
            catch (error) {
                vscode_1.window.showErrorMessage(error.message, error.label).then((selection) => {
                    if (error.label && error.label === selection && error.openUrl) {
                        vscode_1.commands.executeCommand("vscode.open", error.openUrl);
                    }
                });
                telemetry_1.Telemetry.sendEvent("get java version exception", error);
                return;
            }
            return javaVersion;
        });
    }
}
exports.ProjectController = ProjectController;
//# sourceMappingURL=projectController.js.map