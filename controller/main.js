exports.index = function (req, res) {
    res.render('index', {
        cache: true
    });
};