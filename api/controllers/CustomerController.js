/**
 * CustomerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const bcrypt = require('bcryptjs');
module.exports = {
  login: async (req, res) => {
    try {
      let { phone, password } = req.body
      if (!phone || !password) return res.json({ e: 1, m: "Phone or password invalid" })
      let findCustomer = await Customer.findOne({ phone })
      let checkPassword = await bcrypt.compareSync(password, findCustomer.password)
      if (!findCustomer || !checkPassword)
        return res.json({ e: 1, m: "Phone or password invalid" })
      let token = sails.helpers.jwt.sign.with({ user: { sid: findCustomer.idCustomer } })
      return res.json({ e: 0, data: findCustomer })
    } catch (error) {
      return res.json({ e: 1, m: error })
    }
  },
  changeProfile: async (req, res) => {
    try {
      await Customer.update({ idCustomer: req.body.idCustomer }).set({ ...req.body })
      return res.json({ e: 0 })
    } catch (error) {
      return res.json({ e: 1, m: error })
    }
  },
  changePassword: async (req, res) => {
    try {
      let findCustomer = await Customer.findOne({ idCustomer: req.body.idCustomer })
      if (!findCustomer) return res.json({ e: 1, m: 'error' })
      let checkPassword = await bcrypt.compareSync(req.body.password, findCustomer.password)
      if (checkPassword) {
        let newPassword = await sails.helpers.hashPassword(req.body.newPassword)
        await Customer.update({ idCustomer: req.body.idCustomer }).set({ password: newPassword })
        return res.json({ e: 0 })
      } else return res.json({ e: 1, m: 'error' })
    } catch (error) {
      return res.json({ e: 1, m: error })
    }
  },
  // changePassword: async (req, res) => {
  //   try {

  //   } catch (error) {
  //     return res.json({ e: 1, m: error })
  //   }
  // },
};

