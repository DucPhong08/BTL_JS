class SearchsController{
    index(req, res, next){
        res.json(req.body)
    }
    detail(req, res, next){
        res.send('Đọc Truyện thôi');
    }
}

module.exports = new SearchsController