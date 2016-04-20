import _ = require('underscore')

interface RawMap<Model> {
    [key: string]:Model
}

export default class Map<Model> {
    private _map:RawMap<Model> = {}

    constructor(props:RawMap<Model> = {}) {
        this.set(props)
    }

    get length() { return this.keys().length }

    get(key:string) { return this._map[key] }

    set(props:RawMap<Model>) {
        for (let key in props) {
            this._map[key] = props[key]
        }
    }

    remove(key:string) { delete this._map[key] }

    has(key:string) { return key in this._map }



    keys() { return Object.keys(this._map) }

    values() { return _.values(this._map) }


    mapObject(mapFunc) { return _.mapObject(this._map, mapFunc) } // todo,

    pairs() { return _.pairs(this._map) }


    findKey(predicate) { return _.findKey(this._map, predicate) }

    clone() {return new Map(this._map) }


    filter(predicate) {

    }

}