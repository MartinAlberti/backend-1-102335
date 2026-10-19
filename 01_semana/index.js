// import fs from "node:fs/promises";

// class Fileservice {
//   constructor(filePath) {
//     this.filePath = filePath;
//   }

//   async readFile() {
//     const data = await fs.readFile(this.filePath, "utf-8");
//     const parsedData = await JSON.parse(data);
//     return parsedData.items;
//   }
// }

// const dragonBallService = new Fileservice("./database/dragonBall.json");

// dragonBallService
//   .readFile()
//   .then((items) => console.log(items))
//   .catch((error) => console.error(error));

import http from "node:http";
import { Worker } from "node:worker_threads";
import { once } from "node:events"

const ITERACIONES = 5e9; //5x10**9

const calcular = (ITERACIONES) => {
  let contador = 0;
  for (let i = 0; i < ITERACIONES; i++) {
    contador += 1;
  }
  return contador;
};

// console.log(calcular(ITERACIONES));

http.createServer(async (req, res) => {
  if (req.url === "/heavyBlocker") {
    const resultado = calcular(ITERACIONES);
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end(`resultado: ${resultado}`);
  }
  if (req.url === "/heavy") {
    const worker = new Worker(
      `const {parentPort} = require("node:worker_threads")
            let contador = 0;
  for (let i = 0; i < ${ITERACIONES}; i++) {
    contador += 1;
  }
    parentPort.postMessage(contador);
    
    `,
      { eval: true },
    )
    const [resultado] = await once (worker, "message")
    return res.end(`Resultado: ${resultado}`)
    ;
  }
  if (req.url === "/ping"){
    res.writeHead(200, {"content-type" : "text/plain"})
    return res.end("pong")
  }
}).listen(3000, ()=> console.log("servidor escuchando en el puerto 3000"))
