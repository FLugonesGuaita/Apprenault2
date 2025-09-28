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
*   **Sin Bundler:** El proyecto se ejecuta directamente en el navegador usando ES Modules y `importmap`.

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

### 2. Creación de Usuarios de Demo

Para poder probar los roles de Vendedor y Administrador, debes crear los usuarios en tu panel de Supabase.

1.  En tu proyecto de Supabase, ve a la sección **Authentication**.
2.  Haz clic en **"Add user"** para crear los siguientes dos usuarios:
    *   **Usuario Administrador:**
        *   **Email:** `admin@demo.com`
        *   **Password:** `Interact2`
    *   **Usuario Vendedor:**
        *   **Email:** `lugones@demo.com`
        *   **Password:** `150519`
3.  Una vez creados, haz clic en cada usuario y ve a la sección **"User Metadata"**.
    *   Para `admin@demo.com`, agrega: `{ "role": "ADMIN" }`
    *   Para `lugones@demo.com`, agrega: `{ "role": "VENDEDOR" }`

¡Listo! Con esto, el sistema de roles y login funcionará correctamente.

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

Puedes desplegar una versión de demo de esta aplicación de forma gratuita usando GitHub Pages.

1.  **Crea un repositorio en GitHub** y sube todos los archivos del proyecto.
2.  En tu repositorio de GitHub, ve a la pestaña **"Settings"**.
3.  En el menú lateral, selecciona **"Pages"**.
4.  En la sección "Build and deployment", bajo "Source", selecciona **"Deploy from a branch"**.
5.  Elige la rama `main` (o la que estés usando) y la carpeta `/ (root)`.
6.  Haz clic en **"Save"**.

GitHub tardará uno o dos minutos en desplegar tu sitio. Una vez listo, verás la URL pública en la misma página de configuración. ¡Cópiala y pégala en la sección "Demo en Vivo" de este README!
