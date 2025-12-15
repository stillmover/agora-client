import type { RsbuildConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

type PresetOptions = {
  mode: "development" | "production";
  analyze?: boolean;
};

export function reactAppPreset({ mode, analyze }: PresetOptions): RsbuildConfig {
  const isDev = mode === "development";
  const isProd = mode === "production";

  const prodChunkSplit: RsbuildConfig["output"] extends infer O
    ? O extends { chunkSplit?: any }
      ? O["chunkSplit"]
      : any
    : any = {
    strategy: "split-by-experience",
    override: {
      chunks: "all",
      minSize: 20_000,
      maxInitialRequests: 30,
      maxAsyncRequests: 30,
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
          name: "react",
          priority: 50,
          enforce: true,
        },
        router: {
          test: /[\\/]node_modules[\\/](react-router|react-router-dom)[\\/]/,
          name: "router",
          priority: 40,
        },
        tanstack: {
          test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
          name: "tanstack",
          priority: 35,
        },
        utils: {
          test: /[\\/]node_modules[\\/](lodash|dayjs|axios|date-fns)[\\/]/,
          name: "utils",
          priority: 20,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          priority: 10,
          reuseExistingChunk: true,
        },
        common: {
          name: "common",
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
  };

  const devChunkSplit: any = {
    strategy: "split-by-experience",
    override: {
      chunks: "all",
      minSize: 80_000,
      maxInitialRequests: 10,
      maxAsyncRequests: 10,
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
          name: "react",
          priority: 50,
          enforce: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          priority: 10,
          reuseExistingChunk: true,
        },
      },
    },
  };

  return {
    plugins: [
      pluginReact({
        fastRefresh: isDev,
        swcReactOptions: {
          development: isDev,
          refresh: isDev,
        },
        enableProfiler: isProd,
        splitChunks: true,
      }),
    ],

    performance: {
      bundleAnalyze: analyze ? { openAnalyzer: true } : undefined,
      chunkSplit: isProd ? prodChunkSplit : devChunkSplit,
    },

    output: {
      target: "web",
      minify: isProd,
      sourceMap: isDev,

      cleanDistPath: true,

      filename: {
        js: "assets/js/[name].[contenthash:8].js",
        css: "assets/css/[name].[contenthash:8].css",
        image: "assets/img/[name].[hash][ext]",
        font: "assets/fonts/[name].[hash][ext]",
      },
    },
  };
}
