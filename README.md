# FrameBrew para Samsung TizenBrew

Galería de cuadros con marcos digitales, paspartú, cambio automático y navegación con control remoto. Versión experimental 0.1.0 preparada para probar en Samsung UN50RU7100FXZX (2019, Tizen 5.0), pero aún no validada físicamente en ese modelo.

Este es un módulo web de TizenBrew, desarrollado desde cero para reproducir funcionalidades básicas de una galería estilo The Frame/Backdrop. No es el Art Mode oficial de Samsung, ni un port literal del código de Backdrop. No requiere root, ni firmware modificado, ni Tizen Studio, ni instalar un `.wgt` adicional. No proporciona sensores de movimiento, control de brillo físico ni modo de suspensión inteligente.

## Instalación desde GitHub

1. Descomprime este ZIP en la computadora.
2. Crea un repositorio público en GitHub llamado `FrameBrew` (o cualquier nombre) y sube el contenido de la carpeta `framebrew/` a la raíz del repositorio. Importante: en la raíz deben quedar `package.json`, `README.md` y la carpeta `app/`.
3. En la TV, abre TizenBrew → Module Manager → Add GitHub Module.
4. Introduce `TU_USUARIO/FrameBrew` (sustituye tu usuario real de GitHub). No incluyas `https://github.com/` ni `gh/`.
5. Cierra y vuelve a abrir TizenBrew. Selecciona FrameBrew.

TizenBrew usa un CDN para cargar módulos de GitHub; los cambios pueden tardar por la caché. Si la app no carga, comprueba que el repositorio sea público y exista `app/index.html` y `package.json` en la raíz correcta.

## Control remoto

- Izquierda / derecha: cuadro anterior / siguiente.
- OK (Enter): abrir menú de ajustes.
- En ajustes: arriba/abajo selecciona, izquierda/derecha cambia opción, OK avanza al siguiente valor.
- Atrás: cierra los ajustes; fuera del menú, intenta volver al lanzador.
- Play/Pause (si la TV entrega el evento): pausa/reanuda la presentación.

Se deja `"keys": []` en `package.json`: no registra `Back`/`Return`, que son teclas no registrables. Las teclas de navegación se reciben normalmente como eventos del navegador.

## Poner tus cuadros o fotos

1. Coloca JPG, PNG o imágenes SVG en `app/art/`. Preferible 3840 × 2160 o mayor; evita archivos enormes.
2. Abre `app/gallery.js` y añade una entrada como esta:

   ```javascript
   { title: 'Mi pintura', author: 'Colección personal', src: 'art/mi-pintura.jpg' },
   ```

3. Sube los cambios al mismo repositorio de GitHub.
4. Cierra/reabre TizenBrew para que cargue la nueva versión (la caché CDN puede demorar la actualización).

Se incluyen cinco obras abstractas originales en SVG (no dependen de servidores externos). Los ajustes se guardan en `localStorage` si la TV permite ese almacenamiento. Las imágenes se cargan como archivos estáticos del módulo; no se garantiza que queden disponibles sin conexión, puesto que TizenBrew puede servir los archivos mediante la red.

## Prueba en PC

Puedes abrir `app/index.html` en Chrome/Edge y usar las flechas del teclado. También se puede iniciar un servidor con `python -m http.server 8000` en la raíz y visitar `http://localhost:8000/app/`.

## Limitaciones y seguridad

- El módulo no modifica el firmware ni intenta instalar Tizen 6.0.
- No se integra con Art Mode oficial, botón de encendido, sensores o DRM.
- El ajuste «Iluminación simulada» dibuja una capa oscura: no disminuye físicamente el brillo/consumo del panel.
- Ningún ajuste evita automáticamente que imágenes estáticas prolongadas puedan dejar retención en ciertas tecnologías de pantalla.
- El funcionamiento definitivo en tu Tizen 5.0 debe probarse en la TV; este archivo se valida estáticamente y en navegador de escritorio.

## Referencias

- TizenBrew módulos: https://github.com/reisxd/TizenBrew/blob/main/docs/MODULES.md
- Backdrop (inspiración funcional, no código incorporado): https://github.com/harshad2112/backdrop
