module.exports = {
  index: (req, res) => {
    res.render('index', {
      cache: true
    });
  }
};
