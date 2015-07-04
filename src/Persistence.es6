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

	save(obj, nodeType, func) {
		let objArray = obj;
		if (Array.isArray(objArray) == false) {
			objArray = [obj];
		}
		
		let promises = [];
		for (let selectObj of objArray) {
			let p = new Promise((resolve, reject) => {
				this.db.save(selectObj, nodeType, function(err, node) {
					if (err) reject(err);
			
					console.log("Save " + node.id + " " + JSON.stringify(node));
					resolve(node);
				});
				}
			);
			
			promises.push(p);
		}
		
		Promise.all(promises).then(func, (err) => {console.log(err)});
	}
	
	relationship(obj, linkType, linkObj, func) {
		let objArray = linkObj;
		if (Array.isArray(objArray) == false) {
			objArray = [linkObj];
		}
		
		let promises = [];
		for (let selectObj of objArray) {
			let p = new Promise((resolve, reject) => {
				this.db.find(obj, function(err, node) {
					console.log("Found " + JSON.stringify(node));
					this.db.find(selectObj, function(err, node2) {
						console.log("Found " + JSON.stringify(node2));
						this.db.relate(node, linkType, node2, function(err, relationship) {
							if (err) throw err;
							console.log("relationship Saved");
							if (func) func();
						});
					}.bind(this));
				}.bind(this));
			});
			
			promises.push(p);
		}

		Promise.all(promises).then((data) => {func}, (err) => {
				console.log(err);
				throw err;
			});
	}
}