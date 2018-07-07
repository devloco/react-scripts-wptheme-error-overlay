/**
 * Copyright (c) 2018-present, https://github.com/devloco
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

var stripAnsi = require("strip-ansi");
var formatWebpackMessages = require("../lib/formatWebpackMessages");
var ErrorOverlay = require("react-error-overlay");

// We need to keep track of if there has been a runtime error.
// Essentially, we cannot guarantee application state was not corrupted by the
// runtime error. To prevent confusing behavior, we forcibly reload the entire
// application. This is handled below when we are notified of a compile (code
// change).
// See https://github.com/facebookincubator/create-react-app/issues/3096
var hadRuntimeError = false;
ErrorOverlay.startReportingRuntimeErrors({
    onError: function() {
        hadRuntimeError = true;
    },
    filename: "/static/js/bundle.js"
});

// Remember some state related to hot module replacement.
var isFirstCompilation = true;
var mostRecentCompilationHash = null;
var hasCompileErrors = false;

export function clearConsole() {
    // Clean up outdated compile errors, if any.
    if (typeof console !== "undefined" && typeof console.clear === "function") {
        console.clear();
    }
}

export function handleSuccess() {
    // Successful compilation.
    clearConsole();

    isFirstCompilation = false;
    hasCompileErrors = false;
}

export function handleWarnings(warnings) {
    clearConsole();

    // var isHotUpdate = !isFirstCompilation;
    isFirstCompilation = false;
    hasCompileErrors = false;

    function printWarnings() {
        // Print warnings to the console.
        var formatted = formatWebpackMessages({
            warnings: warnings,
            errors: []
        });

        if (typeof console !== "undefined" && typeof console.warn === "function") {
            for (var i = 0; i < formatted.warnings.length; i++) {
                if (i === 5) {
                    console.warn("There were more warnings in other files.\n" + "You can find a complete log in the terminal.");
                    break;
                }

                console.warn(stripAnsi(formatted.warnings[i]));
            }
        }
    }

    printWarnings();
}

export function handleErrors(errors) {
    clearConsole();

    isFirstCompilation = false;
    hasCompileErrors = true;

    // "Massage" webpack messages.
    var formatted = formatWebpackMessages({
        errors: errors,
        warnings: []
    });

    // Only show the first error.
    ErrorOverlay.reportBuildError(formatted.errors[0]);

    // Also log them to the console.
    if (typeof console !== "undefined" && typeof console.error === "function") {
        for (var i = 0; i < formatted.errors.length; i++) {
            console.error(stripAnsi(formatted.errors[i]));
        }
    }

    // Do not attempt to reload now.
    // We will reload on next success instead.
}
