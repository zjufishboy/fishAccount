export const env="debug"
export const url=["http://localhost:8000","http://api.fishstar.xyz/account"]
export const PathLogin="/login"
export const PathRegister="/register"
export const PathAllUser="/allUser"
export const getPathLogin=()=>`${url[env==="debug"?0:1]}${PathLogin}`
export const getPathRegister=()=>`${url[env==="debug"?0:1]}${PathRegister}`
export const getPathAllUser=()=>`${url[env==="debug"?0:1]}${PathAllUser}`