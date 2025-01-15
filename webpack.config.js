import fs from 'fs';
import path, { dirname } from 'path';
import webpack from 'webpack';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envFilePath = path.resolve(__dirname, './.env');
dotenv.config({ path: envFilePath });

export default {
  entry: "./src/index.tsx",
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,  // Matches .ts and .tsx files
        use: 'ts-loader',  // Use ts-loader to transpile TypeScript files
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,  // Handle .css files
        use: ['style-loader', 'css-loader'],  // Load CSS files
      },
    ],
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    historyApiFallback: true,
    server: {
      type: 'https',
      options: {
        key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
        cert: fs.readFileSync(path.resolve(__dirname, 'server.crt')),
      },
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      return middlewares;
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:3001'),
      'CLIENT_ID': JSON.stringify(process.env.CLIENT_ID || ''),
      'REDIRECT_URI': JSON.stringify(process.env.REDIRECT_URI || 'http://localhost:3000/start'),
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: true,
      publicPath: process.env.PUBLIC_URL || '/',
    }),
  ],
};