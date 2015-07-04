import Person from "../../src/Person";
import Company from "../../src/Company";
import Persistence from "../../src/Persistence";

export default class Main {
	constructor() {
		this.db = require("seraph")({
		  user: 'neo4j',
		  pass: 'neo4j'
		});
		
		this.persist = new Persistence(this.db);

		this.fred = new Person("Fred","Bloggs");
		this.joe = new Person("Joe", "Harper");
		
		this.companyA = new Company("CompanyA");
		this.companyB = new Company("CompanyB");
		this.companyC = new Company("CompanyC");
		
	}
	
	run() {
		let p = new Promise((resolve, reject) => {
			this.persist.cleanUp(resolve, reject)	
		   });
		   
		p.then((data) => {
			console.log("CleanUp Done");
			this.insertData();
		}, (err) => {
		    console.log(`error: ${err}`)
		});
	}
	
	insertData() {
		let people = new Promise((resolve, reject) => {
			this.persist.save([this.fred, this.joe], "Person", resolve, reject)});
		let companies = new Promise((resolve, reject) => {
		    this.persist.save([this.companyA, this.companyB, this.companyC], "Company", resolve, reject)});

		Promise.all([
			people, 
			companies
		]).then((data) => {
			console.log("Successfully inserted data");
			this.buildRelationships();
		}, (err) =>	{
			console.log(err)
		});			
	}
	
	buildRelationships() {
		let fredWorksWith = new Promise((resolve, reject) => {
			this.persist.relationship(this.fred, "Works With", this.joe, resolve, reject);
		});
		let fredWorkedFor = new Promise((resolve, reject) => {
			this.persist.relationship(this.fred, "Worked for", [this.companyA, this.companyB, this.companyC], resolve, reject);
		});
		let joeWorkedFor = new Promise((resolve, reject) => {
			this.persist.relationship(this.joe, "Worked for", [this.companyB, this.companyC], resolve, reject);
		});
			  
		Promise.all([
			fredWorksWith, 
			fredWorkedFor,
			joeWorkedFor
		]).then((data) => 
			{console.log("Successfully inserted relationships")
		}, (err) => 
			{console.log(err)
		});			
	}
}