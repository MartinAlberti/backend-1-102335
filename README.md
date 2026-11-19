Cliente --> Router --> Controller --> Manager --> Datos (JSON local)

- El manager valida, lee y escribe los datos dentro de los archivos (JSON).
  HTTP Request --> Router --> Controller (que hacemos con la Request y Response) --> Manager (que, donde, como) hacemos con los datos --> \*.json

Cliente --> Router --> Controller --> Service --> Repository --> DAO (Datos (JSON local) >> MongoDB)

- Separar esas tareas para poder cambiar como guardamos (en donde) sin tener que volver a declarar nuevas reglas.
  HTTP Request --> Router --> Controller (que hacemos con la Request y Response) --> Services define (que) hacemos con los datos --> Repository define (como/ "donde") se guardan los datos --> DAO el (como) accedemos a los datos

DAO -- Data Access Object
Podemos tener varios puntos de acceso:
 - FileSystem
 - MongoDB
 - MySQL
 - PostgreSQL

Add
DTO -- Data Transfer Object

Logica de Negocio -- Datos

_Request no Autorizada_
Cliente --> Servidor // Protocolo HTTP -- Hyper Text Transfer Protocol (protocolo de comunicación) -- HTTPs (secure) encriptacion y medidas de seguridad

Request HTTP: el servidor deberia rechazarla
Request HTTPs: el servidor no la rechaza pero aplica criterios propios:
    - El pais origen, esta permitido?
    - El user que me consulta, tiene autorizacion en mi APP?
    - Si Tiene autorizacion:
        - Tiene permisos para consumir x servicio
         - Si tiene ---> utiliza el servicio
         - Si no tiene ---> Lo rechazamos
         - Si tiene permisos parcialmente para accede a una ruta especifica de un servicio especifico

ADMIN
acceso a todo
Cliente
servicios
    consultar todos
    consultar uno

## MongoDB Atlas y Mongoose

Instalar dependencias con `npm install`. Node 20.19 o superior (recomendado Node 24).
Copiar `.env.example` a `.env` solo si todavia no existe. Completar:

```dotenv
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CLAVE@CLUSTER/booking_system
```

Usar la URI real de Atlas, con un usuario de base de datos y la IP autorizada.
No subir `.env` ni compartir credenciales. `npm run dev` conecta primero la base y despues inicia HTTP.
Sin MONGODB_URI el servidor indica que falta configurar el entorno.

La persistencia activa es MongoDB. Los JSON y DAOs FileSystem se conservan como referencia;
no se importan automaticamente ni se modifican. Los IDs de Mongo son `_id` (ObjectId), no los numeros de los JSON.

### Reservas

El modelo sigue clase10: `clientName`, `clientEmail`, `date`, `time`, `status` y `services`.
Sustituye el modelo anterior con `user` y fecha por cada servicio. El horario ahora pertenece a la reserva.

- `POST /api/bookings`: body con nombre, email, fecha y hora. Estado inicial `pending`.
- `POST /api/bookings/:bid/services/:sid`: agrega un servicio existente, sin body; repetir incrementa cantidad.
- `GET /api/bookings/:bid`: consulta una reserva.
- `PATCH /api/bookings/:bid/status`: body `{ "status": "confirmed" }`.
- Estados permitidos: `pending`, `confirmed`, `cancelled`. No se imponen transiciones adicionales.

Los modelos de servicios, reservas y mensajes tienen timestamps. El hook `pre("save")` de reservas
asigna `updatedAt` con una funcion tradicional para practicar el ejercicio.
Las actualizaciones por query no ejecutan ese hook: `timestamps` actualiza la fecha en esos casos.
Los DAOs usan `returnDocument: "after"` (equivalente moderno de `new: true`) y `runValidators: true`.
El modelo de mensajes esta preparado; no hay endpoints de mensajes en esta unidad.

### Postman y comprobaciones

Importar `postman/mongodb.postman_collection.json` y ejecutar las solicitudes en orden.
Guarda los ObjectIds automaticamente. La coleccion anterior de bookings corresponde a FileSystem.

`npm test` verifica schemas, hooks, validaciones, actualizacion de estados y endpoints con persistencia simulada.
No necesita Atlas. La conexion y operaciones reales quedan por verificar al configurar la URI.


### Metodos adicionales

- `GET /api/bookings`: lista reservas.
- `DELETE /api/bookings/:bid`: elimina la reserva.
- `DELETE /api/bookings/:bid/services/:sid`: quita la entrada completa del servicio, sin decrementar de a una unidad.
- `GET /api/messages` y `GET /api/messages/:mid`: lista y detalle.
- `POST /api/messages`: crea con `{ "user": "Ana", "message": "Hola" }`.
- `PUT /api/messages/:mid`: reemplaza user y message (enviar ambos).
- `DELETE /api/messages/:mid`: elimina un mensaje.

La coleccion MongoDB de Postman incluye estas llamadas. Las vistas Handlebars y Socket.io
se prepararon como guion docente externo y todavia no se aplicaron a este proyecto.
