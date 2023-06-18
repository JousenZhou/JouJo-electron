interface Object {
    [key: string]: any
}

export default {
    set: (name: string, object: Object | String) => {
        localStorage.setItem(name, JSON.stringify(object));
    },
    get: (name: string) => {
        return localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name) as string) : false;
    },
    clear: () => {
        localStorage.clear();
    },
    remove: (name: string) => {
        localStorage.removeItem(name);
    }
};
