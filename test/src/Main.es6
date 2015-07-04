import Person from "../../src/Person";
import Company from "../../src/Company";
import Persistence from "../../src/Persistence";

export default class Main {
	run() {

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
	}
}