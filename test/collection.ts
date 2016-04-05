import Collection from '../lib/collection'
import Model from "../lib/model"

QUnit.module('Collection')

class MyModel {
    id
    col
    host

    constructor(options:{id?} = {}) {
        this.id = options.id
    }
}


QUnit.test('constructor', assert => {
    let list = new Collection([
        new MyModel({id: 1}),
        new MyModel({id: 2})
    ])
    assert.equal(list.length, 2)
})


QUnit.test('add()/includes()/insert()/length/at()', assert => {
    let col   = new Collection([], {reverseKey: 'col', host: 123})
    let model = new MyModel({id: 1})
    assert.ok(!model.col)
    assert.ok(!col.includes(model))
    assert.equal(col.length, 0)

    col.add(model)
    assert.equal(model.col, 123)
    assert.ok(col.includes(model))
    assert.equal(col.length, 1)
    assert.equal(col.at(0), model)

    let model2 = new MyModel({id: 2})
    col.insert(0, model2)
    assert.equal(col.at(0), model2)
    assert.equal(col.length, 2)
})


QUnit.test('remove()/removeAt()', assert => {
    let col    = new Collection([], {reverseKey: 'col'})
    let model  = new MyModel({id: 1})
    let model2 = new MyModel({id: 2})
    col.add(model)
    col.add(model2)

    col.removeAt(1)
    assert.equal(col.length, 1)
    assert.ok(!model2.col)

    col.remove(model)
    assert.equal(col.length, 0)
    assert.ok(!model.col)
})


QUnit.test('concat()', assert => {
    let col    = new Collection([], {reverseKey: 'host', host: 123})
    let model1 = new MyModel({id: 1})
    let model2 = new MyModel({id: 1})
    let model3 = new MyModel({id: 1})
    col.concat(model1, [model2, model3])
    assert.deepEqual(col.toArray(), [model1, model2, model3])
    assert.equal(model1['host'], 123)
    assert.equal(model2['host'], 123)
    assert.equal(model3['host'], 123)
})

QUnit.test('clear()', assert => {
    let model = new MyModel
    let list  = new Collection([model], {reverseKey: 'host', host: 123})

    assert.equal(list.length, 1)
    assert.equal(model.host, 123)

    list.clear()
    assert.equal(list.length, 0)
    assert.equal(model.host, null)
})


QUnit.test('options: reverseKey', assert => {
    class Guest extends Model {
        host = null
    }
    class Host extends Model {
        collection = new Collection<Guest>([], {reverseKey: 'host', host: this})
    }

    let guest = new Guest
    let host  = new Host
    host.collection.add(guest)
    assert.equal(guest.host, host)
})

QUnit.test('replace()', assert => {
    let list   = new Collection([], {reverseKey: 'host', host: 123})
    let model1 = new MyModel({id: 1})
    let model2 = new MyModel({id: 1})
    list.add(model1)
    assert.equal(model1.host, 123)

    list.replace([model2])
    assert.deepEqual(list.toArray(), [model2])
    assert.equal(model2.host, 123)
    assert.equal(model1.host, null)
})


QUnit.test('move()', assert => {
    let m0, m1, m2
    let list = new Collection([
        m0 = new MyModel,
        m1 = new MyModel,
        m2 = new MyModel
    ])

    list.move(0, 2)
    assert.deepEqual(list.toArray(), [m2, m1, m0])

    list.move(1, 0)
    assert.deepEqual(list.toArray(), [m1, m2, m0])
})