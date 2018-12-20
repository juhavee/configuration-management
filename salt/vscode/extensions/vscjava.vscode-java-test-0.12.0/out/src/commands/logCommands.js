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
const configs_1 = require("../constants/configs");
const logger_1 = require("../logger/logger");
const outputChannelTransport_1 = require("../logger/outputChannelTransport");
function openLogFile(storagePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const logFilePath = path.join(storagePath, configs_1.LOG_FILE_NAME);
        if (!(yield fse.pathExists(logFilePath))) {
            const errorMsg = 'The log file does not exist.';
            logger_1.logger.error(errorMsg);
            yield vscode_1.window.showErrorMessage(errorMsg);
            return;
        }
        const textDocument = yield vscode_1.workspace.openTextDocument(logFilePath);
        vscode_1.window.showTextDocument(textDocument, vscode_1.ViewColumn.Active, false);
    });
}
exports.openLogFile = openLogFile;
function showOutputChannel() {
    outputChannelTransport_1.outputChannelTransport.show();
}
exports.showOutputChannel = showOutputChannel;
//# sourceMappingURL=logCommands.js.map