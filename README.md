# Renault Plan Rombo - Simulador de Presupuestos

Aplicación web para calcular y comparar financiaciones directo de fábrica de Renault (Plan Rombo), préstamos personales y créditos UVA. Incluye una calculadora para clientes, un panel para vendedores y un módulo de administración.

## Demo en Vivo

**[Aquí podrás pegar el enlace a tu demo de GitHub Pages una vez desplegado]**

---

## Características Principales

*   **Panel de Cliente (Público):**
    *   Simulador interactivo para calcular presupuestos de Plan de Ahorro.
    *   Recomendador automático de la "Mejor Opción" según el capital y la cuota objetivo.
    *   Comparativa con alternativas de Préstamo Prendario y Crédito UVA.
    *   Generación de presupuestos en PDF y opción para compartir por WhatsApp.

*   **Panel de Vendedor (Requiere Login):**
    *   Todas las funcionalidades del cliente.
    *   Personalización de los datos del asesor y del cliente para los presupuestos.
    *   (Próximamente) Historial de presupuestos generados.

*   **Panel de Administración (Rol Admin):**
    *   CRUD completo de los planes de ahorro (modelos, precios, cuotas, etc.).
    *   Configuración global de parámetros financieros (tasas de préstamos, valor UVA, etc.).
    *   Personalización de la marca (logo para los PDFs).

## Stack Tecnológico

*   **Frontend:** React 18, TypeScript, TailwindCSS.
*   **UI/Componentes:** Componentes a medida con clases de TailwindCSS.
*   **Backend & Autenticación:** [Supabase](https://supabase.com/) (Base de datos PostgreSQL, Autenticación, Roles).
*   **Generación de PDF:** `jsPDF` y `jspdf-autotable`.
*   **Sin Bundler:** El proyecto se ejecuta directamente en el navegador usando ES Modules, `importmap` y **Babel Standalone** para transpilar TypeScript/JSX en tiempo real.

---

## 🚀 Puesta en Marcha y Configuración

Sigue estos pasos para ejecutar el proyecto localmente.

### 1. Configuración de Supabase (Backend)

Esta aplicación depende de Supabase para la autenticación y (en un futuro) para la base de datos.

1.  **Crea una cuenta** en [supabase.com](https://supabase.com/) y crea un nuevo proyecto.
2.  Ve a la **configuración del proyecto** (ícono de engranaje).
3.  En el menú lateral, ve a **API**.
4.  Copia la **URL del Proyecto** y la clave pública **anon (public)**.
5.  Abre el archivo `lib/supabase/client.ts` en este proyecto y reemplaza los valores de `supabaseUrl` y `supabaseAnonKey` con los tuyos.

### 2. Creación y Configuración de Roles de Demo (Método SQL)

La interfaz de Supabase para editar metadatos de usuario ha cambiado. El método más fiable para asignar roles es a través del **Editor SQL**.

1.  **Crear los usuarios:**
    *   En tu proyecto de Supabase, ve a la sección **Authentication > Users**.
    *   Haz clic en **"Add user"** para crear los siguientes dos usuarios:
        *   **Email:** `admin@demo.com`, **Password:** `Interact2`
        *   **Email:** `lugones@demo.com`, **Password:** `150519`

2.  **Asignar roles con SQL:**
    *   En el menú lateral de Supabase, ve al **SQL Editor** (ícono de base de datos).
    *   Haz clic en **"+ New query"**.
    *   Copia el siguiente comando para el **usuario administrador**, pégalo en el editor y haz clic en **"RUN"**.
      ```sql
      update auth.users
      set raw_user_meta_data = raw_user_meta_data || '{"role": "ADMIN"}'
      where email = 'admin@demo.com';
      ```
    *   Crea una nueva consulta (**"+ New query"**).
    *   Copia el siguiente comando para el **usuario vendedor**, pégalo y haz clic en **"RUN"**.
      ```sql
      update auth.users
      set raw_user_meta_data = raw_user_meta_data || '{"role": "VENDEDOR"}'
      where email = 'lugones@demo.com';
      ```

¡Listo! Con estos dos comandos, los roles quedarán correctamente asignados y el sistema de login funcionará como se espera.

### 3. Ejecución Local

Este proyecto no necesita un proceso de compilación (`build`). Puedes ejecutarlo con cualquier servidor web estático.

1.  Abre una terminal en la raíz del proyecto.
2.  Si tienes `live-server` instalado en Node.js, simplemente ejecuta:
    ```bash
    live-server
    ```
3.  Si no, puedes usar el servidor incorporado de Python (Python 3):
    ```bash
    python3 -m http.server
    ```
4.  Abre tu navegador y ve a la dirección que te indica la terminal (generalmente `http://127.0.0.1:8080` o `http://localhost:8000`).

---

## 🌐 Despliegue en GitHub Pages

Puedes desplegar una versión de demo de esta aplicación de forma gratuita usando GitHub Pages. El código ya está preparado para funcionar sin configuración extra.

1.  **Crea un repositorio en GitHub** y sube todos los archivos del proyecto.
2.  En tu repositorio de GitHub, ve a la pestaña **"Settings"**.
3.  En el menú lateral, selecciona **"Pages"**.
4.  En la sección "Build and deployment", bajo "Source", selecciona **"Deploy from a branch"**.
5.  Elige la rama `main` (o la que estés usando) y la carpeta `/ (root)`.
6.  Haz clic en **"Save"**.

GitHub tardará uno o dos minutos en desplegar tu sitio. Una vez listo, verás la URL pública en la misma página de configuración.

**¿Por qué funciona?**
Este proyecto incluye soluciones para los dos problemas comunes de las aplicaciones de una sola página (SPA) en GitHub Pages:
1.  **Rutas Relativas:** Todas las rutas a archivos y enlaces de navegación se ajustan automáticamente para funcionar dentro del subdirectorio de tu repositorio.
2.  **Enrutamiento del Lado del Cliente:** Se ha incluido un archivo `404.html` que redirige cualquier solicitud de una página desconocida (como `/vendedor`) de vuelta a la aplicación principal, permitiendo que el enrutador de React maneje la vista correcta.