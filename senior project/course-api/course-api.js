// Created by Cameron Casselman
//REST API endpoints connecting to MySQL DB for course scheduling app to consume

const express = require('express');
const mysql = require("mysql");

const app = express();
const port = 3000;

const queryString = 'select * from courses where courses.title LIKE " CC%"';

app.use(express.json());

//database credentials
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'user',
    password : 'password',
    database :  'coursescheduling',
})

//enable cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//get course subjects
//consuming this endpoint will return json about course subjects
app.get('/getCourseSubjects', function(req, res, next) {
    const query = 'SELECT * from departments' //expecting id, code, name

    connection.query(query, function (error, results, fields){
        if(error) throw error;
        res.send(results);
    });
});

app.post('/getClasses', function(req,res){
    //console.log(req.body);
    query = formatClassQueryString(req.body)
    connection.query(query, function (error, results, fields){
        if(error) throw error;
        res.send(results);
    });
})

//query for course subjects and attributes

function formatClassQueryString(json) {
    let queryString = "select * from courses join departments using(departmentid) join course_instructor using(courseID) join instructors using(instructorID) where ";
    //loop for length of subjects appending query strings to end of query

    for(var i=0; i<json.subjects.length; i++) {
        if(i == json.subjects.length -1)
            queryString += "departmentID = " + json.subjects[i];
        else    
            queryString += "departmentID = " + json.subjects[i] + " or ";
    } 
    //loop for the length of attributes. Append attribute id for each selected
    for(var i=0; i<json.attributes.length;i++) {
            
        queryString += ' and courses.title like "' + json.attributes[i] + ' %"'; 
    } 

    return queryString;
}

app.listen(port, () => console.log(`Listening on port ${port}`));