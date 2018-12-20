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
const cp = require("child_process");
const fse = require("fs-extra");
const getPort = require("get-port");
const os = require("os");
const path = require("path");
const vscode_1 = require("vscode");
const logger_1 = require("../../logger/logger");
const classpathUtils = require("../../utils/classpathUtils");
const commandUtils_1 = require("../../utils/commandUtils");
const cpUtils_1 = require("../../utils/cpUtils");
class BaseRunner {
    constructor(javaHome, storagePath, extensionPath) {
        this.javaHome = javaHome;
        this.storagePath = storagePath;
        this.extensionPath = extensionPath;
    }
    get runnerDir() {
        return path.join(this.extensionPath, 'server');
    }
    get runnerMainClassName() {
        return 'com.microsoft.java.test.runner.Launcher';
    }
    setup(tests, isDebug = false, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const runnerJarFilePath = yield this.getRunnerJarFilePath();
            this.port = isDebug ? yield getPort() : undefined;
            this.tests = tests;
            this.isDebug = isDebug;
            const testPaths = tests.map((item) => vscode_1.Uri.parse(item.uri).fsPath);
            const classpaths = [...yield commandUtils_1.resolveRuntimeClassPath(testPaths), runnerJarFilePath];
            this.storagePathForCurrentSession = path.join(this.storagePath || os.tmpdir(), new Date().getTime().toString());
            this.classpath = yield classpathUtils.getClassPathString(classpaths, this.storagePathForCurrentSession);
            this.config = config;
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const commandParams = yield this.constructCommandParams();
            const options = { cwd: this.config ? this.config.workingDirectory : undefined, env: process.env };
            if (this.config && this.config.env) {
                options.env = Object.assign({}, this.config.env, options.env);
            }
            return new Promise((resolve, reject) => {
                const testResultAnalyzer = this.getTestResultAnalyzer();
                let buffer = '';
                this.process = cp.spawn(path.join(this.javaHome, 'bin', 'java'), commandParams, options);
                this.process.on('error', (error) => {
                    logger_1.logger.error('Failed to launch the runner', error);
                    reject(error);
                });
                this.process.stderr.on('data', (data) => {
                    testResultAnalyzer.analyzeError(data.toString());
                });
                this.process.stdout.on('data', (data) => {
                    buffer = buffer.concat(data.toString());
                    const index = buffer.lastIndexOf(os.EOL);
                    if (index >= 0) {
                        testResultAnalyzer.analyzeData(buffer.substring(0, index));
                        buffer = buffer.substring(index + os.EOL.length);
                    }
                });
                this.process.on('close', (signal) => {
                    if (this.isCanceled) {
                        return resolve([]);
                    }
                    if (buffer.length > 0) {
                        testResultAnalyzer.analyzeData(buffer);
                    }
                    const result = testResultAnalyzer.feedBack();
                    if (signal && signal !== 0) {
                        reject(new Error(`Runner exited with code ${signal}.`));
                    }
                    else {
                        resolve(result);
                    }
                });
                if (this.isDebug) {
                    const uri = vscode_1.Uri.parse(this.tests[0].uri);
                    setTimeout(() => {
                        vscode_1.debug.startDebugging(vscode_1.workspace.getWorkspaceFolder(uri), {
                            name: 'Debug Java Tests',
                            type: 'java',
                            request: 'attach',
                            hostName: 'localhost',
                            port: this.port,
                            projectName: this.config ? this.config.projectName : undefined,
                        });
                    }, 500);
                }
            });
        });
    }
    cleanUp(isCancel) {
        return __awaiter(this, void 0, void 0, function* () {
            this.isCanceled = isCancel;
            try {
                if (this.process) {
                    yield cpUtils_1.killProcess(this.process);
                    this.process = undefined;
                }
                if (this.storagePathForCurrentSession) {
                    yield fse.remove(this.storagePathForCurrentSession);
                    this.storagePathForCurrentSession = undefined;
                }
            }
            catch (error) {
                logger_1.logger.error('Failed to clean up', error);
            }
        });
    }
    constructCommandParams() {
        const commandParams = [];
        commandParams.push('-cp', this.classpath);
        if (this.isDebug) {
            commandParams.push('-Xdebug', `-Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=${this.port}`);
        }
        if (this.config) {
            if (this.config.vmargs.length > 0) {
                commandParams.push(...this.config.vmargs);
            }
            if (this.config.args.length > 0) {
                commandParams.push(...this.config.args);
            }
        }
        commandParams.push(this.runnerMainClassName);
        return commandParams;
    }
    getRunnerJarFilePath() {
        return __awaiter(this, void 0, void 0, function* () {
            const runnerPath = path.join(this.runnerDir, 'com.microsoft.java.test.runner-jar-with-dependencies.jar');
            if (yield fse.pathExists(runnerPath)) {
                return runnerPath;
            }
            throw new Error('Failed to find runner jar file.');
        });
    }
}
exports.BaseRunner = BaseRunner;
//# sourceMappingURL=BaseRunner.js.map