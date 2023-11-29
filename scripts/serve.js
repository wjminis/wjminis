import fs from "node:fs";
import path from "node:path";
import express from "express";
import child from "node:child_process";

const target = path.join("packages", process.argv[2]);
if (!fs.existsSync(target)) {
  console.error(`Target directory ${target} does not exist.`);
  process.exit(1);
}

child.exec(
  `nodemon --watch ${path.join(target, "src")} --ext ts,json --exec "pnpm -C ${target} run build"`,
  (err, stdout, stderr) => {
    if (err) return console.error(err);
    console.log(stdout);
    console.error(stderr);
  },
);

express()
  .use(express.static(target))
  .listen(8888, () => console.log(`Listening at http://localhost:8888/`));
