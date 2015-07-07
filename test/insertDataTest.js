import Person from "../es6/Person";
import Company from "../es6/Company";
import Persistence from "../es6/Persistence";
import assert from "assert";


describe('Persistence of data and relationships', function() {
	let db = require("seraph")({
		user: 'neo4j',
		pass: 'neo4j'
	});
  
	let persist = new Persistence(db);
	let fred = new Person("Fred","Bloggs");
	let joe = new Person("Joe", "Harper");
	
	let companyA = new Company("CompanyA");
	let companyB = new Company("CompanyB");
	let companyC = new Company("CompanyC");

	// beforeEach hook
	beforeEach(function(done) {
		let p = new Promise((resolve, reject) => {
			persist.cleanUp(resolve, reject)	
		});
		   
		p.then((data) => {
			done();
		}, (err) => {
		    console.log("beforeEach ERROR: " + JSON.stringify(err));
			return done(err);
		});
	});
  
	describe('#save()', function(){
		it('should persist one person into Neo4j', function(done){
			
			let people = new Promise((resolve, reject) => {
				persist.save([fred], "Person", resolve, reject)
			});
			
			Promise.all([
				people 
			]).then((data) => {
				assert.equal(data[0][0].name, fred.name);
				assert.equal(data[0][0].firstname, fred.firstname);
				assert.equal(data[0][0].lastname, fred.lastname);
				done();
			}, (err) =>	{
				console.log(err);
				return done(err);
			});			
		})

		it('should persist a relationship between people', function(done){
		
			let people = new Promise((resolve, reject) => {
				persist.save([fred, joe], "Person", resolve, reject)
			});
		
			Promise.all([
				people
			]).then((data) => {
				console.log("Data: " + JSON.stringify(data));

				let fredWorksWith = new Promise((resolve, reject) => {
					persist.relationship(fred, "Works With", joe, resolve, reject);
				});
					  
				Promise.all([
					fredWorksWith 
				]).then((data) => {
					console.log("Relation: " + JSON.stringify(data))
					done(); 
				}, (err) => {
					console.log(err);
					done(err);
				});
			}, (err) =>	{
				console.log("ERROR: " + JSON.stringify(err));
		    	done(err);
			});			
		});
	});
});