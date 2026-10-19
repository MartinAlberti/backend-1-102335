const { PORT, NODE_ENV} = process.env

//Fail fast. Revisa si estan los datos que necesito.

if(!PORT || !NODE_ENV) throw new Error("Algunas variables faltan -> revisar el .env file")

    export default{
        port: Number(PORT),
        nodeEnv: NODE_ENV
    }