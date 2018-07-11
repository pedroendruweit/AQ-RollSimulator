'use strict';

var path = require('path');

module.exports = function(grunt) {
  require('custdev-sapui5-infra-util/lib/grunt/load-grunt-config')(grunt, {
    overridePath: path.join(__dirname, 'grunt/config')
  });

};
