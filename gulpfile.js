const gulp = require("gulp");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const exampleDir = path.resolve(__dirname, "./example/miniprogram/wx-qr");
const outputDir = path.resolve(__dirname, "./dist");

function copy(exts) {
  const srcPath = exts.map((ext) => `${exampleDir}/**/*.${ext}`);
  return gulp.src(srcPath).pipe(gulp.dest(outputDir));
}
async function tsCompiler() {
  await exec(`npx tsc --declaration`);
}
gulp.task("default", async (cb) => {
  await tsCompiler();
  copy(["wxss", "wxml", "json"]);
  cb();
});
