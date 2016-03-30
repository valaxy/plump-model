export default class Model {
    constructor(props:{[name:string]: any} = {}) {
        this.set(props)
    }

    set(props:{[name:string]: any}) {
        for (var key in props) {
            this[key] = props[key]
        }
    }

    clone() {
        let Class:any = this.constructor
        let model     = new Class
        for (var key in this) {
            model[key] = this[key]
        }
        return model
    }

    validate(props:{[name:string]: any}) {
        let copy = this.clone()
        copy.set(props)
    }
}