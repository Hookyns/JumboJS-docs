const $fs = require("fs");
const $path = require("path");
const $less = require("less");

var nextChangeAfter = null;
var cssPath = __dirname;

function compileLessFile(file) {
	return $fs.readFile(file, "utf-8", (err, data) => {
		if (err) {
			console.log("Error ocurs while reading file '" + file
				+ "' while less compiling.");
			return;
		}

		// Compile less to css with compression
		$less.render(data, {compress: true}, (err, compiled) => {
			if (err) {
				console.log("Error ocurs while compiling less style '" + file
					+ "' in styles compiling processBlock.");
				return;
			}

			// create name for CSS file
			file = file.substr(0, file.length - 5) + ".css";

			// Write to CSS file
			$fs.writeFile(file, compiled.css, (err) => {
				if (err) {
					console.log("Error ocurs while writing compiled file '" + file
						+ "' in styles compiling processBlock.");
					return;
				}

				//noinspection JSAccessibilityCheck
				console.log("Less style was compiled into '" + file + "'");
			});
		});
	});
}

$fs.watch(cssPath, function (event, fileName) {
	if (fileName.slice(-5) !== ".less") {
		return;
	}

	// Cuz some systems emit more messages for one event
	setTimeout(function() {
		// Windows emit rename for change so all event types must be accepted
		if ((nextChangeAfter != null && (new Date()).getTime() < nextChangeAfter)) return;

		nextChangeAfter = new Date().getTime() + 1000;
		compileLessFile($path.join(cssPath, fileName)); // Fiktivní waiter
	}, 100);
});

console.log("LESS watcher is runing");