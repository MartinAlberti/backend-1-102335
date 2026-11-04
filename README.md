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