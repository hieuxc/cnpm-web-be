module.exports = async (req, res, next) => {
  try {
    let auth = req.headers.authorization;
    if (!auth || auth.search('Bearer ') !== 0) return res.status(401).json({ e: 1, m: 'Token not found' });
    let token = auth.split(' ')[1];
    let userInfo = sails.helpers.jwt.verify(token);
    let user = await Admin.findOne({ idAdmin: userInfo.sid });
    if (!user) return res.status(401).json({ e: 1, m: 'Token is invalid' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ e: 1, m: 'Token is invalid' });
  }
}