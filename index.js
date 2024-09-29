const express = require('express'),
    app = express(),
    morgan = require ('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');
    const path = require("path");    
app.use (bodyParser.json());

let users = [

{   id: 1,
    name:"Kathy",
    favoriteMovies:[]
},
 {   id: 2,
    name:"Todd",
    favoriteMovies:[]
},
]

// Movie Data

let topMovies = [
    {
        title: 'Dune: Part Two',
        description: '2024 American epic science fiction film directed and co-produced by Denis Villeneuve, who co-wrote the screenplay with Jon Spaihts.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Dune_Part_Two_poster.jpeg/220px-Dune_Part_Two_poster.jpeg',
        director: {
            name: 'Denis Villeneuve',
            description:'Denis Villeneuve OC CQ RCA (French: [dəni vilnœv]; born October 3, 1967) is a Canadian filmmaker. He has received seven Canadian Screen Awards as well as nominations for three Academy Awards, five BAFTA Awards, and two Golden Globe Awards.',
        },
        genre: {
            name:'scifi',
            description: 'a film genre that uses fictional science to depict phenomena that are not generally accepted by mainstream science.',
        },
    },
    {
        title: 'Atlas',
        description: ' 2024 American science fiction action film starring Jennifer Lopez as a highly skilled counterterrorism analyst, who harbors a profound skepticism towards artificial intelligence, and who comes to realize that it may be her sole recourse following the failure of a mission aimed at apprehending a rogue robot.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/Atlas_2024_film_poster.png/220px-Atlas_2024_film_poster.png',
        director: {
            name: 'Brad Peyton',
            description:'Brad Peyton (born May 27, 1978) is a Canadian filmmaker, best known for directing the Dwayne Johnson star vehicles Journey 2: The Mysterious Island (2012), San Andreas (2015), and Rampage (2018) as well as the Netflix series Daybreak (2019).',
        },
        genre: {
            name:'scifi',
            description: 'a film genre that uses fictional science to depict phenomena that are not generally accepted by mainstream science.',
        },
    },
    {
        title: 'Code 8: Part II',
        description: ' 2024 Canadian superhero science fiction action film[1] directed by Jeff Chan, who co-wrote the screenplay with Chris Paré, Sherren Lee and Jesse LaVercombe.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/45/Code_eight_part_II_poster.jpg/220px-Code_eight_part_II_poster.jpg',
        director: {
            name:'Brad Peyton',
            description:'Brad Peyton (born May 27, 1978) is a Canadian filmmaker, best known for directing the Dwayne Johnson star vehicles Journey 2: The Mysterious Island (2012), San Andreas (2015), and Rampage (2018) as well as the Netflix series Daybreak (2019).',
        },
        genre: {
            name:'scifi',
            description: 'a film genre that uses fictional science to depict phenomena that are not generally accepted by mainstream science.',
        },
    },
    {
        title: 'Rebel Moon – Part Two: The Scargiver',
        description: ' 2024 American epic space opera film directed by Zack Snyder from a screenplay he co-wrote with Kurt Johnstad and Shay Hatten. A direct sequel to Rebel Moon – Part One: A Child of Fire (2023), the film takes place on the moon of Veldt where Kora and the crew of warriors ventures to help the farmers to defend and fight for their home against the Motherworld.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/Rebel_Moon_%E2%80%93_Part_Two_The_Scargiver_poster.jpg/220px-Rebel_Moon_%E2%80%93_Part_Two_The_Scargiver_poster.jpg',
        director: {
            name:'Zachary Edward Snyder',
            description:'(born March 1, 1966) is an American filmmaker. He made his feature film debut in 2004 with Dawn of the Dead, a remake of the 1978 horror film of the same name.',
        },
        genre: {
            name:'scifi',
            description: 'a film genre that uses fictional science to depict phenomena that are not generally accepted by mainstream science.',
        },
    },
    {
        title: 'Kingdom of the Planet of the Apes',
        description: ' 2024 American science fiction action film directed by Wes Ball and written by Josh Friedman.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Kingdom_of_the_Planet_of_the_Apes_poster.jpg/220px-Kingdom_of_the_Planet_of_the_Apes_poster.jpg',
        director: {
            name:'Wes Ball',
            description:'(born October 28, 1980) is an American film director and producer. He is best known for directing the Maze Runner film trilogy (2014–2018).',
        },
        genre: {
            name:'scifi',
            description: 'a film genre that uses fictional science to depict phenomena that are not generally accepted by mainstream science.',
        },
    },
    {
        title: 'Ghostbusters: Frozen Empire',
        description: ' 2024 American supernatural comedy film directed by Gil Kenan from a screenplay he co-wrote with Jason Reitman.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/31/Ghostbusters_%282024%29_poster.jpg/220px-Ghostbusters_%282024%29_poster.jpg',
        director: {
            name:'Gil Kenan',
            description:'(born October 16, 1976)[1] is a British–American filmmaker. He is best known for directing the films Monster House (2006) and Ghostbusters: Frozen Empire (2024), the former of which was nominated for the Academy Award for Best Animated Feature.',
        },
        genre: {
            name:'scifi',
            description: 'a film genre that uses fictional science to depict phenomena that are not generally accepted by mainstream science.',
        },
    },
    {
        title: 'Ghostbusters: Frozen Empire',
        description: ' 2024 American supernatural comedy film directed by Gil Kenan from a screenplay he co-wrote with Jason Reitman.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/31/Ghostbusters_%282024%29_poster.jpg/220px-Ghostbusters_%282024%29_poster.jpg',
        director: {
            name:'Gil Kenan',
            description:'(born October 16, 1976)[1] is a British–American filmmaker. He is best known for directing the films Monster House (2006) and Ghostbusters: Frozen Empire (2024), the former of which was nominated for the Academy Award for Best Animated Feature.',
        },
        genre: {
            name:'scifi',
            description: 'a film genre that uses fictional science to depict phenomena that are not generally accepted by mainstream science.',
        },
    },
    {
        title: 'Logan',
        description: '2017 American superhero film starring Hugh Jackman as the titular character',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/3/37/Logan_2017_poster.jpg',
        director: {
            name:'James Allen Mangold',
            description:'(born December 16, 1963) is an American film director, producer and screenwriter.',
        },
        genre: {
            name:'scifi',
            description: 'a film genre that uses fictional science to depict phenomena that are not generally accepted by mainstream science.',
        },
    },
    {
        title: 'Aquaman and the Lost Kingdom',
        description: '2023 American superhero film based on the DC Comics character Aquaman.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Aquaman_and_the_Lost_Kingdom_poster.jpg/220px-Aquaman_and_the_Lost_Kingdom_poster.jpg',
        director: {
            name:'James Wan',
            description:'(born 26 February 1977) is an Australian filmmaker. He has primarily worked in the horror genre as the co-creator of the Saw and Insidious franchises and the creator of The Conjuring Universe.',
        },
        genre: {
            name:'scifi',
            description: 'a film genre that uses fictional science to depict phenomena that are not generally accepted by mainstream science.',
        },
    },
    {
        title: 'Star Trek Into Darkness',
        description: '2013 American science fiction action film directed by J. J. Abrams and written by Roberto Orci, Alex Kurtzman, and Damon Lindelof.',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/50/StarTrekIntoDarkness_FinalUSPoster.jpg/220px-StarTrekIntoDarkness_FinalUSPoster.jpg',
        director: {
            name:'Jeffrey Jacob Abrams',
            description:'(born June 27, 1966)[1] is an American filmmaker and composer.',
        },
        genre: {
            name:'scifi',
            description: 'a film genre that uses fictional science to depict phenomena that are not generally accepted by mainstream science.',
        },
    },
];

