"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
var ContainerEntryKind;
(function (ContainerEntryKind) {
    /**
     * Entry kind constant describing a classpath entry identifying a
     * library. A library is a folder or JAR containing package
     * fragments consisting of pre-compiled binaries.
     */
    ContainerEntryKind[ContainerEntryKind["CPE_LIBRARY"] = 1] = "CPE_LIBRARY";
    /**
     * Entry kind constant describing a classpath entry identifying a
     * required project.
     */
    ContainerEntryKind[ContainerEntryKind["CPE_PROJECT"] = 2] = "CPE_PROJECT";
    /**
     * Entry kind constant describing a classpath entry identifying a
     * folder containing package fragments with source code
     * to be compiled.
     */
    ContainerEntryKind[ContainerEntryKind["CPE_SOURCE"] = 3] = "CPE_SOURCE";
    /**
     * Entry kind constant describing a classpath entry defined using
     * a path that begins with a classpath variable reference.
     */
    ContainerEntryKind[ContainerEntryKind["CPE_VARIABLE"] = 4] = "CPE_VARIABLE";
    /**
     * Entry kind constant describing a classpath entry representing
     * a name classpath container.
     *
     * @since 2.0
     */
    ContainerEntryKind[ContainerEntryKind["CPE_CONTAINER"] = 5] = "CPE_CONTAINER";
})(ContainerEntryKind = exports.ContainerEntryKind || (exports.ContainerEntryKind = {}));
//# sourceMappingURL=containerNodeData.js.map