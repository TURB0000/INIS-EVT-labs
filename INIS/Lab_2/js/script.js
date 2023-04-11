const personalMovieDB = {
    privat: false,
    movies: [
        {name: 'movie1', rating: 1},
    	{name: 'movie2', rating: 2},
	    {name: 'movie3', rating: 3},
    ],
};

if(personalMovieDB.privat != true){

    let table = document.createElement('table');

    for (let i=0; i<personalMovieDB.movies.length; i++){
        let newRow = table.insertRow();

        let newCell = newRow.insertCell();

        newCell.appendChild(document.createTextNode(personalMovieDB.movies[i].name));

        newCell = newRow.insertCell();

        newCell.appendChild(document.createTextNode(personalMovieDB.movies[i].rating));
    }

    document.body.append(table);

}