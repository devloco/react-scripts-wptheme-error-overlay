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

// Remember some state related to hot module replacement.
// var isFirstCompilation = true;
// var hasCompileErrors = false;

export function clearOutdatedErrors() {
    // Clean up outdated compile errors, if any.
    if (typeof console !== "undefined" && typeof console.clear === "function") {
        if (hasCompileErrors) {
            console.clear();
        }
    }
}

export function handleSuccess() {
    // Successful compilation.
    clearOutdatedErrors();

    // isFirstCompilation = false;
    // hasCompileErrors = false;
}

export function handleWarnings(warnings) {
    clearOutdatedErrors();

    // var isHotUpdate = !isFirstCompilation;
    // isFirstCompilation = false;
    // hasCompileErrors = false;

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

    // // Attempt to apply hot updates or reload.
    // if (isHotUpdate) {
    //     tryApplyUpdates(function onSuccessfulHotUpdate() {
    //         // Only print warnings if we aren't refreshing the page.
    //         // Otherwise they'll disappear right away anyway.
    //         printWarnings();
    //         // Only dismiss it when we're sure it's a hot update.
    //         // Otherwise it would flicker right before the reload.
    //         ErrorOverlay.dismissBuildError();
    //     });
    // } else {
    //     // Print initial warnings immediately.
    //     printWarnings();
    // }
    printWarnings();
}

export function handleErrors(errors) {
    clearOutdatedErrors();

    // isFirstCompilation = false;
    // hasCompileErrors = true;

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
