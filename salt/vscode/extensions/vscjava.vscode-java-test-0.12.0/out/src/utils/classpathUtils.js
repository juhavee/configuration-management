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
const archiver = require("archiver");
const fileUrl = require("file-url");
const fse = require("fs-extra");
const os = require("os");
const path = require("path");
const configs_1 = require("../constants/configs");
const platformUtils_1 = require("./platformUtils");
function getClassPathString(classpaths, storagePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const separator = (platformUtils_1.isDarwin() || platformUtils_1.isLinux()) ? ':' : ';';
        const joinedClassPath = classpaths.join(separator);
        if (joinedClassPath.length <= configs_1.MAX_CLASS_PATH_LENGTH) {
            return joinedClassPath;
        }
        return yield generateClassPathFile(classpaths, storagePath);
    });
}
exports.getClassPathString = getClassPathString;
function generateClassPathFile(classpaths, storagePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const classpathJarFilePath = path.join(storagePath, 'path.jar');
        yield fse.ensureDir(path.dirname(classpathJarFilePath));
        return new Promise((resolve, reject) => {
            const tempArchive = archiver('zip');
            const writeStream = fse.createWriteStream(classpathJarFilePath);
            tempArchive.pipe(writeStream);
            tempArchive.append(generateManifestFileContent(classpaths), { name: 'META-INF/MANIFEST.MF' });
            tempArchive.finalize();
            tempArchive.on('error', (error) => {
                reject(error);
            });
            writeStream.on('close', () => {
                resolve(classpathJarFilePath);
            });
        });
    });
}
function generateManifestFileContent(classpaths) {
    const extended = ['Class-Path:', ...classpaths.map((classpath) => {
            const entry = fileUrl(classpath);
            return entry.endsWith('.jar') ? entry : entry + '/';
        })];
    return `${extended.join(` ${os.EOL} `)}${os.EOL}`;
}
//# sourceMappingURL=classpathUtils.js.map