const searchBar = document.getElementById('searchBar');
const lyricsDiv = document.getElementById('lyrics-div');


let inputValue = "";
let displaySongs = {};

//SearchBar value change listener
searchBar.addEventListener('change',() => {
    inputValue = searchBar.value;
});

let searchButton = document.getElementById('searchButton');

//function to get lyrics for a title and artist name and to append the paragraph in DOM
function getLyrics(artist,title,tag,btn) {
    if (tag.nextSibling.nodeName == "P") {
        return;
    }
    let lyrics;
    fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
        .then(response => response.json())
        .then(json => {
        
            lyrics = json.lyrics ? json.lyrics : "No Lyrics Found";
            let para = document.createElement("P");
    
            let text = document.createTextNode(lyrics);
            para.appendChild(text)
            para.className = "lyrics";
            tag.after(para);
                    
    });
}

//fn to clear old records from dom
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// fn to load the next page data
function nextPage (link) {
    fetch(link)
        .then(response => response.json())
        .then(json => 
            {
                displaySongs = json;
                createList(displaySongs);
            });
}

//fn to create the song records list in the DOM
function createList (displayResponse) {
    const oldLyrics = document.querySelector('#lyrics-div');
                      removeAllChildNodes(oldLyrics);
    let songsData = displaySongs.data;
    let totalResults = displaySongs.total;
    let nextLink = displaySongs.next;

    if(!songsData) {
        let para = document.createElement("P");
        let emptyMessage = document.createTextNode(`No Records Found, Please Search Again`);
        para.appendChild(emptyMessage);
        lyricsDiv.appendChild(para);
        return;

    }

    for (let i = 0;i < songsData.length;i++) {
        let element = songsData[i];
        let div = document.createElement("div");
        let para = document.createElement("P");
        let text = document.createTextNode(`${element.artist.name} - ${element.title}`);
        para.appendChild(text);
        para.className = "title";
        let button = document.createElement("button");
        button.textContent = "Show Lyrics";
        button.className = "lyricsButton";
        button.addEventListener('click',() => 
        { 
        
            let lyrics = {}; 
            if (lyrics[element.id]) {
                return lyrics[element.id];
            }
            else {
                lyrics[element.id] = getLyrics(element.artist.name,element.title,div,button);
                return lyrics[element.id];
            }
        });

        div.appendChild(para);
        div.appendChild(button);
        div.className = "recordDiv";

        lyricsDiv.appendChild(div);
    };
    if (nextLink) {
        var nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.className = "lyricsButton";
        nextButton.style.marginTop = "10px";
        nextButton.addEventListener('click',() => {
            nextPage(`https://cors-anywhere.herokuapp.com/${nextLink}`);
        })
        lyricsDiv.appendChild(nextButton);

    }

}

//search button listener to get the songs records
searchButton.addEventListener('click',() => {
    fetch(`https://api.lyrics.ovh/suggest/${inputValue}`)
    .then(response => response.json())
    .then(json => 
        {
            displaySongs = json;
            createList(displaySongs);
        });

});


