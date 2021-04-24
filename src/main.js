const express = require('express');
const expressHbs = require('express-handlebars');
const visualize = require('./visualize');
const PORT = 8080;
const app = express();

app.engine('hbs', expressHbs ({
    extname: 'hbs',
    defaultLayout: 'main.hbs',
}));

//static folders
app.use(express.static(__dirname + '/public'));   //For CSS
app.use(express.static(__dirname + '/clientSideJS'));



app.get('/', (req, res) => {
    res.render('index.hbs');
});

app.listen(PORT, function() {
    console.log('App listening at port: ' + PORT);
});