import Model from "../lib/model"
import Subject from 'structprint/lib/event/Subject'
import Observer from 'structprint/lib/event/Observer'

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
    class SubModel extends Model {
        id
        _name

        get name() { return this._name }

        set name(value) { this._name = value }
    }

    let model = new SubModel({
        id  : 1,
        name: 'xyz'
    })

    assert.equal(model.id, 1, 'field is ok')
    assert.equal(model.name, 'xyz', 'get/set is ok')
})


QUnit.test('clone()', assert => {
    let m1   = new MyModel
    m1['_p'] = 123
    let m2   = m1.clone()

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


QUnit.test('merge()', assert => {
    class MyModel extends Model {
        private _p1
        private _p2

        get p1() { return this._p1 }

        set p1(value) { this._p1 = value }

        get p2() {return this._p2}

        set p2(value) { this._p2 = value }

        constructor(props) {
            super()
            super.set(props)
        }
    }

    let m1 = new MyModel({p1: '111', p2: 'aaa'})
    let m2 = new MyModel({p1: '222', p2: 'ccc'})
    m1.merge(m2)
    assert.deepEqual(m1.toJSON(), {
        p1: '222',
        p2: 'ccc'
    })
})


QUnit.test('trigger()', assert => {
    let done = assert.async()

    class TestModel extends Model {
        constructor(props) {
            super()
            super.set(props)
        }
    }


    let hub = new Subject()
    let obs = new Observer()
    let m   = new TestModel({data: 123})

    Model.setupEventHub(hub)

    obs.listenTo(hub, {type: 'test'}, ({data}) => {
        assert.equal(data, 123)
        done()
    })

    m.trigger({type: 'test', data: m.data})
})