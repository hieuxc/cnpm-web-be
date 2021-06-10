
const bcrypt = require('bcryptjs');
module.exports = {
  login: async (req, res) => {
    try {
      let { phone, password } = req.body
      if (!phone || !password) return res.json({ e: 1, m: "Phone or password invalid" })
      let findAdmin = await Admin.findOne({ phone })
      let checkPassword = await bcrypt.compareSync(password, findAdmin.password)
      if (!findAdmin || !checkPassword)
        return res.json({ e: 1, m: "Phone or password invalid" })
      let token = sails.helpers.jwt.sign.with({ user: { sid: findAdmin.idAdmin } })
      return res.json({ e: 0, token })
    } catch (error) {
      return res.json({ e: 1, m: error })
    }
  },

};

