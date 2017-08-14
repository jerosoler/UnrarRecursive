var fs = require('fs');
var watch = require('node-watch');
var path = require('path')

var exec = require('child_process').exec;
var https = require('https');

var directorioNAS = '/home/motoraton/testrar';



console.log("Inicia");

watch(directorioNAS, { recursive: true }, function(evt, name) {

  if(evt === 'update') {

    extension = path.extname(name);
    directorio = path.dirname(name);


   var directorio = fs.lstatSync(name).isDirectory();
   if(directorio == true) {  busqueda_directorio(name); }

   var fichero = fs.lstatSync(name).isFile();
   if(fichero == true) { file_descomprimir(name); }




  }
});



function busqueda_directorio(name) {
  fs.readdir(name, function(err, files) {
      if (err) {
        console.log("Error reading " + name);

      }  else {
      console.log("Listing files in Directory " + name);
      files.forEach(function(f) {
        var directorio = name;

        var directorio = fs.lstatSync(name+'/'+f).isDirectory();
        if(directorio == true) {  busqueda_directorio(name+'/'+f); }

        var fichero = fs.lstatSync(name+'/'+f).isFile();
        if(fichero == true) { file_descomprimir(name+'/'+f); }



       });
     }
   });
}

function file_descomprimir(name) {

extension = path.extname(name);
directorio = path.dirname(name);

  if(extension === ".rar") {
    var orinal_name = path.basename(name);

    name = name.replace(/ /g, '\\ ');
    directorio = directorio.replace(/ /g, '\\ ');


    exec("sudo unrar x "+name+" "+directorio+"", function(error, stdout, stderr) {
  if (error) {

    console.error('exec error:'+ error);
    return;
  }


  console.log("Extraido con exito");




  console.log('stderr:'+stderr);
});




   }

}
