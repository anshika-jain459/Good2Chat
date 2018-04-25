var Sequelize = require('sequelize');

var con = new Sequelize('dbnode', 'root', '',{
	host: 'localhost',
	dialect: 'mysql',
	pool:{
		max: 5,
	    min: 0,
	    acquire: 80000,
	    idle: 1000
	}
}); 

var dailyEntry = con.define('dailyTables', {//making a new table
	identifier: {
		type: Sequelize.STRING,
		unique: false, // all titles are unique
		//if you try to insert something thats already existing, 
		//sq will throw an error
		allowNull: false,
	},
	dbmeds: {type: Sequelize.BOOLEAN},
	dbactive: {type: Sequelize.INTEGER},
	dbsleep: {type: Sequelize.INTEGER},
	dbrelax: {type: Sequelize.BOOLEAN},
	dbrate: {type: Sequelize.INTEGER}, 
	dbdesc: {type: Sequelize.TEXT}
}, {
	timestamps: true
}); 

con.sync({
//	force: true,//clears out old tables of same name
	logging: console.log
}).then(function(){
	dailyEntry.create({
		identifier: 'identifier',
		dbmeds: 0,
		dbactive: 1,
		dbsleep: 7,
		dbrelax: 1,
		dbrate: 10, 
		dbdesc: "hello"
	}).then(function (stuff){
	});

	console.log("connected!!");	
	
}).catch(function(error){
		console.log("connection error: " + error);
});

module.exports = {
	con,
	dailyEntry
}