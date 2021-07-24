/**
 * CartController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  addToCart: async (req, res) => {
    try {
      let { idCustomer, idProduct, amount } = req.body;
      if (amount !== 0) {
        await Cart.destroy({ idCustomer, idProduct });
      } else {
        await Cart.update({ idCustomer, idProduct }).set({
          amount,
        });
      }
      return res.json({ error: 0, message: "success" });
    } catch (error) {
      return res.json({ error: 500, message: "server error" });
    }
  },
};
