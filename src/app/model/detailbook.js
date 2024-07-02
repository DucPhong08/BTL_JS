const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');
const paginate = require('mongoose-paginate-v2');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const detailBook = new Schema({
    name : {type : 'String' , minLength : 1,require},
    author :{type : 'String' , minLength : 1,require},
    description :{type : 'String' , minLength : 1,require},
    category :{type : 'String' , minLength : 1,require},
    status :{
        
        type : 'String',
        default: "Còn Tiếp"
    },
    img : {type : 'String' , minLength:1,require},
    slug : {type:'String',slug :'name',unique :true}, 
    
    followersCount: { type: Number, default: 0 }, 
    latestChapter: String,
    latestChapterTime: String,
    likesCount: { type: Number, default: 0 }, 
    poster : {type : 'String' , minLength : 1,require},
    lastReadChapterId : Number,
    views : Number,
    comment : { type: Number, default: 0 },
    Chapter : String,
    updateat : String
  },
  {
    timestamps: true,
    collection: 'detailbooks'
  });
  detailBook.plugin(mongoose_delete,  {
     deletedAt:true,
     overrideMethods: true ,
    
  });
  detailBook.plugin(paginate);


module.exports = mongoose.model('detailbooks',detailBook);