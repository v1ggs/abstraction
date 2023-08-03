#!/usr/bin/node

// Set this true, to use WordPress Coding Standards.
const IS_WP = process.env.IS_WP;

/* eslint-disable no-unused-vars */
const prepareLinters = require('./prepare-linters')(IS_WP);
const prepareUserConfig = require('./prepare-user-config')();
const prepareSrc = require('./prepare-src')();
