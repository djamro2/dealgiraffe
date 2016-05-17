/**
 * Created by Daniel on 5/16/2016.
 */

var app = angular.module('DealGiraffe', ['ngResource', 'ngRoute', 'ngMaterial']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});