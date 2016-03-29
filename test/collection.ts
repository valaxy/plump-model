import Collection from '../lib/collection'

QUnit.module('Collection')

class MyModel {
    id
    col

    constructor({id}) {
        this.id = id
    }
}


QUnit.test('constructor', assert => {
    let col = new Collection([
        new MyModel({id: 1}),
        new MyModel({id: 2})
    ])
    assert.equal(col.length, 2)
})


QUnit.test('add()/includes()/insert()/length/at()', assert => {
    let col   = new Collection([], {reverseKey: 'col'})
    let model = new MyModel({id: 1})
    assert.ok(!model.col)
    assert.ok(!col.includes(model))
    assert.equal(col.length, 0)

    col.add(model)
    assert.equal(model.col, col)
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