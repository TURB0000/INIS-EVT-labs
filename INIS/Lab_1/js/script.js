var numberOfFilms = prompt("Сколько фильмов вы уже посмотрели?");
while (numberOfFilms === null || numberOfFilms === ""){
    numberOfFilms = prompt("Сколько фильмов вы уже посмотрели?");
}

let personalMovieDB = {
    count: numberOfFilms,
    movies: [],
};

var movie1 = prompt("Один из последних просмотренных фильмов?");
while (movie1 === null || movie1 === "" || movie1.length > 50){
    movie1 = prompt("Один из последних просмотренных фильмов?");
}

var mark1 = prompt("На сколько оцените его?");
while (mark1 === null || mark1 === ""){
    mark1 = prompt("На сколько оцените его?");
}

var movie2 = prompt("Один из последних просмотренных фильмов?");
while (movie2 === null || movie2 === "" || movie2.length > 50){
    movie2 = prompt("Один из последних просмотренных фильмов?");
}

var mark2 = prompt("На сколько оцените его?");
while (mark2 === null || mark2 === ""){
    mark2 = prompt("На сколько оцените его?");
}

personalMovieDB.movies.push({ movie: movie1, mark: mark1 }, { movie: movie2, mark: mark2 });

console.log(personalMovieDB);