const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const detailBook = new Schema({
    name : {type : 'String' , minLength : 1},
    author :{type : 'String' , minLength : 1},
    description :{type : 'String' , minLength : 1},
    
    category :{type : 'String' , minLength : 1},
    
    chapters: [{ type: String, minLength: 1, required: true }]

    ,
    status :{
        reads:{type : 'String' , minLength:1},
        likes :{type : 'String' , minLength:1},
        cont :{type : 'String' , minLength:1},
        pau :{type : 'String' , minLength:1},
        monitor :{type : 'String' , minLength:1},
    },
    img : {type : 'String' , minLength:1},
    slug : {type:'String',slug :'name',unique :true}, 
    sluga : {type:'String',slug :'chapters',unique :true}, 

  },
  {
    timestamps: true,
    collection: 'detailbooks'
  });
  detailBook.plugin(mongoose_delete,  {
     deletedAt:true,
     overrideMethods: true ,
    
  });

module.exports = mongoose.model('detailbooks',detailBook);