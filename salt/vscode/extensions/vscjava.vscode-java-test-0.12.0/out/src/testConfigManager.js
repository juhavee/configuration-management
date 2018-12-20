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
const commandUtils_1 = require("./utils/commandUtils");
class TestConfigManager {
    constructor() {
        this.configRelativePath = path.join('.vscode', 'launch.test.json');
    }
    get configPath() {
        return this.configRelativePath;
    }
    loadRunConfig(tests, isDebug) {
        return __awaiter(this, void 0, void 0, function* () {
            const folderSet = this.getFoldersOfTests(tests);
            const configs = [];
            for (const folder of folderSet.values()) {
                const configFullPath = yield this.createTestConfigIfNotExisted(folder);
                const content = yield fse.readFile(configFullPath, 'utf-8');
                configs.push(JSON.parse(content));
            }
            if (isDebug) {
                return configs.map((c) => c.debug);
            }
            return configs.map((c) => c.run);
        });
    }
    createTestConfigIfNotExisted(folder) {
        return __awaiter(this, void 0, void 0, function* () {
            const configFullPath = path.join(folder.uri.fsPath, this.configRelativePath);
            if (!(yield fse.pathExists(configFullPath))) {
                yield fse.ensureDir(path.dirname(configFullPath));
                const config = yield this.createDefaultTestConfig(folder.uri);
                yield fse.writeFile(configFullPath, JSON.stringify(config, null, 4 /* space size */));
            }
            return configFullPath;
        });
    }
    createDefaultTestConfig(folderUri) {
        return __awaiter(this, void 0, void 0, function* () {
            const projects = yield commandUtils_1.getProjectInfo(folderUri);
            return {
                run: {
                    default: '',
                    items: projects.map((project) => {
                        return {
                            name: project.name,
                            projectName: project.name,
                            workingDirectory: vscode_1.Uri.parse(project.path).fsPath,
                            args: [],
                            vmargs: [],
                            env: {},
                            preLaunchTask: '',
                        };
                    }),
                },
                debug: {
                    default: '',
                    items: projects.map((project) => {
                        return {
                            name: project.name,
                            projectName: project.name,
                            workingDirectory: vscode_1.Uri.parse(project.path).fsPath,
                            args: [],
                            vmargs: [],
                            env: {},
                            preLaunchTask: '',
                        };
                    }),
                },
            };
        });
    }
    getFoldersOfTests(tests) {
        const workspaceFolderSet = new Set();
        for (const test of tests) {
            const workspaceFolder = vscode_1.workspace.getWorkspaceFolder(vscode_1.Uri.parse(test.uri));
            if (workspaceFolder) {
                workspaceFolderSet.add(workspaceFolder);
            }
        }
        return workspaceFolderSet;
    }
}
exports.testConfigManager = new TestConfigManager();
//# sourceMappingURL=testConfigManager.js.map