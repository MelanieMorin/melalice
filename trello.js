jQuery(document).ready(function($){
  
	var generate = (task) => {
    	var template = $('#template').html();

    	var rendered = Mustache.render(template,{name: task.name, user: task.user, desc: task.description, id: task.id});
    	$('ul#' + task.type).append(rendered);

    // console.log(task)
  }

  var tasks = [];

  var storage = localStorage.getItem("tasks");
  if(storage != null) {
    // JSON.parse va transformer le string en tableau d'objets
    tasks = JSON.parse(storage)
    tasks.forEach((task) => {
      generate(task);
    });
  }

  // afficher formulaire
  $("#btn_add").click(function(){
    $("#form-ajouter").slideToggle(400)
  });

  // Voir si le formulaire est valide en lui passant un tableau d'objet.
  //Save en localStorage
  $("#form-ajouter").validate({
    invalidHandler: (event, validator) => {
      console.log("error")
      //si le formulaire n'est pas valide
      $("#error").show()
    },
    submitHandler: () => {
      //si le formulaire est valide
      $("#error").hide()

      var task = {
        id: guid(),
        name: $("input[name='name']").val(),
        user: $("input[name='user']").val(),
        description: $("textarea[name='description']").val(),
        type: $("select[name='type']").val(),
      };

      tasks.push(task)

      $("#form-ajouter")[0].reset();

      // Ajouter stringify pour mettre en string le tableau
      localStorage.setItem("tasks", JSON.stringify(tasks));

      // Appel de notre var pour lire les éléments de Mustache
      generate(task);

      return false;
    }
  });
  
});

  
function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

