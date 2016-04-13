let getPrototypes = function (model) {
    let proto      = model.constructor.prototype
    let prototypes = []
    while (true) {
        prototypes.push(proto)
        if (proto === Model.prototype) break
        proto = proto.__proto__
    }
    return prototypes
}

export default class Model {
    constructor(props:{[name:string]: any} = {}) {
        this.set(props)
    }

    set(props:{[name:string]: any}) {
        for (let key in props) {
            this[key] = props[key]
        }
    }

    clone() {
        let Class:any = this.constructor
        let model     = new Class
        for (let key in this) {
            model[key] = this[key]
        }
        return model
    }

    merge(model) {
        for (let key in model) {
            this[key] = model[key]
        }
    }

    validate(props:{[name:string]: any}) {
        let copy = this.clone()
        copy.set(props)
    }

    toJSON() {
        let protos = getPrototypes(this).reverse()
        let json   = {}
        protos.forEach(proto => {
            Object.getOwnPropertyNames(proto).forEach(propName => {
                let descriptor = Object.getOwnPropertyDescriptor(proto, propName)
                if (descriptor.get) {
                    json[propName] = descriptor.get.call(this)
                }
            })
        })
        return json
    }
}