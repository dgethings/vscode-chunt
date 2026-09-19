//@ts-check

"use strict";

const path = require("path");

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const extensionConfig = {
	target: "node", // VS Code extensions run in a Node.js context
	mode: "none", // production mode is set when packaging (npm run package)

	entry: "./src/extension.ts",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "extension.js",
		libraryTarget: "commonjs2",
	},
	externals: {
		vscode: "commonjs vscode", // the vscode-module is created on the fly and must be excluded
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "ts-loader",
					},
				],
			},
		],
	},
	devtool: "nosources-source-map",
	infrastructureLogging: {
		level: "log", // enables logging required for problem matchers
	},
};

module.exports = [extensionConfig];
