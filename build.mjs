import esbuild from 'esbuild'
import {glob} from 'glob'
const entryPoints = glob.sync('./app/javascript/**/*.ts')

/* ビルド後の処理 */
const onEndPlugin = {
  name: 'on-end',
  setup(build) {
    build.onEnd((result) => {
      console.log(`build ended with ${result.errors.length} errors`);
    });
  },
};

const config = {
  plugins: [onEndPlugin],
  entryPoints,
  outdir: 'app/assets/builds',  // ビルド後の出力先
  platform: 'browser',  // ブラウザ向けのビルド
  external: [],
  bundle: true,
  publicPath: `${process.env.CDN_HOST ?? ""}/assets`,
  sourcemap: true,
  target: ["safari12", "ios12", "chrome92", "firefox88"],  // 対象ブラウザ
}

const ctx = await esbuild.context(config);

// watchモードの場合は、watchモードの設定を追加
if (process.argv.includes('--watch')) {
  await ctx.watch();
} else {
  await ctx.rebuild();
  process.exit(0);
}
