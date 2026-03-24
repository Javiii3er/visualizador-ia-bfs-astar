import webbrowser
import os
import tempfile

def main():
    # Obtener la ruta del directorio actual
    current_dir = os.path.dirname(os.path.abspath(__file__))
    index_path = os.path.join(current_dir, 'index.html')
    
    # Verificar que index.html existe
    if not os.path.exists(index_path):
        print("\n" + "="*60)
        print(" ERROR: Archivo index.html no encontrado")
        print("="*60)
        print(f" Buscado en: {index_path}")
        print(" Asegúrate de que todos los archivos estén en la misma carpeta.")
        print("="*60)
        input("\n Presiona ENTER para salir...")
        return
    
    try:
        # Leer el archivo HTML
        with open(index_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        # Crear archivo temporal en el mismo directorio
        tmp = tempfile.NamedTemporaryFile(
            mode='w', 
            suffix='.html', 
            delete=False, 
            encoding='utf-8', 
            prefix='IA_Visualizer_',
            dir=current_dir
        )
        
        tmp.write(html_content)
        tmp.close()

        print("\n" + "="*60)
        print(" SISTEMA DE VISUALIZACIÓN DE ALGORITMOS IA")
        print("="*60)
        print(f" [+] Archivo generado: {os.path.basename(tmp.name)}")
        print(f" [+] Ubicación: {tmp.name}")
        print(" [+] Funcionalidades: Cronómetro CPU, Exportación PNG, Logs")
        print(" [+] Algoritmos: BFS (no informado) y A* (heurístico)")
        print("="*60)
        print("\n Abriendo en el navegador...\n")

        # Abrir en navegador
        webbrowser.open('file://' + tmp.name.replace('\\', '/'))
        
        input(" Presiona ENTER para cerrar y eliminar archivos temporales...\n")
        
        # Limpieza de seguridad
        if os.path.exists(tmp.name):
            os.unlink(tmp.name)
            print(" [+] Archivos temporales eliminados correctamente.")
            
    except PermissionError:
        print(f"\n [!] Error: Permiso denegado para escribir en: {current_dir}")
        print(" Intenta ejecutar en una carpeta donde tengas permisos de escritura.")
    except Exception as e:
        print(f"\n [!] Error inesperado: {e}")
        print(" Verifica que todos los archivos estén completos y en la misma carpeta.")
    
    input("\n Presiona ENTER para salir...")

if __name__ == '__main__':
    main()