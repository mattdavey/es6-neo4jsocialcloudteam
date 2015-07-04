'use strict';

require("babel/register");

var Main = require('./test/src/Main.es6')

var test = new Main().run()
