var _ = require("@sailshq/lodash");
var async = require("async");
var formatUsageError = require("formatUsageError");

module.exports = function createRecord(req, res) {
  var parseBlueprintOptions =
    req.options.parseBlueprintOptions ||
    req._sails.config.blueprints.parseBlueprintOptions;

  req.options.blueprintAction = "create";

  var queryOptions = parseBlueprintOptions(req);
  var Model = req._sails.models[queryOptions.using];

  var data = queryOptions.newRecord;

  async.reduce(
    _.keys(Model.attributes),
    [],
    function (memo, attrName, nextAttrName) {
      var attrDef = Model.attributes[attrName];
      if (
        attrDef.collection &&
        _.isArray(data[attrName]) &&
        data[attrName].length > 0 &&
        attrDef.via &&
        req._sails.models[attrDef.collection].attributes[attrDef.via].model
      ) {
        var criteria = {};
        criteria[req._sails.models[attrDef.collection].primaryKey] =
          data[attrName];
        req._sails.models[attrDef.collection]
          .find(criteria)
          .exec(function (err, newChildren) {
            if (err) {
              return nextAttrName(err);
            }
            _.each(newChildren, function (child) {
              if (child[attrDef.via]) {
                memo.push({
                  id: child[attrDef.via],
                  removedId:
                    child[req._sails.models[attrDef.collection].primaryKey],
                  attribute: attrName,
                });
              }
            });
            return nextAttrName(undefined, memo);
          });
      } else {
        return nextAttrName(undefined, memo);
      }
    },
    function (err, removedFromNotificationsToSend) {
      if (err) {
        return res.serverError(err);
      }

      Model.create(data)
        .meta(queryOptions.meta)
        .exec(function created(err, newInstance) {
          if (err) {
            switch (err.name) {
              case "AdapterError":
                switch (err.code) {
                  case "E_UNIQUE":
                    return res.badRequest(err);
                  default:
                    return res.serverError(err);
                } //•
              case "UsageError":
                return res.badRequest(formatUsageError(err, req));
              default:
                return res.serverError(err);
            }
          }

          if (!newInstance) {
            return res.ok();
          }

          Model.findOne(
            newInstance[Model.primaryKey],
            queryOptions.populates
          ).exec(function foundAgain(err, populatedRecord) {
            if (err) {
              return res.serverError(err);
            }
            if (!populatedRecord) {
              return res.serverError("Could not find record after creating!");
            }

            if (req._sails.hooks.pubsub) {
              if (req.isSocket) {
                Model.subscribe(req, [populatedRecord[Model.primaryKey]]);
                Model._introduce(populatedRecord);
              }
              Model._publishCreate(populatedRecord, !req.options.mirror && req);
              if (removedFromNotificationsToSend.length) {
                _.each(removedFromNotificationsToSend, function (notification) {
                  Model._publishRemove(
                    notification.id,
                    notification.attribute,
                    notification.removedId,
                    !req.options.mirror && req,
                    { noReverse: true }
                  );
                });
              }
            } //>-

            res.ok(populatedRecord);
          });
        });
    }
  );
};
