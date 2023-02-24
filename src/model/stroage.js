
var stroage = {
    set(key,value){
        sessionStorage.setItem(key,JSON.stringify(value))
    },
    get(key){
        return JSON.parse(sessionStorage.getItem(key))
    },
    remove(key){
        sessionStorage.removeItem(key)
    }
}

export default stroage