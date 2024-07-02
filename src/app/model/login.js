const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name:{
    type:String,
    require:true,
    unique:true
  },
  birthday:{
    type:String,
  },
  gender: {
    type:Number,default:0
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  following: [{ type: Schema.Types.ObjectId, ref: 'detailbooks' }],
  likedStories: [{ type: Schema.Types.ObjectId, ref: 'detailbooks' }],
  addbook: [{ type: String }],
  books: [{
        bookId: { type: String, ref: 'detailbooks' },
        lastReadChapterId: { type:Number, ref: 'readbook' },
        readChapters: [{ type: Number, ref: 'readbook' }]
    }]

},{
  collection:'user'
});

module.exports = mongoose.model('User', userSchema);