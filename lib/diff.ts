import Collection from './collection'

const UPDATE_EVENT = 1
const ADD_EVENT    = 2
const REMOVE_EVENT = 3



export function diffCollection<Model>(list1:Collection<Model>, list2:Collection<Model>) {
    //let idKey = list1.idField
    //let a     = list1.map(m => m[idKey])
    //let b     = list2.map(m => m[idKey])

}

export default function diff(model1, model2) {
    if (model1.constructor != model2.constructor) throw new Error('instance class not the same')



}