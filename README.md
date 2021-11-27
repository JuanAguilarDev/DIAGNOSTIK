# DIAGNOSTIK
Scholar proyect 


## Ejecutar el programa
npm start


### Crear ejecutables
Se necesita el paquete electron-packager

#### IOS
electron-packager . --overwrite --platform=darwin --arch=x64 --icon=assets/icons/mac/icon.icns --prune=true --out=release-builds

#### WINDOWS
electron-packager ./ --platform=win32 --arch=x64 --version=0.37.2 --icon=./images/favicon.ico

##### Base de datos
La conexion esta hecha a una bd remota que pertenece a mi cuenta, por lo que para ver los cambios en la base de datos es necesario que la conexion pertenezca a una bd propia, ya sea local o remota. El archivo de la conexion esta dentro de la carpeta db.