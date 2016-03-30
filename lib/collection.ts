interface Tester {
    (Model, number): boolean
}

export default class Collection<Model> {
    private _list       = []
    private _reverseKey = null

    private _addMaintain(model:Model) {
        this._reverseKey && (model[this._reverseKey] = this)
    }

    private _removeMaintain(model:Model) {
        this._reverseKey && (model[this._reverseKey] = null)
    }

    constructor(models:Model[] = [], options:any = {}) {
        this._reverseKey = options.reverseKey
        this._list       = models
    }

    add(model:Model) {
        this._list.push(model)
        this._addMaintain(model)
    }

    at(index) { return this._list[index]}

    clear() { this._list = [] }

    concat(...params) {
        this._list = this._list.concat.call(this._list, ...params)
    }

    every(test:Tester) { return this._list.every(test) }

    filter(test:Tester) { return this._list.filter(test) }

    find(test:Tester) { return this._list.find(test) }

    findIndex(test:(Model) => boolean) { return this._list.findIndex(test) }

    forEach(iterator:(Model, number) => any) { return this._list.forEach(iterator)}

    includes(model:Model) {
        let index = this.indexOf(model)
        return index >= 0
    }

    indexOf(model:Model) { return this._list.indexOf(model) }

    insert(index:number, model:Model) {
        this._list.splice(index, 0, model)
        this._addMaintain(model)
    }

    lastIndexOf(model:Model) { return this._list.lastIndexOf(model) }

    get length() { return this._list.length }

    map(test:(Model, number) => any) { return this._list.map(test) }

    reduce(test) { return this._list.map(test)}

    remove(model:Model) {
        let index = this.indexOf(model)
        if (index < 0) throw new Error(`model is not in collection`)
        this.removeAt(index)
    }

    removeAt(index:number) {
        let [model] = this._list.splice(index, 1)
        this._removeMaintain(model)
    }

    some(test:(Model, number) => boolean) { this._list.some(test) }

    toArray() { return [].concat(this._list) }
}

