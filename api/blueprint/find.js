var _ = require("@sailshq/lodash");
var actionUtil = require("actionUtil");
var formatUsageError = require("formatUsageError");

module.exports = function findRecords(req, res) {
  var parseBlueprintOptions =
    req.options.parseBlueprintOptions ||
    req._sails.config.blueprints.parseBlueprintOptions;

  req.options.blueprintAction = "find";

  var queryOptions = parseBlueprintOptions(req);
  var Model = req._sails.models[queryOptions.using];

  Model.find(queryOptions.criteria, queryOptions.populates)
    .meta(queryOptions.meta)
    .exec(function found(err, matchingRecords) {
      if (err) {
        switch (err.name) {
          case "UsageError":
            return res.badRequest(formatUsageError(err, req));
          default:
            return res.serverError(err);
        }
      } //-•

      if (req._sails.hooks.pubsub && req.isSocket) {
        Model.subscribe(req, _.pluck(matchingRecords, Model.primaryKey));
        if (req.options.autoWatch) {
          Model._watch(req);
        }
        _.each(matchingRecords, function (record) {
          actionUtil.subscribeDeep(req, record);
        });
      } //>-

      return res.ok(matchingRecords);
    });
};
