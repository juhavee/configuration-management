"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process = require("child_process");
const findJavaHome = require("find-java-home");
const fse = require("fs-extra");
const path = require("path");
const vscode_1 = require("vscode");
const xml2js = require("xml2js");
class Utility {
    static isThenable(obj) {
        return obj && typeof obj.then === "function";
    }
    static checkJavaVersion(javaHome) {
        return new Promise((resolve, reject) => {
            child_process.execFile(javaHome + "/bin/java", ["-version"], {}, (error, stdout, stderr) => {
                const javaVersion = this.parseMajorVersion(stderr);
                if (javaVersion < 8) {
                    this.openJDKDownload(reject, "Java 8 or more recent is required to run. Please download and install a recent JDK");
                }
                else {
                    resolve(javaVersion);
                }
            });
        });
    }
    static checkJavaRuntime() {
        const isWindows = process.platform.indexOf("win") === 0;
        const JAVAC_FILENAME = "javac" + (isWindows ? ".exe" : "");
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let source;
            let javaHome = this.readJavaConfig();
            if (javaHome) {
                source = "The java.home variable defined in VS Code settings";
            }
            else {
                javaHome = process.env.JDK_HOME;
                if (javaHome) {
                    source = "The JDK_HOME environment variable";
                }
                else {
                    javaHome = process.env.JAVA_HOME;
                    source = "The JAVA_HOME environment variable";
                }
            }
            if (javaHome) {
                if (!(yield fse.pathExists(javaHome))) {
                    this.openJDKDownload(reject, source + " points to a missing folder");
                }
                if (!(yield fse.pathExists(path.resolve(javaHome, "bin", JAVAC_FILENAME)))) {
                    this.openJDKDownload(reject, source + " does not point to a JDK.");
                }
                return resolve(javaHome);
            }
            // No settings, let"s try to detect as last resort.
            findJavaHome((err, home) => {
                if (err) {
                    this.openJDKDownload(reject, "Java runtime could not be located");
                }
                else {
                    resolve(home);
                }
            });
        }));
    }
    static parseXml(xml) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                xml2js.parseString(xml, { explicitArray: true }, (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(res);
                });
            });
        });
    }
    static openJDKDownload(reject, cause) {
        let jdkUrl = "http://developers.redhat.com/products/openjdk/overview/?from=vscode";
        if (process.platform === "darwin") {
            jdkUrl = "http://www.oracle.com/technetwork/java/javase/downloads/index.html";
        }
        reject({
            message: cause,
            label: "Get Java Development Kit",
            openUrl: vscode_1.Uri.parse(jdkUrl),
            replaceClose: false,
        });
    }
    static parseMajorVersion(content) {
        let regexp = /version "(.*)"/g;
        let match = regexp.exec(content);
        if (!match) {
            return 0;
        }
        let version = match[1];
        // Ignore "1." prefix for legacy Java versions
        if (version.startsWith("1.")) {
            version = version.substring(2);
        }
        // look into the interesting bits now
        regexp = /\d+/g;
        match = regexp.exec(version);
        let javaVersion = 0;
        if (match) {
            // tslint:disable-next-line:radix
            javaVersion = parseInt(match[0]);
        }
        return javaVersion;
    }
    static readJavaConfig() {
        const config = vscode_1.workspace.getConfiguration();
        return config.get("java.home", null);
    }
}
exports.Utility = Utility;
//# sourceMappingURL=utility.js.map