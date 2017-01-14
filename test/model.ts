import Model from "../lib/model"
import chai = require('chai')

const assert = chai.assert

class TestModel extends Model {
    _id
    _name

    set id(value) { this._id = value }

    get id() { return this._id }

    set name(value) { this._name = value }

    get name() { return this._name }

    initialize() {
        this._id   = -1234
        this._name = '###'
    }
}


describe(Model.name, function () {
    it('constructor', function () {
        let model = new TestModel({
            id  : 1,
            name: 'xyz'
        })

        assert.equal(model._id, 1, 'field is ok')
        assert.equal(model.id, 1, 'get/set is ok')
        assert.equal(model.name, 'xyz', 'get/set is ok')
    })

    it('set', function () {
        let model = new TestModel({
            id  : 123,
            name: '555'
        })

        model.set({
            id  : 555,
            name: '123'
        })

        assert.equal(model.id, 555)
        assert.equal(model.name, '123')
    })


    it('clone()', function () {
        let m1 = new TestModel({
            id  : 111,
            name: '222'
        })

        let m2 = m1.clone()
        assert.equal(m2.id, 111)
        assert.equal(m2.name, '222')
        assert.equal(m2.constructor, TestModel)
    })

    it('merge()', function () {
        let m1 = new TestModel({id: '111', name: 'aaa'})
        let m2 = new TestModel({id: '222', name: 'ccc'})
        m1.merge(m2)

        assert.deepEqual(m1.toJSON(), {
            id  : '222',
            name: 'ccc'
        })
    })

    it('validate()', function () {
        class ValidateModel extends Model {
            set wrong(value) { throw new Error(value) }
        }

        let model = new ValidateModel()
        try {
            model.validate({wrong: '123'})
        } catch (e) {
            assert.equal(e.message, '123')
        }
    })


    it('toJSON()', function () {
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

        // TODO test has collection
    })
})



//import Subject from 'structprint/lib/event/Subject'
//import Observer from 'structprint/lib/event/Observer'

//it('trigger()', function() {
//    let done = assert.async()
//
//    class TestModel extends Model {
//        constructor(props) {
//            super()
//            super.set(props)
//        }
//    }
//
//
//    let hub = new Subject()
//    let obs = new Observer()
//    let m   = new TestModel({data: 123})
//
//    Model.setupEventHub(hub)
//
//    obs.listenTo(hub, {type: 'test'}, ({data}) => {
//        assert.equal(data, 123)
//        done()
//    })
//
//    m.trigger({type: 'test', data: m['data']})
//})