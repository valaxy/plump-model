import Collection from './collection'

interface Option {
    host: any                        // 宿主对象, 一般在Model里传入this
    type?: CollectionType             // 一对多, 或者多对多
    key?: string
    reverseKey?: string

    uniqueIDKey: string | Function  // 用来标识唯一性的key或者自定义function返回value
}


export enum CollectionType {
    hasOne,
    hasMany
}

export default function buildCollection(options:Option) {

}