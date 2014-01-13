
var Collection = require('collection');
var exec = require('execute-sql');
var noop = function(){};

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Return a SQL Lite model plugin for a `db`.
 *
 * @param {Function} db
 * @return {Function}
 */

function plugin (db) {
  return function (Model) {
    var table = Model.modelName;

    /**
     * Get a model by `id`.
     *
     * @param {String} id
     * @param {Function} fn
     */

    Model.get = function (id, fn) {
      db.run(function (t) {
        exec(t, 'SELECT * FROM ' + table + ' WHERE id=?', [id], function (err, t, res) {
          if (err) return fn(err);

          try {
            var item = res.rows.item(0);
            var attrs = JSON.parse(item.data);
            attrs.id = item.id;
          } catch (e) {
            return fn(e);
          }

          var model = new Model(attrs);
          fn(null, model);
        });
      });
    };

    /**
     * Get all models.
     *
     * @param {Function} fn
     */

    Model.all = function (fn) {
      db.run(function (t) {
        exec(t, 'SELECT * FROM ' + table, [], function (err, t, res) {
          if (err) return fn(err);
          var col = new Collection();
          var rows = res.rows;

          for (var i = 0; i < rows.length; i++) {
            try {
              var item = rows.item(i);
              var attrs = JSON.parse(item.data);
              attrs.id = item.id;
            } catch (e) {
              return fn(e);
            }

            col.push(new Model(attrs));
          }

          fn(null, col);
        });
      });
    };

    /**
     * Destroy all models.
     *
     * @param {Function} fn
     */

    Model.destroyAll = function (fn) {
      fn = fn || noop;
      db.run(function (t) {
        exec(t, 'DELETE FROM ' + table, [], function (err, t, res) {
          if (err) return fn(err);
          fn(null, []);
        });
      });
    };

    /**
     * Destroy the model.
     *
     * @param {Function} fn
     */

    Model.prototype.destroy = function (fn) {
      fn = fn || noop;
      if (this.isNew()) return fn(new Error('not saved'));
      this.model.emit('destroying', this);
      this.emit('destroying');
      var self = this;
      db.run(function (t) {
        exec(t, 'DELETE FROM ' + table + ' WHERE id=?', [id], function (err, t, res) {
          if (err) return fn(err);
          self.destroyed = true;
          self.model.emit('destroy', self);
          self.emit('destroy');
          fn();
        });
      });
    };

    /**
     * Save the model.
     *
     * @param {Fucntion} fn
     */

    Model.prototype.save = function (fn) {
      if (!this.isNew()) return this.update(fn);
      fn = fn || noop;
      if (!this.isValid()) return fn(new Error('validation failed'));
      this.model.emit('saving', this);
      this.emit('saving');

      try {
        var data = JSON.stringify(this.toJSON());
      } catch (err) {
        return fn(err);
      }

      var self = this;
      db.run(function (t) {
        exec(t, 'INSERT INTO ' + table + ' (data) VALUES (?)', [data], function (err, t, res) {
          if (err) return fn(err);
          self.model.emit('save', self);
          self.emit('save');
          fn();
        });
      });
    };

    /**
     * Update the model.
     *
     * @param {Function} fn
     */

    Model.prototype.update = function (fn) {
      fn = fn || noop;
      if (!this.isValid()) return fn(new Error('validation failed'));
      this.model.emit('saving', this);
      this.emit('saving');

      try {
        var data = JSON.stringify(this.toJSON());
        delete data[this.model.primaryKey];
      } catch (err) {
        return fn(err);
      }

      var self = this;
      var id = this.primary();
      db.run(function (t) {
        exec(t, 'UPDATE ' + table + 'SET data=? WHERE id=?', [data, id], function (err, t, res) {
          if (err) return fn(err);
          self.model.emit('save', self);
          self.emit('save');
          fn();
        });
      });
    };

  };
}