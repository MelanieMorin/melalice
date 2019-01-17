jQuery(document).ready(function($){

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  var generate = (comment) => {
    var template = $('#template-comment').html();

    var rendered = Mustache.render(template,{commentaire: comment.commentaire, id: comment.id, user: comment.user});

    $('.modal-comment-content').append(rendered);
  }

  var comments = [];

  var storage = localStorage.getItem("comments");
  if(storage != null) {
    // JSON.parse va transformer le string en tableau d'objets
    comments = JSON.parse(storage)
    comments.forEach((comment) => {
      generate(comment);
    });
  }

  $("body").on('click', '#add-comments', function(event){
    var comment = {
      id: guid(),
      commentaire: $("textarea[name='desc']").val(),
      user: $("input[name='usercomment']").val()
    };
    comments.push(comment)
    // $("#add-comments")[0].reset();

    console.log(comment)

    // Ajouter stringify pour mettre en string le tableau
    localStorage.setItem("comments", JSON.stringify(comments));

    generate(comment);

    return false;
  });

  $("body").on('click', '.view', function(event){

    comments.forEach((comment) => {
      //Permet de générer la modal
      generate(comment);
      $('.modal-comment-content').append(generate);
      //permet d'afficher la modal
      $("#modal_comment").modal();
    });
  });

});
