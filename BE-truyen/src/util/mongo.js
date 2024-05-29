module.exports = {
    multiple : function (mongoosesArrays) {
        return mongoosesArrays.map(mongooseArray => mongooseArray.toObject());
    },
    mongooseToObject : function (mongoose){
        return mongoose ? mongoose.toObject() : mongoose ;
    }
}