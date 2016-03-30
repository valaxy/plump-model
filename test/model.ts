import Model from "../lib/model"
QUnit.module('Model')

class MyModel extends Model {
    _p

    get p() { return this._p }

    set wrong(value) { throw new Error(value) }

    constructor(props?) {
        super(props)
    }
}

QUnit.test('constructor', assert => {
    let model:any = new MyModel({
        id  : 1,
        name: 'xyz'
    })

    assert.equal(model.id, 1)
    assert.equal(model.name, 'xyz')
})


QUnit.test('clone()', assert => {
    let m1 = new MyModel
    m1._p  = 123
    let m2 = m1.clone()

    assert.equal(m2.p, 123)
    assert.equal(m2.constructor, MyModel)
})



QUnit.test('validate()', assert => {
    let model = new MyModel
    try {
        model.validate({wrong: '123'})
    } catch (e) {
        assert.equal(e.message, '123')
    }
})