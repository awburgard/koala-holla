$( document ).ready( function(){
  // Establish Click Listeners
  setupClickListeners()
  // load existing koalas on page load
  getKoalas();
}); // end doc ready

function setupClickListeners() {
  $( '#addButton' ).on( 'click', function(){
    // get user input and put in an object
    // NOT WORKING YET :(
    // using a test object
    let koalaToSend = {
      name: $('#nameIn').val(),
      age: $('#ageIn').val(),
      gender: $('#genderIn').val(),
      readyForTransfer: ($('#readyForTransferIn').val() === 'Yes'),
      notes: $('#notesIn').val(),
    };
    // call saveKoala with the new obejct
    saveKoala( koalaToSend );
  });

  $( '#viewKoalas' ).on('click', '.js-btn-readyForTransfer', updateKoala);
  $( '#viewKoalas' ).on('click', '.js-btn-delete', deleteKoala);
}

function getKoalas(){
  // ajax call to server to get koalas
  $.ajax({
    type: 'GET',
    url: '/koalas'
  }).then(function(response) {
    render(response);
  });
} // end getKoalas

function saveKoala( newKoala ){
  // ajax call to server to get koalas
  $.ajax({
    type: 'POST',
    url: '/koalas',
    data: newKoala
  }).then(function(response) {
    $('#nameIn').val('');
    $('#ageIn').val('');
    $('#genderIn').val('Male');
    $('#readyForTransferIn').val('Yes');
    $('#notesIn').val('');

    swal("Good job!", "Your Koala has been added!", "success", {
      button: "Aww yiss!",
    });

    getKoalas(response);

  }).catch(function (response) {
    swal("Crap!", "There was an error saving your Koala!", "error", {
      button: "Boo!",
    });
  });
}

function deleteKoala () {
  const id = $(this).parent().parent().data('id');

  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this Koala!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      $.ajax({
        type: 'DELETE',
        url: '/koalas/' + id
      }).then(function(response) {
        getKoalas();
      });

      swal("Poof! Your Koala has been deleted!", {
        icon: "success",
      });
    } else {
      swal("Your Koala is safe!");
    }
  });
}

function updateKoala() {
  const id = $(this).parent().parent().data('id');

  $.ajax({
    type: 'PUT',
    url: '/koalas/' + id
  }).then(function(response) {
    getKoalas();
  });
}

function render(koalas) {
  $('#viewKoalas').empty();
  for (let koala of koalas) {
    let readyForTransfer = 'No';

    if (koala.ready_to_transfer) {
      readyForTransfer = 'Yes';
    }

    let markReadyElement = `<td></td>`;

    if(koala.ready_to_transfer == false) {
      markReadyElement = `<td><button class="js-btn-readyForTransfer btn btn-info">Transfer</button></td>`
    }

    let renderGender = `<img
                          src="./images/koalaBoy.svg"
                          alt="Boy Koala"
                          height="70px"
                          width="70px" />`;

    if(koala.gender == 'Female') {
      renderGender = `
        <img
          src="./images/koalaGirl.svg"
          alt="Girl Koala"
          height="70px"
          width="70px" />`;
    }

    $('#viewKoalas').append(`
        <tr data-id="${koala.id}">
          <td>${koala.name}</td>
          <td>${koala.age}</td>
          <td>${renderGender}</td>
          <td>${readyForTransfer}</td>
          <td>${koala.notes}</td>
          ${markReadyElement}
          <td><button class="js-btn-delete btn btn-danger">Delete</button></td>
        </tr>`
    );
  }
}
