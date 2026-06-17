// Registers the extension-resolver hook off-thread for the test run.
//   node --import ./test/register-hooks.mjs --test "test/*.test.mjs"
import { register } from "node:module";
register("./ext-resolve-hook.mjs", import.meta.url);
