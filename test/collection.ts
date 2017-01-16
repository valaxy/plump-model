import Collection, {CollectionType} from '../lib/collection'
import Model from "../lib/model"
import chai = require('chai')

const assert = chai.assert

class Person {
    id
    col
    host
    items = new Collection([], {reverseKey: 'persons', host: this, type: CollectionType.hasMany})

    constructor(options:{id?} = {}) {
        this.id = options.id
    }
}

class Item {
    persons = new Collection([], {reverseKey: 'items', host: this, type: CollectionType.hasMany})
}



describe(Collection.name, function () {
    it('constructor', function () {
        let list = new Collection([
            new Person({id: 1}),
            new Person({id: 2})
        ])
        assert.equal(list.length, 2)
    })

    it('many to many: add()/remove()/clear()', function () {
        let p1 = new Person
        let p2 = new Person
        let i1 = new Item
        let i2 = new Item

        p1.items.add(i1)
        assert.deepEqual(p1.items.toArray(), [i1])
        assert.deepEqual(i1.persons.toArray(), [p1])

        p1.items.add(i2)
        assert.deepEqual(p1.items.toArray(), [i1, i2])
        assert.deepEqual(i1.persons.toArray(), [p1])
        assert.deepEqual(i2.persons.toArray(), [p1])

        i1.persons.add(p2)
        assert.deepEqual(p1.items.toArray(), [i1, i2])
        assert.deepEqual(p2.items.toArray(), [i1])
        assert.deepEqual(i1.persons.toArray(), [p1, p2])
        assert.deepEqual(i2.persons.toArray(), [p1])

        i2.persons.add(p2)
        assert.deepEqual(p1.items.toArray(), [i1, i2])
        assert.deepEqual(p2.items.toArray(), [i1, i2])
        assert.deepEqual(i1.persons.toArray(), [p1, p2])
        assert.deepEqual(i2.persons.toArray(), [p1, p2])

        p1.items.remove(i2)
        assert.deepEqual(p1.items.toArray(), [i1])
        assert.deepEqual(p2.items.toArray(), [i1, i2])
        assert.deepEqual(i1.persons.toArray(), [p1, p2])
        assert.deepEqual(i2.persons.toArray(), [p2])

        i1.persons.remove(p1)
        assert.deepEqual(p1.items.toArray(), [])
        assert.deepEqual(p2.items.toArray(), [i1, i2])
        assert.deepEqual(i1.persons.toArray(), [p2])
        assert.deepEqual(i2.persons.toArray(), [p2])

        p2.items.clear()
        assert.deepEqual(p1.items.toArray(), [])
        assert.deepEqual(p2.items.toArray(), [])
        assert.deepEqual(i1.persons.toArray(), [])
        assert.deepEqual(i2.persons.toArray(), [])
    })


    it('add()/includes()/insert()/length/at()', function () {
        let col   = new Collection([], {reverseKey: 'col', host: 123})
        let model = new Person({id: 1})
        assert.ok(!model.col)
        assert.ok(!col.includes(model))
        assert.equal(col.length, 0)

        col.add(model)
        assert.equal(model.col, 123)
        assert.ok(col.includes(model))
        assert.equal(col.length, 1)
        assert.equal(col.at(0), model)

        let model2 = new Person({id: 2})
        col.insert(0, model2)
        assert.equal(col.at(0), model2)
        assert.equal(col.length, 2)
    })


    it('remove()/removeAt()', function () {
        let col    = new Collection([], {reverseKey: 'col'})
        let model  = new Person({id: 1})
        let model2 = new Person({id: 2})
        col.add(model)
        col.add(model2)

        col.removeAt(1)
        assert.equal(col.length, 1)
        assert.ok(!model2.col)

        col.remove(model)
        assert.equal(col.length, 0)
        assert.ok(!model.col)
    })


    it('concat()', function () {
        let col    = new Collection([], {reverseKey: 'host', host: 123})
        let model1 = new Person({id: 1})
        let model2 = new Person({id: 1})
        let model3 = new Person({id: 1})
        col.concat(model1, [model2, model3])
        assert.deepEqual(col.toArray(), [model1, model2, model3])
        assert.equal(model1['host'], 123)
        assert.equal(model2['host'], 123)
        assert.equal(model3['host'], 123)
    })

    it('clear()', function () {
        let model = new Person
        let list  = new Collection([
            model,
            new Person,
            new Person
        ], {reverseKey: 'host', host: 123})

        assert.equal(list.length, 3)
        assert.equal(model.host, 123)

        list.clear()
        assert.equal(list.length, 0)
        assert.equal(model.host, null)
    })


    it('options: reverseKey', function () {
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

    it('replace()', function () {
        let list   = new Collection([], {reverseKey: 'host', host: 123})
        let model1 = new Person({id: 1})
        let model2 = new Person({id: 1})
        list.add(model1)
        assert.equal(model1.host, 123)

        list.replace([model2])
        assert.deepEqual(list.toArray(), [model2])
        assert.equal(model2.host, 123)
        assert.equal(model1.host, null)
    })


    it('move()', function () {
        let m0, m1, m2
        let list = new Collection([
            m0 = new Person,
            m1 = new Person,
            m2 = new Person
        ])

        list.move(0, 2)
        assert.deepEqual(list.toArray(), [m2, m1, m0])

        list.move(1, 0)
        assert.deepEqual(list.toArray(), [m1, m2, m0])
    })

    it('reduce()', function () {
        let list = new Collection([
            new Person,
            new Person,
            new Person
        ])

        assert.equal(list.reduce((total) => total + 1, 0), 3)
    })

    it('filter()', function () {
        let list = new Collection<Person>([
            new Person({id: 1}),
            new Person({id: 2}),
            new Person({id: 3})
        ])

        let ary = list.filter(p => p.id == 2)

        assert.equal(ary.length, 1)
        assert.equal(ary[0].id, 2)

        assert.equal(list.length, 1)
        assert.equal(list.at(0).id, 2)
    })
})
