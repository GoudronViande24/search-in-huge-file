import { createHash } from "crypto";
import es from "event-stream";
import { createReadStream } from "fs";
import { exit } from "process";
import promptSync from "prompt-sync";
const prompt = promptSync();

const STRING = prompt("Password to search: ");
const FILE = prompt("File path: ");

const { mapSync, split } = es;

const hash = createHash("sha1").update(STRING).digest("hex").toUpperCase();

let ln = 0;

console.log("Searching...");

const s = createReadStream(FILE)
	.pipe(split())
	.pipe(mapSync(handleLine));

/**
 * @param {String} line 
 */
function handleLine(line) {
	// Pause
	s.pause();

	ln++;

	if (line.startsWith(hash)) {
		const leaks = line.split(":")[1];

		console.log("Found! Password:", STRING, "Hash:", hash, "Leaks:", leaks);
		s.destroy();
		exit(0);
	}

	s.resume();
}