//Add Users
app.post('/users',(req,res) =>{
    const newUser = req.body;

    if (newUser.name){
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else{
        res.status(400).send('users need names')
    }   
    })

//update Users
app.put('/users/:id',(req,res) =>{
    const { id } = req.params;
    const updatedUser = req.body;
    
   let user = users.find(user => user.id == id);

   if(user){
    user.name=updatedUser.name;
    res.status(200).json(user);
   }else{
    res.status(400).send('no such user')
   }
    })

//delete User ID
app.delete('/users/:id',(req,res) => {
    const { id, } = req.params;

    let user = users.find(user => user.id == id);

   if(user){
    users = users.filter(user => user.id != id)
    res.status(200).send(`user ${id} has been deleted`);
   }else{
    res.status(400).send('no such user')
   }
    })

//add Favorite Movie
app.post('/users/:id/:movietitle',(req,res) => {
    const { id, movietitle } = req.params;
    console.log(`Received request to add movie "${movietitle}" for user with ID: ${id}`);

    let user = users.find(user => user.id == id);

   if(user){
    user.favoriteMovies.push(movietitle);
    res.status(200).send(`${movietitle}has been added to user ${id}'s array`);;
   }else{
    res.status(400).send('no such user')
   }
})
//delete Favorite Movie
app.delete('/users/:id/:movietitle',(req,res) =>{
    const { id, movietitle } = req.params;

    let user = users.find(user => user.id == id);

   if(user){
    user.favoriteMovies.filter(title => title!== movietitle);
    res.status(200).send(`${movietitle}has been removed from user ${id}'s array`);;
   }else{
    res.status(400).send('no such user')
   }
    })

//Log to terminal with morgan

app.use (morgan('combined'));

//serve files from pulic directory staticly
app.use(express.static('public'));

//Get route for movies and returns top 10 movies
app.get('/movies', (req, res) => {
    res.status(200).json(topMovies);
});

//Get route for users
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

//Get route for movie titles
app.get('/movies/:title',(req, res) => {
const {title} =req.params;
const movies = topMovies.find(movies => movies.title === title);

if (topMovies) {
    res.status(200).json(movies);
}else{
    res.status(400).send('no such movie')
}
})


//Get route for movie genre
app.get('/movies/genre/:genreName',(req, res) => {
    const {genreName} =req.params;
    const genre = topMovies.find(topMovies => topMovies.genre.name === genreName).genre;
    
    if (genre) {
        res.status(200).json(genre);
    }else{
        res.status(400).send('no such genre')
    }   
    })

//Get route for movie Director
app.get('/movies/director/:directorName',(req, res) => {
    const {directorName} =req.params;
    const director = topMovies.find(topMovies => topMovies.director.name === directorName).director;
    
    if (director) {
        res.status(200).json(director);
    }else{
        res.status(400).send('no such director')
    }   
    })


        
//log to txt file
app.get('/log', (req, res) => {
    res.send('This is a log.');
  });
// GET route for "/" that returns a default textual response
app.get('/', (req, res) => {
	res.send(
		'Welcome to my API! Please Go to /documentation.html to view the documentation.'
	);
});

// Error-handling middleware
// app.use((err, req, res, next) => {
// 	console.error('Error:', err.stack);
// 	res.status(500).send('Check Code No response received.');
// });

// Start the server
app.listen(8080, () => {
	console.log('Your app is listening on port 8080.');
});