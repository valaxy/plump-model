import Map from '../lib/map'
import Model from '../lib/model'
import chai = require('chai')

const assert = chai.assert

class TestModel extends Model {
    _value

    get value() { return this._value }

    set value(v) { this._value = v }
}


describe(Map.name, function () {
    it('constructor/get length', function () {
        let map = new Map<Model>()
        let m1  = new Model
        let m2  = new Model
        assert.equal(map.length, 0)

        map = new Map<Model>({
            '1': m1,
            '2': m2
        })

        assert.equal(map.length, 2)
        assert.equal(map.get('1'), m1)
    })

    it('get()/set()', function () {
        let m = new Map<TestModel>({
            '1': new TestModel({value: 111})
        })

        assert.equal(m.get('1').value, 111)

        m.set('5', new TestModel({value: 222}))
        assert.equal(m.get('5').value, 222)
        assert.equal(m.get('xx'), undefined)
    })


    it('setMany()/remove()', function () {
        let map = new Map<TestModel>()
        let m1  = new TestModel()
        let m2  = new TestModel()

        map.setMany({'abc': m1})
        assert.equal(map.get('abc'), m1)

        map.setMany({'abc': m2, 'b': m1})
        assert.equal(map.get('abc'), m2)
        assert.equal(map.get('b'), m1)

        map.remove('abc')
        assert.equal(map.get('abc'), undefined)

        map.remove('xxx') // not throw
    })

    it('merge()', function () {
        class MergeModel extends Model {
            _a
            _b

            set a(value) { this._a = value }

            get a() { return this._a }

            set b(value) { this._b = value }

            get b() { return this._b }

            initialize() {
                this._a = 1
                this._b = 2
            }
        }

        let m1  = new MergeModel()
        let map = new Map<MergeModel>({xx: m1})
        assert.equal(map.get('xx').a, 1)
        assert.equal(map.get('xx').b, 2)

        let m2 = new MergeModel({a: 3})
        assert.equal(m2.a, 3)
        assert.equal(m2.b, 2)

        map.merge('xx', m2)
        assert.equal(map.get('xx').a, 3)
        assert.equal(map.get('xx').b, 2)

        // not has
        map.merge('yy', new MergeModel({a: 111, b: 222}))
        assert.deepEqual(map.get('yy').a, 111)
        assert.deepEqual(map.get('yy').b, 222)
    })

    it('has()', function () {
        let m = new Map<TestModel>({a: new TestModel})
        assert.ok(m.has('a'))
        assert.ok(!m.has('b'))

        m.setMany({'b': new TestModel})
        assert.ok(m.has('b'))
    })

    it('keys()', function () {
        let m = new Map<TestModel>()
        assert.deepEqual(m.keys(), [])

        m.setMany({
            a: new TestModel(),
            b: new TestModel()
        })
        assert.deepEqual(m.keys(), ['a', 'b'])
    })


    it('values()', function () {
        let m  = new Map<TestModel>()
        let m1 = new TestModel()
        let m2 = new TestModel()

        assert.deepEqual(m.values(), [])

        m.setMany({a: m1, b: m2})
        assert.deepEqual(m.values(), [m1, m2])
    })

    it('mapObject()', function () {
        let m = new Map({
            a: new TestModel({value: '11'}),
            b: new TestModel({value: '22'})
        })

        assert.deepEqual(m.mapObject((val, key) => key + val.value), {
            a: 'a11',
            b: 'b22'
        })
    })


    it('pairs()', function () {
        let m1 = new TestModel()
        let m2 = new TestModel()
        let m  = new Map<TestModel>({
            a: m1,
            b: m2
        })
        assert.deepEqual(m.pairs(), [
            ['a', m1],
            ['b', m2]
        ])
    })

    it('findKey()/findValue()', function () {
        let m = new Map<TestModel>({
            a: new TestModel({value: 1}),
            0: new TestModel({value: 5}),
            1: new TestModel({value: 'a'}),
            2: new TestModel({value: 3})
        })

        assert.equal(m.findKey((model, key) => /\d+/.test(key) && /[a-z]/.test(model.value)), '1')
        assert.equal(m.findValue((model, key) => model.value == 3 && key == '2').value, 3)
    })


    it('filter()/toJSON()', function () {
        let m1, m2, m3, m4
        let m = new Map<TestModel>({
            0: m1 = new TestModel({value: 0}),
            1: m2 = new TestModel({value: 1}),
            a: m3 = new TestModel({value: 'a'}),
            b: m4 = new TestModel({value: 'b'})
        })

        m.filter((model, key) => {
            if (key.match(/[a-z]+/)) return true
            if (model.value == 0) return true
            return false
        })

        assert.deepEqual(m.toJSON(), {
            0: m1,
            a: m3,
            b: m4
        })
    })
})
