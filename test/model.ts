import Model from "../lib/model"
QUnit.module('Model')

class MyModel extends Model {
    private _p
    private _wrong = 'wrongValue'

    get p() { return this._p }

    get wrong() { return this._wrong }

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
    assert.equal(model.wrong, 'wrongValue')
})



QUnit.test('toJSON()', assert => {
    // standard
    class MyModel1 extends Model {
        private _p2 = 456

        get p1() { return 123 }

        get p2() { return this._p2 }
    }

    assert.deepEqual(new MyModel1().toJSON(), {
        p1: 123,
        p2: 456
    })


    // extend
    class MyModel2 extends MyModel1 {
        private _p3 = 'xyz'

        get p2() { return 555 } // override

        get p3() { return this._p3 }
    }
    assert.deepEqual(new MyModel2().toJSON(), {
        p1: 123,
        p2: 555,
        p3: 'xyz'
    })


    // has collection
    class MyModel3 extends MyModel2 {

    }
})