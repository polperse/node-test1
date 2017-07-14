function deleteUser(){

	var confirmation = confirm('Are you sure?');

	alert('el id es:'+$('.deleteUser').data('id'));

	if (confirmation) {
		$.ajax({
			type: 'DELETE',
			url: '/users/delete/'+$('.deleteUser').data('id')
		}).done(function(response){
			window.location.replace('/');
		});

	} else {
		return false;
	}

}

$(document).ready(function(){
	$('.deleteUser').on('click', deleteUser)
});
