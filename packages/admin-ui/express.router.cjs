const express = require('express');
const path = require('path')
const fs = require('fs');
const distPath = path.join(__dirname,'dist');
const app = express.Router();

const sendPage = (page) => (req,res) => {
    const filePath = path.join(distPath,page,'index.html')
    let html = fs.readFileSync(filePath).toString();
    res.set('content-type','text/html');
    const pageContext = {
        user:req.user,
        page:page,
    }
    html = html.replace(`window.pageContext = {}`,`window.pageContext = ${JSON.stringify(pageContext,null,2)}`)
    res.send(html);
}

app.get('/dashboard/*',sendPage('dashboard'))
app.get('/login',sendPage('login'))
app.get('/register',sendPage('register'))

app.use(express.static(distPath));

app.get('/',(req,res) =>{
    res.redirect('/dashboard/');
})

module.exports = app;