const path = require('path');
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const slugify = require('slugify');
const port = 3000;
const db = require('./config/db');
const methodOverride = require('method-override')
app.use(methodOverride('_method'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
const route = require('./routes/index')


db.connect();

app.use(express.static(path.join(__dirname,'public')));
// Thiết lập engine của template
app.engine('hbs', handlebars.engine(
  {extname : '.hbs',
    helpers : {
      sum : (a,b) => a + b,
      chap: a => {
        const matches = a.match(/\d+/g);
        return matches ? matches[0] : null;
      },
      
    }
  }
));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../src/resources/views'));

route(app);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
