var _ = require("@sailshq/lodash");
var formatUsageError = require("formatUsageError");

module.exports = function destroyOneRecord(req, res) {
  var parseBlueprintOptions =
    req.options.parseBlueprintOptions ||
    req._sails.config.blueprints.parseBlueprintOptions;

  req.options.blueprintAction = "destroy";

  var queryOptions = parseBlueprintOptions(req);
  var Model = req._sails.models[queryOptions.using];

  var criteria = {};
  criteria[Model.primaryKey] = queryOptions.criteria.where[Model.primaryKey];

  var query = Model.findOne(_.cloneDeep(criteria), queryOptions.populates).meta(
    queryOptions.meta
  );
  query.exec(function foundRecord(err, record) {
    if (err) {
      switch (err.name) {
        case "UsageError":
          return res.badRequest(formatUsageError(err, req));
        default:
          return res.serverError(err);
      }
    }

    if (!record) {
      return res.notFound("No record found with the specified `id`.");
    }

    Model.destroy(_.cloneDeep(criteria))
      .meta(queryOptions.meta)
      .exec(function destroyedRecord(err) {
        if (err) {
          switch (err.name) {
            case "UsageError":
              return res.badRequest(formatUsageError(err, req));
            default:
              return res.serverError(err);
          }
        }

        if (req._sails.hooks.pubsub) {
          Model._publishDestroy(
            criteria[Model.primaryKey],
            !req._sails.config.blueprints.mirror && req,
            { previous: record }
          );
          if (req.isSocket) {
            Model.unsubscribe(req, [record[Model.primaryKey]]);
            Model._retire(record);
          }
        }

        return res.ok(record);
      });
  });
};
