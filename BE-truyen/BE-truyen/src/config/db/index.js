const mongoose = require('mongoose');

async function connect() {
    try{
        await mongoose.connect('mongodb://localhost:27017/Read_book');
        console.log('Kết nối thành công !!!!!!!!!!!!!!!!');
    }
    catch(err){
        console.log('LỖi rồi , fix đi');
    }
}

module.exports = {connect};