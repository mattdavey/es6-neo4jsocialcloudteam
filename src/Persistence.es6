export default class Persistence {
	constructor(db) {
		this.db = db;
	}

	cleanUp(func) {
	
	  const cypherDeleteRelathipships = "START r=relationship(*) DELETE r;"
	  const cypherDeleteNodes = "MATCH (n) DELETE (n)";

 	  this.db.query(cypherDeleteRelathipships, function(err, result) {
	    if (err) throw err;
	    
	    this.db.query(cypherDeleteNodes, function(err, result) {
	      if (err) throw err;
		  
		  console.log("Cleanup Done");
		  func();
	    });
	  }.bind(this));
	}

	save(person, nodeType, func) {
		this.db.save(person, nodeType, function(err, node) {
			if (err) throw err;
	
			console.log("Save " + node.id + " " + JSON.stringify(node));
			func();
		});
	}
	
	relationship(personA, linkType, personB, func) {
		this.db.find(personA, function(err, node) {
			console.log("Found " + JSON.stringify(node));
			this.db.find(personB, function(err, node2) {
				console.log("Found " + JSON.stringify(node2));
				this.db.relate(node, linkType, node2, function(err, relationship) {
					if (err) throw err;
					console.log("relationship Saved");
					if (func) func();
				});
			}.bind(this));
		}.bind(this));
	}
}