
export const currFormatter = new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'})

interface localStorageWithExpiry {
    value: any,
    expiry: number
}

export const SetLocalStorageWithoutExpiry = (key: string, value: any) => {
    const newvalue: localStorageWithExpiry = {
        value: value,
        expiry: -1
    }
    localStorage.setItem(key, JSON.stringify(newvalue))
    return
}

export const SetLocalStorageWithExpiry = (key: string, value: any, expiry: number) => {
    const newvalue: localStorageWithExpiry = {
        value: value,
        expiry: (new Date()).getTime() + expiry
    }
    localStorage.setItem(key, JSON.stringify(newvalue))
}

export const GetLocalStorage = (key: string) => {
    const itemStr = localStorage.getItem(key)
    if (!itemStr) {
        return null
    }

    const item: localStorageWithExpiry = JSON.parse(itemStr)
    if (item.expiry < 0){
        return item.value
    }

    const now = new Date()
    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key)
        return null
    }

    return item.value
}

export const RemoveLocalStorage = (key: string) => {
    localStorage.removeItem(key)
}