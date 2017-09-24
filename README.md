# Minimal ReactJS HMR boilerplate

### Setting up ReactJS + Webpack 3 HMR + React Hot Loader 3


This tutorial assumes that you know the basics of [ReactJS](https://facebook.github.io/react/), how [webpack](https://webpack.js.org/) ([a module bundler](https://medium.freecodecamp.org/javascript-modules-part-2-module-bundling-5020383cf306)) works, and what [hot reloading](https://www.youtube.com/watch?v=xsSnOQynTHs) is. We will be using [Yarn](https://yarnpkg.com) to manage our packages but feel free to use this [cheatsheet](https://shift.infinite.red/npm-vs-yarn-cheat-sheet-8755b092e5cc) if you prefer the good ol' [npm](https://www.npmjs.com/).

We will be using the latest versions of all the packages necessary to get up and running with ReactJS with hot module replacement (hmr) enabled in the most simplest way possible. Note that there are different ways to configure webpack's in-built HMR coupled with react hot loader (we will see what this is shortly) but our focus here is to avoid complexity and tight version dependencies and to simply have a bare minimum boilerplate required to start building a client-side Reactjs application with HMR enabled to save our development time.

The exact versions as of this writing for the above libraries are-
* react - 15.6.1
* webpack - 3.6.0
* react hot loader - 3.0.0 beta

#### Step 1: Adding react, webpack and it's friends.
---
If you do not have Yarn installed then run the following command on your Mac. This will also install node if not already installed. Assuming you have [HomeBrew](https://brew.sh/) installed, run:
```bash
brew install yarn
```

Let's start by creating a directory to add all our code in.
```bash
mkdir react-hmr-boilerplate && cd react-hmr-boilerplate
```

Initialize the repository and fill in the details as required in the interactive session that follows.
```bash
yarn init
```
This would have now created a *package.json* file in your current folder *react-hmr-boilerplate*.

Let's add webpack and [webpack-dev-server](https://webpack.js.org/guides/development/#using-webpack-dev-server).
```bash
yarn add --dev webpack webpack-dev-server
```

Let's also add [Babel](https://babeljs.io/) plugins while we are at it which are needed to transpile code written in jsx syntax that we will be adding in later.
```bash
yarn add --dev babel-core babel-loader babel-preset-es2015 babel-preset-react
```

And finally add React by running the following command:
```bash
yarn add react react-dom
```

We'd also need HTML Webpack plugin to simplify the creation of HTML files to serve the webpack bundles.
```bash
yarn add --dev html-webpack-plugin
```

And finally, let's add [css-loader](https://webpack.js.org/loaders/css-loader/) and [style-loader](https://webpack.js.org/loaders/style-loader/) webpack plugins for the minor css we will be adding along the way to simplify testing HMR.
```bash
yarn add --dev css-loader style-loader
```

Phew... let's get to the fun part of configuring webpack now.

Webpack is fed via a [configuration](https://webpack.js.org/configuration/) object. It is a common practice to keep the configuration for development and production in separate files. Since we are concerned with setting up only the local development environment in this tutorial, let's go ahead and create a file name *webpack.config.js*.
```bash
touch webpack.config.js
```

Update its contents with an empty webpack config object.
```json
module.exports = {
}
```

Let's create *src* directory and then *index.html* within it. Update it's contents with the following html.
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Simply React HMR Setup</title>
    </head>
    <body>
        <div id="root">
        </div>
    </body>
</html>
```

And finally let's add *index.js* in *src* folder alongside *index.html* which acts as the entry point to our app. Add the following to *index.js*.
```jsx
import React from 'react';
import ReactDom from 'react-dom';
import App from './app/App.jsx';

const render = Component => {
    ReactDom.render(
    <Component />,
    document.getElementById('root')
    );
}

render(App);
```

Note that we import *App* from App.jsx. Go ahead and create a folder named *app* within *src* and then *App.jsx* inside *app* folder. Copy the contents for *App.jsx* and *app.css* from this repository.

Make sure your directory structure within the root of the project looks like the one shown below. If it doesn't match then go over the contents of this repository again and add the missing parts.

```
-- src
   -- app
        App.jsx
        app.css
   index.html
   index.js
.babelrc
package.json
webpack.config.js
```

#### Step 2: Configuring Webpack to enable in-built HMR
---
First, let's modify *webpack.config.js* to use the plugins we have installed. Open *webpack.config.js* and add the following.
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: 'index.html',
    inject: 'body'
})
```
Here *template* needs to point to the *index.html* of your project. In this repository, it is in the *src* directory. Also, add a *plugins* key to the webpack config object with an array as it's value containing the HTML webpack plugin as shown below.
```json
plugins: [HtmlWebpackPluginConfig]
```

Now, we have to update the *entry* section. There are several ways to add paths to the entry section which basically tells webpack the first point to start looking at our app from. There can be multiple entry points. But for simplicity, let's say we have only one entry point and it is the file *./src/index.js*.
```json
entry: {
    app: './src/index.js',
}
```

Every webpack config object needs have at least an entry section and an output section. Output is where you tell the webapck where to place the bundle created, optionally giving it a name as well. Make sure you add *path* unless you decide to use absolute paths.
```bash
yarn add --dev path
```
Use path in  *webpack.config.js*
```bash
const path = require('path');
```
Add the output entry to webpack config object in *webpack.config.js*.
```json
output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
}
```
Here 'name' resolves to 'app' and the bundle created is stored in dist folder within the root project directory.

Let's add rules telling webpack which files to use the loaders on.

We need babel-loader to transpile our jsx and js files and style-loader and css-loader to work on our css files. Syntax of adding rules to webpack has changed from webpack v1 to v3. Rules are now added as shown below.
```json
module: {
    rules: [
        {
            test: /\.jsx?$/,
            exclude: [/node_modules/],
            use: ['babel-loader']
        },
        {
            test: /\.css$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: { modules: true },
                }
            ],
        },
    ],
}
```

Create a new file *.babelrc* in the root folder of the project and update it's content.
```json
{
	"presets": [
		["es2015", { "modules": false }],
		"react"
	]
}
```

We are pretty much done configuring webpack except for the main part where we have to enable the built-in HMR support. There are, again, several ways of enabling this but the most simplest one is to use inline flag when starting up webpack. Go ahead and add *scripts* section to *package.json*
``` json
"scripts": {
    "start": "webpack-dev-server --hot",
    "build": "webpack"
}
```
To start up the dev server, just run:
```bash
yarn start
```
The inline --hot flag tells webpack to replace updated modules without restarting the server.

Add *devServer* entry into the webpack object in *webpack.config.js*.
```json
devServer: {
    contentBase: './src/',
    hot: true
}
```
contentBase should to point to the directory containing *index.html*. In this repository, it is inside *src* and hence the path above.

#### Step 3: Plugging in React Hot Loader
---

[React Hot Loader](https://github.com/gaearon/react-hot-loader) is a plugin that allows React components to be live reloaded without the loss of state. We will be using it here to along with Webpack but it works with other bundlers that supports HMR as well. It was created by the one and only, [Dan Abramov](https://twitter.com/dan_abramov).

Let's first add React Hot Loader to our project.
```bash
yarn add --dev react-hot-loader@next
```
This will add React Hot Loader v3 beta version (as of this writing).

Configuring it is very simple. Since we are using Babel,let's update *.babelrc* to the the following.
```json
{
	"presets": [
		["es2015", { "modules": false }],
		"react"
	],
	"plugins": [ "react-hot-loader/babel" ]
}
```

Now, add the following import to the top of *index.jsx* since that where the root of our app is present.

```js
import 'react-hot-loader/patch';
```

React hot loader provides a component called *AppContainer* which needs to be wrapped outside the root component to enable hot reloading and we also need to tell it that whenever our root component or any of its child components get updated, then re-render the whole app. This is done by adding a snippet at the end of entry file, *index.js* in our case. Update the content of *index.js* to the following.

```jsx
import 'react-hot-loader/patch';
import React from 'react';
import ReactDom from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './app/App.jsx';

const render = Component => {
    ReactDom.render(
      <AppContainer>
        <Component />
      </AppContainer>,
      document.getElementById('root')
    );
}

render(App);

if (module.hot) {
    module.hot.accept('./app/App.jsx', () => { render(App) });
}
```

That's it! We are done with all the configuration. Let's test it now!

From the root directory of the project, run:
```bash
yarn start
```

This will start the server on http://localhost:8080/ . Open the browser and test HMR by adding some text into the textbox and then changing the background color or heading or whatever you'd like in App.jsx. You'll notice that webpack replaced the updated module without restarting the server and react hot loader helped mantain the *App* component's state by keep the text that was entered in the textbox as it is and updating the app without really refreshing the browser! Voila!

If you have a different setup and are looking for different types of configuring webpack then check out this nice tutorial on [getting started with React Hot Loader](https://gaearon.github.io/react-hot-loader/getstarted/) by Dan.

This was a minimal boilerplate to start developing a simple client-side ReactJS application with HMR support.

This tutorial will be updated with steps on getting up and running with React Router in the most simplest way.