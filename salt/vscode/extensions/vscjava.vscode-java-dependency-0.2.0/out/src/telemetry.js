"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_extension_telemetry_1 = require("vscode-extension-telemetry");
const extensionId = "vscjava.vscode-java-dependency";
const packageJSON = vscode.extensions.getExtension(extensionId).packageJSON;
const extensionVersion = packageJSON.version;
const aiKey = packageJSON.aiKey;
class Telemetry {
    static sendEvent(eventName, properties, measures) {
        this._client.sendTelemetryEvent(eventName, properties, measures);
    }
}
Telemetry._client = new vscode_extension_telemetry_1.default(extensionId, extensionVersion, aiKey);
exports.Telemetry = Telemetry;
//# sourceMappingURL=telemetry.js.map