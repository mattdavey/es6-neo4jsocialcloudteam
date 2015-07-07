import assert from 'assert' 
 
export default class Persistence {
	constructor(db) {
		this.db = db;
	}

	cleanUp(resolve, reject) {
		const cypherDeleteRelathipships = "START r=relationship(*) DELETE r;"
		const cypherDeleteNodes = "MATCH (n) DELETE (n)";
		
		this.db.query(cypherDeleteRelathipships, function(err, result) {
		if (err) reject(err);
		
		this.db.query(cypherDeleteNodes, function(err, result) {
			if (err) reject(err);
			
				resolve(true);
			});
		}.bind(this));
	}

	save(obj, nodeType, onData, onError) {
		assert.notEqual(obj, null, "obj can't be null");
		assert.notEqual(nodeType, null, "nodeType can't be null");
		
		let objArray = obj;
		if (Array.isArray(objArray) == false) {
			objArray = [obj];
		}
		
		let promises = [];
		for (let selectObj of objArray) {
			let p = new Promise((resolve, reject) => {
				this.db.save(selectObj, nodeType, function(err, node) {
					if (err) reject(err);
			
					resolve(node);
				});
				}
			);
			
			promises.push(p);
		}
		
		Promise.all(promises).then((data) => {
			onData(data)
		}, (err) => {
			onError(err)
		});
	}
	
	relationship(obj, linkType, linkObj, onData, onError) {
		assert.notEqual(obj, null, "obj can't be null");
		assert.notEqual(linkType, null, "linkType can't be null");
		assert.notEqual(linkObj, null, "linkObj can't be null");

		let objArray = linkObj;
		if (Array.isArray(objArray) == false) {
			objArray = [linkObj];
		}
		
		let promises = [];
		for (let selectObj of objArray) {
			let p = new Promise((resolve, reject) => {
				this.db.find(obj, function(err, node) {
					this.db.find(selectObj, function(err2, node2) {
						this.db.relate(node, linkType, node2, function(err3, relationship) {
							if (err3) reject(err3);
							
							onData(relationship)
						}.bind(this));
					}.bind(this));
				}.bind(this));
			}.bind(this));
			
			promises.push(p);
		}

		Promise.all(promises).then((data) => {
			onData(data)
		}, (err) => {
			onError(err)
		});
	}
}