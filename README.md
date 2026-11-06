<img src="./isft151-pp3/blob/main/docs/logo.png" alt="WebCraft" width="180">

&nbsp;

<h1 align="center">WebCraft</h1>
<p align="center">Recurso didáctico para la enseñanza de HTML/CSS.</p>

&nbsp;

---

## Acerca del proyecto

**WebCraft** es una herramienta educativa interactiva desarrollada con **Blockly**, orientada a estudiantes de nivel secundario e inicial que desean introducirse en el desarrollo web.

La aplicación permite crear páginas mediante bloques visuales que representan elementos HTML y propiedades CSS. Así, los estudiantes pueden construir documentos sin necesidad de escribir manualmente la sintaxis desde el comienzo.

A medida que se organiza el workspace, WebCraft genera el código correspondiente y muestra el resultado en una vista previa en tiempo real. También permite consultar el HTML y los estilos CSS generados.

## Planilla de supervisión y seguimiento de avance del proyecto

[https\://docs.google.com/spreadsheets/d/1KiLWgi2CvJyBPv\_xerNThKZcEdv9ezuZ6eDdofNZd74/edit?gid=0\#gid=0](https://docs.google.com/spreadsheets/d/1KiLWgi2CvJyBPv_xerNThKZcEdv9ezuZ6eDdofNZd74/edit?gid=0#gid=0)

&nbsp;

## Hipervínculo de videos

[WebCraft difusión&nbsp;&nbsp;](https://youtu.be/QymqmujBeJQ)

[Short Webcraft difusión&nbsp;](https://youtube.com/shorts/RUjE1hoHdIA)

[WebCraft demostración-explicación&nbsp;](https://youtu.be/fj5dIbRI7H4)&nbsp;

## Características principales

- **Programación visual:** construcción de páginas web mediante bloques de Blockly.  
- **Estructura HTML:** creación de contenedores y organización del contenido.  
- **Contenido y texto:** incorporación de párrafos, textos, enlaces e imágenes.  
- **Formularios:** composición de campos de entrada, casillas de verificación, botones de opción y botones.  
- **Estilos CSS:** personalización de colores, dimensiones, bordes, espaciado y tipografía.  
- **Vista previa en vivo:** visualización del resultado generado durante la edición.  
- **Inspección del código:** consulta del HTML producido y del CSS extraído.  
- **Persistencia local:** conservación del estado del workspace en el almacenamiento del navegador.  
- **Gestión de proyectos:** importación y exportación de proyectos para continuar trabajando.  
- **Exportación:** descarga del HTML generado y exportación de la vista previa como imagen PNG.

## Tecnologías utilizadas

| Tecnología | Uso en el proyecto |
| :---- | :---- |
| **HTML5** | Estructura de la aplicación y de los documentos generados. |
| **CSS3** | Diseño visual, distribución de paneles y estilos de la interfaz. |
| **JavaScript (ES Modules)** | Lógica de la aplicación y coordinación de sus componentes. |
| **Blockly** | Entorno de programación visual y generación de código. |
| **Web Components** | Construcción de componentes personalizados y encapsulados. |
| **html2canvas** | Exportación de la vista previa a formato PNG. |
| **DOMParser** | Análisis del documento generado para identificar y extraer estilos. |
| **localStorage** | Persistencia local del estado del workspace. |

## Arquitectura

WebCraft combina el patrón **Modelo-Vista-Controlador (MVC)** con **Web Components** nativos. Esta organización permite separar el estado de la aplicación, la interfaz y la coordinación de eventos, además de mantener los componentes encapsulados y reutilizables.

### Componentes principales

- **Aplicación principal:** reúne los componentes y coordina el funcionamiento general.  
- **Header:** concentra las acciones globales, como previsualizar, guardar y exportar.  
- **Blockly Workspace:** proporciona el área de trabajo donde se construyen las páginas mediante bloques.  
- **Live Preview:** muestra el documento HTML generado dentro de un entorno aislado.  
- **Code Preview:** permite consultar por separado el HTML y el CSS resultantes.

Los componentes se comunican mediante eventos personalizados. Cuando el workspace cambia, la aplicación distribuye la actualización a los paneles que necesitan reflejar el nuevo contenido.

<p align="center">
  <img src=".isft151-pp3/blob/main/docs/arquitectura.png" alt="Diagrama de arquitectura de WebCraft" width="85%">
</p>

&nbsp;

### Workspace y generación de código

El workspace utiliza un generador personalizado basado en Blockly para transformar los bloques visuales en HTML y estilos CSS.

El toolbox reúne las categorías de bloques y centraliza su registro. Cada categoría aporta sus bloques, la definición visual que aparece en el toolbox y la lógica necesaria para generar el contenido correspondiente.

Las categorías disponibles son:

| Categoría | Descripción |
| :---- | :---- |
| **Estructura HTML** | Elementos contenedores y organización general del documento. |
| **Contenido y texto** | Párrafos, textos, enlaces e imágenes. |
| **Formularios** | Controles y elementos básicos de interacción. |
| **Diseño y espaciado** | Colores de fondo, dimensiones, márgenes, rellenos y bordes. |
| **Tipografía** | Color, tamaño, alineación y familia de fuentes. |

Los bloques de estilos se aplican dentro de contenedores válidos, lo que permite mantener una estructura coherente al generar el documento.

### Flujo de trabajo

1. El usuario incorpora y organiza bloques en el workspace.  
2. Blockly detecta los cambios realizados.  
3. El generador personalizado produce el HTML y los estilos correspondientes.  
4. La vista previa en vivo actualiza el resultado visual.  
5. El panel de código permite inspeccionar el HTML y el CSS generados.  
6. El usuario puede guardar el proyecto o exportar el resultado.

<p align="center">
  <img src="./isft151-pp3/blob/main/docs/flujo.png" alt="Diagrama del flujo de WebCraft" width="85%">
</p>

&nbsp;

## Estructura del repositorio

El repositorio está organizado en directorios que separan la aplicación, la documentación, las pruebas y los recursos complementarios.

| Directorio | Propósito |
| :---- | :---- |
| `frontend/` | Interfaz, componentes Web Components e integración con Blockly. |
| `backend/` | Espacio reservado para componentes del servidor. |
| `api/` | Documentación y contratos de API. |
| `srs/` | Documentación de la Especificación de Requisitos de Software. |
| `docs/` | Documentación de Aplicación. |
| `testing/` | Pruebas y scripts de verificación. |
| `release/` | Recursos destinados al empaquetado y despliegue. |
| `media/` | Material institucional e imágenes del proyecto. |

Dentro del frontend, los componentes principales se encuentran en `frontend/wc/`. Allí se organizan los webcomponents en `/model`, `/view` y `/controller`, estos son la aplicación, el workspace, los paneles de previsualización, los estilos y los módulos que definen las categorías de bloques.

## Instalación y ejecución local

WebCraft puede ejecutarse localmente desde Visual Studio Code utilizando la extensión **Live Server**.

1. Clonar o descargar el repositorio.  
2. Abrir el proyecto en Visual Studio Code.  
3. Verificar que las dependencias y los recursos necesarios estén disponibles.  
4. Iniciar Live Server desde el documento `frontend/index.html`.  
5. Abrir la dirección local proporcionada por la extensión. La configuración documentada utiliza el puerto **5501**.

Se utiliza un servidor HTTP local para que el navegador pueda resolver correctamente los módulos JavaScript y los recursos de la aplicación. No se recomienda abrir el documento directamente mediante el protocolo `file://`.

## Persistencia y gestión de proyectos

El estado del workspace se conserva en el almacenamiento local del navegador, lo que permite recuperar el trabajo entre sesiones en el mismo entorno.

Además, WebCraft contempla la gestión de proyectos mediante archivos JSON. Esta funcionalidad permite exportar el estado del workspace e importarlo posteriormente para continuar la edición.

## Pruebas y documentación

El repositorio contempla un directorio específico para las pruebas y otro para la documentación de requisitos del sistema. También reserva espacios para los recursos de API, backend y despliegue.

La documentación técnica complementaria describe la arquitectura frontend, los componentes MVC, el sistema de bloques, la generación de código y las dependencias utilizadas.

## Change Log

### v1.0.0 \- Versión inicial

**Added**

- Implementación del entorno visual de programación mediante Blockly.  
- Incorporación de bloques para generar estructuras HTML y estilos CSS.  
- Implementación de la vista previa en tiempo real.  
- Incorporación del panel para visualizar el código generado.  
- Implementación de la arquitectura MVC mediante Web Components.  
- Funcionalidad para guardar proyectos en LocalStorage.  
- Opciones para importar y exportar proyectos en formato JSON.  
- Funcionalidad para descargar el código HTML generado.  
- Exportación de la vista previa como imagen PNG.

## Licencia

WebCraft se distribuye bajo la licencia **GNU General Public License v3.0 (GPL-3.0)**. Esta licencia permite utilizar, estudiar, modificar y redistribuir el software bajo sus condiciones, incluyendo los requisitos de copyleft aplicables a las obras derivadas.

Para más información, consultar el archivo `LICENSE` incluido en el repositorio.

---

<p align="center"><strong>WebCraft</strong> · Proyecto académico</p>
<p align="center">desarrollado por:   <strong>Fernández Pego, Rocio - Luzuriaga, Silvana - Cichillitti, Rosmary</strong></p>
<p align="center"> para: Prácticas Profesionalizantes III - Prof: Matias Santiago </p>
<p align="center"> ISFT N° 151 - 2026 </p>
