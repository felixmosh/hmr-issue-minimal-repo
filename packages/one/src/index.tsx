import Koa from "koa";
import * as path from "path";
import KoaWebpack, { Options } from "koa-webpack";
import mount from "koa-mount";
import KoaStatic from "koa-static";

(async () => {
  const koaApp = new Koa();

  const options: Options = {
    config: require("../webpack.config.client.js"),
  };

  const koaWebpack = await KoaWebpack(options);

  koaApp.use(koaWebpack);

  koaApp.listen(5000, () => {
    console.log("Listening on port 80");
  });

  koaApp.use(mount("/", KoaStatic("./assets")));
})();
