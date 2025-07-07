# dashboard-ecoalertas
# EcoAlertas Dashboard

**EcoAlertas Dashboard** es una aplicación web de React + TypeScript diseñada para visualizar, filtrar y gestionar reportes ciudadanos de incidencias urbanas y ambientales en tiempo real.

## 🚀 Características principales

* **Fetch real** de datos desde `/api/reportes` con manejo de estado de carga y errores.
* **Actualizaciones en tiempo real** vía WebSocket (Socket.io) con notificaciones emergentes (`toast`).
* **Mapa interactivo** usando React‑Leaflet para geolocalizar y clusterizar reportes.
* **Gráficos dinámicos** con Recharts: barras, pastel y líneas.
* **Filtros avanzados**: búsqueda por texto, rangos de fechas (react-datepicker), multi‑categoría y multi‑estado.
* **Paginación** de la tabla de reportes con `react-table`.
* **Exportación a CSV** de la vista filtrada.
* **Modo claro/oscuro** con toggle (lucide-react).
* **Internacionalización** con `i18next` (soporte para `es-AR` e `en-US`).
* **Lazy‑loading** de gráficos y componentes pesados con `React.lazy` y `Suspense`.

## 📦 Tecnologías y librerías

* **React** + **TypeScript**
* **Recharts** para visualización de datos
* **React‑Leaflet** / **Leaflet** para mapas
* **Socket.io-client** para real‑time
* **react-table** para tablas y paginación
* **react-datepicker** para selección de fechas
* **react-hot-toast** para notificaciones
* **i18next** / **react-i18next** para i18n
* **file-saver** para exportar CSV
* **lucide-react** para iconos

## 📥 Instalación

1. Clonar el repositorio:

   ```bash
   git clone git@github.com:<tu-usuario>/ecoalertas-dashboard.git
   cd ecoalertas-dashboard
   ```
2. Instalar dependencias:

   ```bash
   npm install
   # o
   yarn install
   ```

## ⚙️ Uso

1. Configurar el endpoint de la API en `.env` (por ejemplo `REACT_APP_API_URL=http://localhost:4000/api`).
2. Iniciar la aplicación en modo desarrollo:

   ```bash
   npm start
   # o
   yarn start
   ```
3. Abrir `http://localhost:3000` en tu navegador.

## 📁 Estructura del proyecto

```text
src/
├── components/        # Componentes reutilizables
├── hooks/             # Custom hooks (fetch, socket)
├── pages/             # Vistas y rutas principales
├── services/          # Cliente API y configuración de Socket.io
├── styles/            # Estilos globales y temas
└── App.tsx            # Punto de entrada
```

## 🛠️ Scripts disponibles

* `npm start` / `yarn start`: desarrollo con hot-reload.
* `npm build` / `yarn build`: compilación para producción.
* `npm test` / `yarn test`: ejecutar tests.

## 🤝 Contribuir

1. Haz un fork del repositorio.
2. Crea una rama con tu feature o fix: `git checkout -b feature/nombre`.
3. Haz commits descriptivos y push a tu rama.
4. Abre un Pull Request describiendo tu propuesta.

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Véase [LICENSE](LICENSE) para más detalles.

---

*Desarrollado por EcoAlertas*
