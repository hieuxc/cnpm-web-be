var _ = require("@sailshq/lodash");
var formatUsageError = require("formatUsageError");

module.exports = function updateOneRecord(req, res) {
  var parseBlueprintOptions =
    req.options.parseBlueprintOptions ||
    req._sails.config.blueprints.parseBlueprintOptions;

  req.options.blueprintAction = "update";

  var queryOptions = parseBlueprintOptions(req);
  var Model = req._sails.models[queryOptions.using];

  var criteria = {};
  criteria[Model.primaryKey] = queryOptions.criteria.where[Model.primaryKey];

  Model.findOne(
    _.cloneDeep(criteria),
    _.cloneDeep(queryOptions.populates)
  ).exec(function (err, matchingRecord) {
    if (err) {
      switch (err.name) {
        case "UsageError":
          return res.badRequest(formatUsageError(err, req));
        default:
          return res.serverError(err);
      }
    }

    if (!matchingRecord) {
      return res.notFound();
    }
    Model.updateOne(_.cloneDeep(criteria))
      .set(queryOptions.valuesToSet)
      .meta(queryOptions.meta)
      .exec(function (err, updatedRecord) {
        if (err) {
          switch (err.name) {
            case "AdapterError":
              switch (err.code) {
                case "E_UNIQUE":
                  return res.badRequest(err);
                default:
                  return res.serverError(err);
              }
            case "UsageError":
              return res.badRequest(formatUsageError(err, req));
            default:
              return res.serverError(err);
          }
        }

        if (!updatedRecord) {
          return res.notFound();
        }
        if (req._sails.hooks.pubsub) {
          if (req.isSocket) {
            Model.subscribe(req, [updatedRecord[Model.primaryKey]]);
          }
          var pk = updatedRecord[Model.primaryKey];
          Model._publishUpdate(
            pk,
            _.cloneDeep(queryOptions.valuesToSet),
            !req.options.mirror && req,
            {
              previous: _.cloneDeep(matchingRecord),
            }
          );
        } //ﬁ

        Model.findOne(
          _.cloneDeep(criteria),
          _.cloneDeep(queryOptions.populates)
        ).exec(function foundAgain(err, populatedRecord) {
          if (err) {
            return res.serverError(err);
          }
          if (!populatedRecord) {
            return res.serverError("Could not find record after updating!");
          }
          res.ok(populatedRecord);
        });
      });
  });
};
