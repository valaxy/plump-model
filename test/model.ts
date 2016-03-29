import Model from "../lib/model"
QUnit.module('Model')

class MyModel extends Model {
    constructor(props) {
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