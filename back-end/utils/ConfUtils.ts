export const env:string="production"
export const mongodbUrl=["mongdb://localhost:39000","mongodb://api.fishstar.xyz:39000"]
export const dbName="myOauth2_0"
export const getMongodbUrl=()=>mongodbUrl[env==="debug"?0:1]
