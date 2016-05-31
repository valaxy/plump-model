import Map from '../lib/map'

QUnit.module('Map')

QUnit.test('constructor/get length', assert => {
    let m = new Map
    assert.equal(m.length, 0)

    m = new Map({
        1: 111,
        2: 222
    })
    assert.equal(m.length, 2)
})



QUnit.test('get()', assert => {
    let m:any = new Map({
        1: 111,
        5: 222
    })

    assert.equal(m.get(1), 111)
    assert.equal(m.get('1'), 111)
    assert.equal(m.get('5'), 222)
    assert.equal(m.get('xx'), undefined)
})


QUnit.test('set()/remove()', assert => {
    let m = new Map()
    m.set({'abc': 123})
    assert.equal(m.get('abc'), 123)

    m.set({'abc': 456, 'b': 111})
    assert.equal(m.get('abc'), 456)
    assert.equal(m.get('b'), 111)

    m.remove('abc')
    assert.equal(m.get('abc'), undefined)

    m.remove('xxx')
})


QUnit.test('has()', assert => {
    let m = new Map({a: 1})
    assert.ok(m.has('a'))
    assert.ok(!m.has('b'))

    m.set({'b': 123})
    assert.ok(m.has('b'))
})

QUnit.test('keys()', assert => {
    let m = new Map
    assert.deepEqual(m.keys(), [])

    m.set({
        a: 1,
        b: 2
    })
    assert.deepEqual(m.keys(), ['a', 'b'])
})


QUnit.test('values()', assert => {
    let m = new Map
    assert.deepEqual(m.values(), [])

    m.set({a: 1, b: 2})
    assert.deepEqual(m.values(), [1, 2])
})

QUnit.test('mapObject()', assert => {
    let m = new Map({
        a: 3,
        b: 4
    })

    assert.deepEqual(m.mapObject((val, key) => key + val), {
        a: 'a3',
        b: 'b4'
    })
})


QUnit.test('pairs()', assert => {
    let m = new Map({
        a: 1,
        b: 2
    })
    assert.deepEqual(m.pairs(), [
        ['a', 1],
        ['b', 2]
    ])
})


QUnit.test('findKey()/findValue()', assert => {
    let m = new Map({
        a: 1,
        0: 5,
        1: 'a',
        2: 3
    })

    assert.equal(m.findKey((value, key) => /\d+/.test(key) && /[a-z]/.test(value)), '1')
    assert.equal(m.findValue((value, key) => value == 3 && key == '2'), 3)
})



QUnit.test('filter()', assert => {
    let m = new Map({
        0: 0,
        1: 1,
        a: 'a',
        b: 'b'
    })

    m.filter((value, key) => {
        if (key.match(/[a-z]+/)) return true
        if (value == 0) return true
        return false
    })

    assert.deepEqual(m.toJSON(), {
        0: 0,
        a: 'a',
        b: 'b'
    })
})

