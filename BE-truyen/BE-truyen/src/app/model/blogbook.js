const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongoose_delete = require('mongoose-delete');
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const blogbooks = new Schema({
    name : {type : 'String' , minLength : 1},
    Chapter:{type:'String', maxLength:1},
    img : {type:'String', maxLength:255},
    slug : {type:'String',slug :'name' ,unique : true} ,
    deleted : {type:'Boolean', default:false ,}
  },
  {
    timestamps: true,
    collection: 'blogbooks'
  },
);
  blogbooks.plugin(mongoose_delete,  {
    overrideMethods:true ,
   deletedAt:true,
 
 });
module.exports = mongoose.model('blogbooks',blogbooks);