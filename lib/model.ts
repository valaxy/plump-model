export default class Model {
    constructor(props:{[name:string]: any} = {}) {
        this.set(props)
    }

    set(props:{[name:string]: any}) {
        for (var key in props) {
            this[key] = props[key]
        }
    }
}