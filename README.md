# POSitive-Backend

API RESTful para el sistema de punto de venta (POS) **POSitive**. Este backend maneja la sincronización de productos, categorías y operaciones del lado del servidor.

## Tecnologías Principales

- **Node.js** & **Express**
- **MySQL** 
- **Dotenv** 

## Requisitos Previos

- Node.js (v14 o superior)
- Servidor MySQL en funcionamiento

## Instalación y Configuración

1. Clonar el repositorio.
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Copiar el archivo de configuración y ajustar las variables:
   ```bash
   cp .env.example .env
   ```
4. Iniciar el servidor:
   ```bash
   npm start
   ```

## Estructura

- `/db` - Conexión a la base de datos.
- `/products` - Rutas y lógica para productos.
- `/category` - Rutas y lógica para categorías.
- `/utils` - Utilidades generales (ej. autenticación).
