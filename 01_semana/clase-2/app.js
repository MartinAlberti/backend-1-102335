// Esto esta Mal!

// const uri = `${import.meta.dirname}/src/data/services.json`
// import path from "node:path"

// const FILE_NAME = "services.json"
// const uri = path.join(import.meta.dirname, "src", "data", FILE_NAME)

// import { readFile } from "node:fs/promises"

// try{
//     const fileData = await readFile(uri, "utf-8")
//     console.log(fileData)

// } catch(error){
//     console.log({ error })

// }


// import * as manager from "./src/Managers/servirceManager.js"

// import { getServices as managerService } from "./src/Managers/servirceManager.js"


import path from "node:path"
import envConfig from "./src/config/env.config.js"
import ServiceManager from "./src/Managers/servirceManager.js"

const DATABASE_NAME = "services.json"
const databasePath = path.join(import.meta.dirname, "src", "data", DATABASE_NAME)

const manager = new ServiceManager(databasePath)

console.log({"services": await manager.getServices()})
console.log("\n Busqueda de servicio \n ")
console.log({"service #2 " : await manager.getServiceById(2) })

const newService ={
    name: "Corte de pelo premium",
    description: "Corte con una super tijera ",
    duration: 30,
    price: 30000,
    category:"Estética",
    available: true
}

console.log("\n Agregar un servicio\n ")
const createdService = await manager.addService(newService)
console.log("new service", createdService)
console.log("\n Eliminar un servicio\n ")
console.log("Deleted", await manager.deleteService(8))
console.log(`Enviroment: ${envConfig.nodeEnv} | Port Available: ${envConfig.port}`)





