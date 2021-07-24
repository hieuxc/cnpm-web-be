/**
 * ProductOrderDetailController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  createListOrderProductDetail: async (orderProductDetails) => {
    try {
      for (let orderProductDetail of orderProductDetails) {
        await ProductOrderDetail.create(orderProductDetail);
      }
      return "success";
    } catch (error) {
      return "error";
    }
  },
};
