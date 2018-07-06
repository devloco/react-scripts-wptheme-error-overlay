/**
 * Copyright (c) 2018-present, devloco
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

const path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        path: __dirname,
        filename: "wpThemeErrorOverlay.js",
        library: "wpthemeErrorOverlay",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, "./src"),
                use: "babel-loader"
            }
        ]
    }
};
