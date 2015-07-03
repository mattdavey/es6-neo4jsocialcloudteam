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

var persist = new Persistence(db);

persist.cleanUp(function() {
  persist.save(fred, "Person", function() {
    persist.save(joe, "Person", function() {
      persist.save(companyA, "Company", function() {
        persist.relationship(fred, "Works With", joe, function() {
          persist.relationship(fred, "Works for", companyA)
        });
      });
    });
  });
});
