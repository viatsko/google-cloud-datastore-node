const Datastore = require('@google-cloud/datastore');

let projectId = '';

function fromDatastore(obj) {
    obj.id = obj[Datastore.KEY].id;

    return obj;
}

function toDatastore(obj, nonIndexed) {
    nonIndexed = nonIndexed || [];

    const results = [];

    Object.keys(obj).forEach((k) => {
        if (obj[k] === undefined) {
            return;
        }

        results.push({
            name: k,
            value: obj[k],
            excludeFromIndexes: nonIndexed.indexOf(k) !== -1,
        });
    });

    return results;
}

function setup(options) {
    if (typeof options !== 'object') {
        throw new Error('`options` should be an object.')
    }

    projectId = options.projectId;
}

function createDao(daoProjectId, entityName) {
    if (!entityName) {
        entityName = daoProjectId;
    } else {
        projectId = daoProjectId;
    }

    const ds = new Datastore({
        projectId
    });

    function list(limit, order, token) {
        return new Promise((resolve, reject) => {
            const q = ds.createQuery([entityName]);

            if (limit) {
                q.limit(limit);
            }

            if (order) {
                q.order(order);
            }

            if (token) {
                q.start(token);
            }

            ds.runQuery(q, (err, entities, nextQuery) => {
                if (err) {
                    reject(err);

                    return;
                }

                const hasMore = nextQuery.moreResults !== Datastore.NO_MORE_RESULTS ? nextQuery.endCursor : false;

                resolve({
                    data: entities.map(fromDatastore),
                    hasMore,
                });
            });
        });
    }

    function update(id, data) {
        return new Promise((resolve, reject) => {
            let key;

            if (id) {
                key = ds.key([entityName, parseInt(id, 10)]);
            } else {
                key = ds.key(entityName);
            }

            const entity = {
                key: key,
                data: toDatastore(data, ['description']),
            };

            ds.save(
                entity,
                (err) => {
                    data.id = entity.key.id;

                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                }
            );
        });
    }

    function create(data) {
        return update(null, data);
    }

    function read(id) {
        return new Promise((resolve, reject) => {
            const key = ds.key([entityName, parseInt(id, 10)]);

            ds.get(key, (err, entity) => {
                if (!err && !entity) {
                    err = {
                        code: 404,
                        message: 'Not found'
                    };
                }

                if (err) {
                    reject(err);

                    return;
                }

                resolve(fromDatastore(entity));
            });
        });
    }

    function _delete(id) {
        return new Promise((resolve, reject) => {
            const key = ds.key([entityName, parseInt(id, 10)]);

            ds.delete(key, resolve);
        });
    }

    return {
        create,
        read,
        update,
        delete: _delete,
        list
    };
}

module.exports = {
    setup,
    createDao,
};
