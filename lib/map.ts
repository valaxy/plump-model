import _ = require('underscore')

interface RawMap<Model> {
    [key: string]:Model
}

export default class Map<Model> {
    private _map:RawMap<Model> = {}

    constructor(props:RawMap<Model> = {}) {
        this.setMany(props)
    }

    get length() {
        return this.keys().length
    }

    get(key:string) {
        return this._map[key]
    }

    set(key:string, model:Model) {
        this._map[key] = model
    }

    setMany(props:RawMap<Model>) {
        for (let key in props) {
            this._map[key] = props[key]
        }
    }

    merge(key:string, model:Model) {
        let oldModel = this.get(key)
        if (oldModel) {
            oldModel.merge(model)
        } else {
            this.set(key, model)
        }
    }

    remove(key:string) {
        delete this._map[key]
    }

    has(key:string) {
        return key in this._map
    }


    keys() {
        return Object.keys(this._map)
    }

    values() {
        return _.values(this._map)
    }


    mapObject(iteratee:(value, key:string) => any) {
        return _.mapObject(this._map, iteratee)
    }

    pairs() {
        return _.pairs(this._map)
    }

    findKey(predicate:(value, key:string) => boolean) {
        return _.findKey(this._map, predicate)
    }

    findValue(predicate:(value, key:string) => boolean) {
        let key = _.findKey(this._map, predicate)
        if (key == undefined) {
            return undefined
        } else {
            return this._map[key]
        }
    }

    clone() {
        return new Map(this._map)
    }

    filter(predicate:(value, key:string) => boolean) {
        _.pairs(this._map).forEach(([key, value]) => {
            if (!predicate(value, key)) delete this._map[key]
        })
        return this
    }

    toJSON() {
        return _.clone(this._map)
    }
}