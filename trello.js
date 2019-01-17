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

