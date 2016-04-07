interface Tester {
    (Model, number): boolean
}

interface Option {
    host?: any
    type?: CollectionType
    key?: string
    reverseKey?: string
}

export enum CollectionType {
    hasOne,
    hasMany
}

export default class Collection<Model> {
    private _list       = []
    private _key        = null
    private _reverseKey = null
    private _host       = null
    private _type       = null

    private _addMaintain(model:Model) {
        if (!this._reverseKey) return

        if (this._type == CollectionType.hasOne) {
            model[this._reverseKey] = this._host
        } else { // hasMany
            model[this._reverseKey]._add(this._host)
        }
    }

    private _removeMaintain(model:Model) {
        if (!this._reverseKey) return

        if (this._type == CollectionType.hasOne) {
            model[this._reverseKey] = null
        } else {
            model[this._reverseKey]._remove(this._host)
        }
    }

    constructor(models:Model[] = [], options:Option = {}) {
        this._key        = options.key
        this._reverseKey = options.reverseKey
        this._host       = options.host
        this._type       = options.type || CollectionType.hasOne
        this.concat(models)
    }


    //-----------------------------------------------------------------------------------------------------
    // ADD
    //-----------------------------------------------------------------------------------------------------

    // no need maintain
    _add(model:Model) {
        this._list.push(model)
    }

    add(model:Model) {
        this._list.push(model)
        this._addMaintain(model)
    }

    replace(models:Model[]) {
        this.clear()
        this.concat(models)
    }

    concat(...params) {
        let concatList = this._list.concat(...params)
        for (let i = this._list.length; i < concatList.length; i++) {
            this._addMaintain(concatList[i])
        }
        this._list = concatList
    }

    //-----------------------------------------------------------------------------------------------------
    // REMOVE
    //-----------------------------------------------------------------------------------------------------

    // no need maintain
    _remove(model:Model) {
        let index = this.indexOf(model)
        if (index < 0) throw new Error(`model is not in collection`)
        this._list.splice(index, 1)
    }


    remove(model:Model) {
        let index = this.indexOf(model)
        if (index < 0) throw new Error(`model is not in collection`)
        this.removeAt(index)
    }

    removeAt(index:number) {
        let [model] = this._list.splice(index, 1)
        this._removeMaintain(model)
    }

    clear() {
        for (let i = this._list.length - 1; i >= 0; i--) {
            this.removeAt(i)
        }
    }


    //-----------------------------------------------------------------------------------------------------
    // OTHER
    //-----------------------------------------------------------------------------------------------------
    at(index) { return this._list[index]}

    move(fromIndex:number, toIndex:number) {
        if (fromIndex < 0 || fromIndex >= this.length) throw new Error('fromIndex out of range')
        if (toIndex < 0 || toIndex >= this.length) throw new Error('toIndex out of range')
        if (fromIndex == toIndex) throw new Error('fromIndex should not equal with toIndex')

        let model = this.at(fromIndex)
        this.removeAt(fromIndex)
        this.insert(toIndex, model)
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

    isEmpty() { return this.length == 0 }

    lastIndexOf(model:Model) { return this._list.lastIndexOf(model) }

    get length() { return this._list.length }

    map(test:(Model, number) => any) { return this._list.map(test) }

    reduce(test) { return this._list.map(test)}



    some(test:(Model, number) => boolean) { this._list.some(test) }

    toArray() { return [].concat(this._list) }

    toJSON() { return this._list.map(model => model.toJSON()) }
}
