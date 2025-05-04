// callrestapi.js
// Ajusta el host/puerto si tu servidor corre en otro sitio
const url = "https://zallix-mysql-restapi-1074346283359.us-central1.run.app/api/users";
let usersList = [];

// Crea un usuario
function postUser() {
  const payload = {
    name:     $("#name").val(),
    email:    $("#email").val(),
    age:      $("#age").val(),
    comments: $("#comments").val(),
  };

  $.ajax({
    url: url,
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(payload),
    success: function(data) {
      $('#resultado').html("Creado: " + JSON.stringify(data.user));
      getUsers();
    },
    error: function(xhr) {
      $('#resultado').html("Error: " + xhr.responseText);
    }
  });
}

// Lee todos los usuarios y arma la tabla con botones Edit/Delete
function getUsers() {
  $.getJSON(url, function(json) {
    usersList = json.users;
    let html = `
      <table border="1" cellpadding="5">
        <tr>
          <th>ID</th><th>Name</th><th>Email</th><th>Age</th><th>Comments</th><th>Acciones</th>
        </tr>`;

    usersList.forEach(u => {
      html += `
        <tr>
          <td>${u.id}</td>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>${u.age}</td>
          <td>${u.comments}</td>
          <td>
            <button onclick="populateForm(${u.id})">Editar</button>
            <button onclick="deleteUser(${u.id})">Eliminar</button>
          </td>
        </tr>`;
    });

    html += `</table>`;
    $('#resultado').html(html);
  });
}

// Rellena el formulario con los datos del usuario seleccionado
function populateForm(id) {
  const u = usersList.find(x => x.id === id);
  if (!u) return alert("Usuario no encontrado en la lista");

  $("#userId").val(u.id);
  $("#name").val(u.name);
  $("#email").val(u.email);
  $("#age").val(u.age);
  $("#comments").val(u.comments);
}

// Actualiza el usuario cuyo ID está en el campo oculto
function updateUser() {
  const id = $("#userId").val();
  if (!id) return alert("Primero haz click en 'Editar' en la tabla");

  const payload = {
    name:     $("#name").val(),
    email:    $("#email").val(),
    age:      $("#age").val(),
    comments: $("#comments").val(),
  };

  $.ajax({
    url: `${url}/${id}`,
    type: 'PUT',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(payload),
    success: function(data) {
      $('#resultado').html("Actualizado: " + JSON.stringify(data.user));
      getUsers();
    },
    error: function(xhr) {
      $('#resultado').html("Error: " + xhr.responseText);
    }
  });
}

// Elimina al usuario con el ID dado
function deleteUser(id) {
  if (!confirm("¿Seguro que quieres borrar el usuario " + id + "?")) return;

  $.ajax({
    url: `${url}/${id}`,
    type: 'DELETE',
    success: function() {
      $('#resultado').html("Usuario eliminado.");
      getUsers();
    },
    error: function(xhr) {
      $('#resultado').html("Error: " + xhr.responseText);
    }
  });
}
