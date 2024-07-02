const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const readbook = new Schema({
    chapter:{type:'String', minLength:1},
    content: {type:'String' , minLength: 1},
    Chap : {type:'String', minLength:1},
    slug : {type:'String',slug :'chapter'} ,
  },
  {
    timestamps: true,
    versionKey:false
  },);

const getReadbookModel = (collectionName) => {
    return mongoose.model('readbook', readbook, collectionName);
};
module.exports = getReadbookModel;