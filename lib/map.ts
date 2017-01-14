import _ = require('underscore')
import BaseModel from './model'

export interface ObjectLike<Model extends BaseModel> {
    [key: string]:Model
}

export default class Map<Model extends BaseModel> {
    private _map:ObjectLike<Model> = {}

    constructor(props:ObjectLike<Model> = {}) {
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

    setMany(props:ObjectLike<Model>) {
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

    has(key:string):boolean {
        return key in this._map
    }


    keys():string[] {
        return Object.keys(this._map)
    }

    values():Model[] {
        return _.values(this._map)
    }


    mapObject(iteratee:(value, key:string) => any) {
        return _.mapObject(this._map, iteratee)
    }

    pairs() {
        return _.pairs(this._map)
    }

    findKey(predicate:(value, key:string) => boolean):string {
        return _.findKey(this._map, predicate)
    }

    findValue(predicate:(value, key:string) => boolean):Model {
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
        // TODO Object.entires感应不出来
        _.pairs(this._map).forEach(([key, value]) => {
            if (!predicate(value, key)) delete this._map[key]
        })
        return this
    }

    toJSON() {
        return _.clone(this._map)
    }
}