const path = require('path');
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const slugify = require('slugify');
const paginate = require('express-paginate');
const cookieParser = require('cookie-parser');
const port = 3000;
const db = require('./config/db');
const methodOverride = require('method-override')
const JWT_SECRET = 'your_jwt_secret';
app.use(methodOverride('_method'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
const route = require('./routes/index')


db.connect();

app.use(cookieParser());

app.use(express.static(path.join(__dirname,'public')));
// Thiết lập engine của template
app.engine('hbs', handlebars.engine(
  {extname : '.hbs',
    helpers : {
      sum : (a,b) => a + b,
      chap: a => {
        const matches = a.match(/\d+/g);
        return matches ? matches[0] : 1;
      },
      time: (createdAt) => {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const difference = now - createdDate; 
        // Chuyển đổi milliseconds thành các đơn vị thời gian khác
        const seconds = Math.floor(difference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
          return `${days} ngày trước`;
        } else if (hours > 0) {
          return `${hours % 24} giờ trước`;
        } else if (minutes > 0) {
          return `${minutes % 60} phút trước`;
        } else {
          return `${seconds % 60} giây trước`;
        }
    },

    range: function(start, end) {
      const result = [];
      for (let i = start; i <= end; i++) {
          result.push(i);
      }
      return result;
  },
  eq :function(a, b) {
    return a === b;
  }
    }
  }
));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../src/resources/views'));
route(app);
app.use(paginate.middleware(10, 50));
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
