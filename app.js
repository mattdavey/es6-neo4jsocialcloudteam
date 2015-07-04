'use strict';

require("babel/register");

var Person = require('./src/Person.es6');
var Persistence = require('./src/Persistence.es6');
var Company = require('./src/Company.es6');

var db = require("seraph")({
  user: 'neo4j',
  pass: 'neo4j'
});

var fred = new Person("Fred","Bloggs");
var joe = new Person("Joe", "Harper");

var companyA = new Company("CompanyA");
var companyB = new Company("CompanyB");
var companyC = new Company("CompanyC");

var persist = new Persistence(db);

persist.cleanUp(function() {
  persist.save([fred, joe], "Person", function() {
    persist.save([companyA, companyB, companyC], "Company", function() {
      persist.relationship(fred, "Works With", joe, function() {
        persist.relationship(fred, "Worked for", [companyA, companyB, companyC], function() {
          persist.relationship(joe, "Worked for", [companyB, companyC])
        });
      });
    });
  });
});
