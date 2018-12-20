"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
class Services {
    static initialize(context) {
        this._context = context;
    }
    static get context() {
        return this._context;
    }
}
exports.Services = Services;
//# sourceMappingURL=services.js.map