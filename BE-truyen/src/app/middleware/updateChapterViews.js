const Chapters = require('../model/readbook');

const updateChapterViews = async (req, res, next) => {
  const { slug, id } = req.params;
  const Chapter = Chapters(slug);
  const userIP = req.ip;

  try {
    const chapter = await Chapter.findOne({ slug: id });
    if (!chapter) return res.redirect(`/truyen/${slug}`);

    // Kiểm tra xem người dùng đã xem chương này chưa
    const hasViewed = req.userId
      ? chapter.viewedBy.includes(req.userId)
      : chapter.viewedByIP.includes(userIP);

    if (!hasViewed) {
      chapter.views += 1;
      if (req.userId) {
        chapter.viewedBy.push(req.userId);
      } else {
        chapter.viewedByIP.push(userIP);
      }
      await chapter.save();
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = updateChapterViews;
