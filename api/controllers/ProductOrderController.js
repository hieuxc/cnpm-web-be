/**
 * ProductOrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  bookOrderProduct: async (req, res) => {
    try {
      let { orderProductDetails, orderProduct } = req.body;
      if (!orderProductDetails || !orderProduct)
        return res.json({ error: 1, message: "Invalid params" });

      let orderProductCreated = await ProductOrder.create(orderProduct);

      for (let orderProductDetail of orderProductDetails) {
        orderProductDetail.idProductOrder = orderProductCreated.id;
      }

      let result = await ProductOrderController.createListOrderProductDetail(
        orderProductDetails
      );
      if (result === "success")
        return res.json({ error: 0, message: "success" });
      else return res.json({ error: 500, message: "server error" });
    } catch (error) {
      return res.json({ error: 500, message: "server error" });
    }
  },
};
