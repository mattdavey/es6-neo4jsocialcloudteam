import Person from "../src/Person";
import Company from "../src/Company";
import Persistence from "../src/Persistence";
import assert from "assert";

describe('Persistence', function(){
  let db = require("seraph")({
    user: 'neo4j',
    pass: 'neo4j'
  });
  
  let persist = new Persistence(db);
  let fred = new Person("Fred","Bloggs");


  beforeEach(function(done){
		let p = new Promise((resolve, reject) => {
		  persist.cleanUp(resolve, reject)	
		   });
		   
		p.then((data) => {
			console.log("CleanUp Done");
			done();
		}, (err) => {
		    console.log(`error: ${err}`)
        done(err)
		});
  })

  
  describe('#save()', function(){
    it('should persist one person into Neo4j', function(){

		let people = new Promise((resolve, reject) => {
			persist.save([fred], "Person", resolve, reject)});

  		Promise.all([
  			people 
  		]).then((data) => {
        assert.equal(data.name, fred.name);
        assert.equals(data.firstname, fred.firstname);
        assert.equals(data.lastname, fred.lastname);
  		}, (err) =>	{
  			console.log(err)
        throw err;
  		});			
    })
  })
})
