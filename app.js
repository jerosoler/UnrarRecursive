var fs = require('fs');
var watch = require('node-watch');
var path = require('path');
var getUrlsToArray = require('get-urls-to-array');
var request = require('request');
var cheerio = require('cheerio');

var exec = require('child_process').exec;
var https = require('https');

var directorioNAS = '/media/NAS/';



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

    var contrasena = 0;
    if(fs.existsSync(directorio+"/CONTRASEÑA PARA DESCOMPRIMIR.txt")) {
      console.log("HOLA");
      contrasena = 1;
    }



    if(contrasena === 1) {
      console.log("Tiene contraseña");
      fs.readFile(directorio+"/CONTRASEÑA PARA DESCOMPRIMIR.txt", "utf8", function(err, data){
         var url = getUrlsToArray(data);
         console.log(url[0]);

         request(url[0]+"/", function (error, response, html) {
           if (!error && response.statusCode == 200) {
             //item_count2++;
             var $ = cheerio.load(html);

             var password = $("#txt_password").val();
             console.log(password);

             password = password.replace(/ /g, '\\ ');

             name = name.replace(/ /g, '\\ ');
             directorio = directorio.replace(/ /g, '\\ ');


             exec("unrar x "+name+" "+directorio+" -p"+password, function(error, stdout, stderr) {
               if (error) {
                 console.error('exec error:'+ error);
                 return;
               }
               console.log("Extraido con exito");
               console.log('stderr:'+stderr);
             });
           }
         });


      });


    } else {
      console.log("No Tiene contraseña");
      name = name.replace(/ /g, '\\ ');
      directorio = directorio.replace(/ /g, '\\ ');


      exec("unrar x "+name+" "+directorio+"", function(error, stdout, stderr) {
        if (error) {
          console.error('exec error:'+ error);
          return;
        }
        console.log("Extraido con exito");
        console.log('stderr:'+stderr);
      });
    }




   }


}
