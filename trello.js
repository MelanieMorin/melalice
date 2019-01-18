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
    tasks = JSON.parse(storage);
    tasks.forEach((task) => {
      generate(task);
    });
  }

  // afficher formulaire
  $("#btn_add").click(function(){
    $("#form-ajouter").slideToggle(400);
  });

  // Voir si le formulaire est valide en lui passant un tableau d'objet.
  //Save en localStorage
  $("#form-ajouter").validate({
    invalidHandler: (event, validator) => {
      console.log("error");
      //si le formulaire n'est pas valide
      $("#error").show();
    },
    submitHandler: () => {
      //si le formulaire est valide
      $("#error").hide();

      var task = {
        id: guid(),
        name: $("input[name='name']").val(),
        user: $("input[name='user']").val(),
        description: $("textarea[name='description']").val(),
        type: $("select[name='type']").val(),
      };

      tasks.push(task);

      $("#form-ajouter")[0].reset();

      // Ajouter stringify pour mettre en string le tableau
      localStorage.setItem("tasks", JSON.stringify(tasks));

      // Appel de notre var pour lire les éléments de Mustache
      generate(task);

      return false;
    }
  });

  //Afficher l'id lié au bouton modifier
  $("ul").on('click', '.edit', function(event){
    $id = $(this).closest('.list-group-item').data("id");
    $("#modal-form").modal();

    tasks.forEach((task) => {
      if($id == task.id){
        // console.log('dkjbhjsqb');
        // $("#modal-form .modal-body").attr("data-id", task.id),
        $("#modal-form input[name='name']").val(task.name),
        $("#modal-form input[name='user']").val(task.user),
        $("#modal-form textarea[name='description']").val(task.description),
        $("#modal-form select[name='type']").val(task.type)
      }
    });
    return false;
  });

  $("#modal-form form").validate({
    invalidHandler: (event, validator) => {
      console.log("error");
    },
    submitHandler: () => {
      tasks.forEach((task) => {
        if($id == task.id){

          task.name = $("#modal-form input[name='name']").val();
          task.user = $("#modal-form input[name='user']").val();
          task.description = $("#modal-form textarea[name='description']").val();
          task.type = $("#modal-form select[name='type']").val();

          //On actualise le nom de la tâche au niveau du DOM
          $("li.list-group-item[data-id="+task.id+"]").remove();
          generate(task);

          //Persiter au niveau du localstorage
          localStorage.setItem("tasks", JSON.stringify(tasks));

          // On cache le modal
          $("#modal-form").modal('hide');

          swal(
            'Succès !',
            'Vous venez de modifier la tâche.',
            'success'
          );
        }
      });
    }
  });


  // Afficher popup, voir les éléments
  $("body").on('click', '.view', function(event){
    $id = $(this).closest('.list-group-item').data("id")

    tasks.forEach((task) => {
      if($id == task.id){

        //Permet de générer la modal
        var template = $('#template-modal').html();

        var rendered = Mustache.render(template,{name: task.name, user: task.user, desc: task.description, id: task.id});

        //Permet d'injecter la modal au DOM
        $('#task-view').append(rendered);

        //Permet d'afficher la modal
        $("#modal").modal();

        return;
      }
    });
  });

  $("body").on('click', '.remove', function(event){
    $li = $(this).closest('.list-group-item');
    $id = $li.data("id");

    swal({
      title: 'Êtes-vous sûr ?',
      text: "Voulez-vous supprimer cette tâche ?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.value) {

        var i = 0;

        tasks.forEach((task) => {
          if($id == task.id){
            $li.slideUp(400, () => {
                $li.remove();
            });

            // Supprimer au niveau du tableau
            tasks.splice(i, 1);

            //Persiter au niveau du localstorage
            localStorage.setItem("tasks", JSON.stringify(tasks));
          }
          i++
        });
        swal(
          'Supprimé !',
          'Vous venez de supprimer la tâche.',
          'success'
        );
      }
    })
  });

  // suppression avec checkbox
  $("#btn_remove").click(() => {
    var i = 0;

    $(".list-group-item").each(function(){
      if($(this).find("input[type='checkbox']").is(":checked")){
        $(this).remove();

        // On récupère le data-id qui se trouve sur le li
        // récupérer l'id de l'élémént courant
        var id = $(this).data("id");

        tasks.forEach((task) => {
          if(id == task.id){
            var j = 0;
            // Supprimer au niveau du tableau
            tasks.splice(j, 1);

            //Persiter au niveau du localstorage
            localStorage.setItem("tasks", JSON.stringify(tasks));
          }
          j++;
        });
        i++;
      }
    });

    var plurialize = " tâches";
    if(i <= 1){
      var plurialize = " tâche";
    }
    swal(
      'Supprimé !',
      'Vous venez de supprimer '+i + plurialize + '.',
      'success'
    )
  });

  // décocher / cocher les cases
  var checked = false
  $("#btn_info").click(() => {
    checked = !checked;
    $('input:checkbox').prop('checked', checked);
  });

});

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
