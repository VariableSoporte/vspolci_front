/*
export const persistenciaLocalStorage = <T,>(key: string, value: T) =>{
    localStorage.setItem(key, JSON.stringify({...value}));
};

export const eliminarLocalStorage = (key:string) =>{
    localStorage.removeItem(key);
};
*/
const TTL_30_MINUTES = 30 * 60 * 1000; // 30 minutos en milisegundos

export const persistenciaLocalStorage = <T,>(key: string, value: T) => {
    const expirationTime = Date.now() + TTL_30_MINUTES;
    const item = {
        value: value,
        expiration: expirationTime,
    };
    localStorage.setItem(key, JSON.stringify(item));
};

export const obtenerLocalStorage:any = <T,>(key: string): T | null => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    if (Date.now() > item.expiration) {
        localStorage.removeItem(key); // Eliminar el item si está expirado
        return null;
    }

    return item.value;
};

export const eliminarLocalStorage = (key: string) => {
    localStorage.removeItem(key);
};