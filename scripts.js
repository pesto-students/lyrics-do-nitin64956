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

function hideLyrics(div) {
    if (div && div.nextSibling.nodeName == "P") {
        div.parentNode.removeChild(div.nextSibling)
    }
}

//fn to clear old records from dom
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// fn to load the next page data
function changePage (link) {
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
    let nextLink = displaySongs.next;
    let prevLink = displaySongs.prev;

    

    for (let i = 0;i < songsData.length;i++) {
        let element = songsData[i];
        let div = document.createElement("div");
        let image = document.createElement("img");
            image.src = element.album.cover_small;
        let buttonsDiv = document.createElement("div");
            buttonsDiv.className = "div-buttons";
        let audioElem = document.createElement("audio");
                        audioElem.src = element.preview;
        div.appendChild(audioElem)

        let para = document.createElement("P");
        let text = document.createTextNode(`${element.artist.name} - ${element.title}`);
        para.appendChild(text);
        para.className = "title";
        let button = document.createElement("button");
        button.textContent = "Show Lyrics";
        button.className = "lyricsButton";
        button.addEventListener('click',() => 
        { 
            getLyrics(element.artist.name,element.title,div,button);
        });

        let closeButton = document.createElement("button");
        closeButton.textContent = "Hide Lyrics";
        closeButton.className = "lyricsButton";
        closeButton.addEventListener('click',() => 
        { 
            hideLyrics(div);
        });

        let playButton = document.createElement("button");
        playButton.textContent = "Play";
        playButton.className = "mediaButton";
        playButton.addEventListener('click',() => 
        { 
           audioElem.play();
        });

        let pauseButton = document.createElement("button");
        pauseButton.textContent = "Pause";
        pauseButton.className = "mediaButton";
        pauseButton.addEventListener('click',() => 
        { 
            audioElem.pause();
        });


        buttonsDiv.appendChild(playButton);
        buttonsDiv.appendChild(pauseButton);
        buttonsDiv.appendChild(button);
        buttonsDiv.appendChild(closeButton);

        div.appendChild(image);
        div.appendChild(para);
        div.appendChild(buttonsDiv);

        div.className = "recordDiv";

        lyricsDiv.appendChild(div);
    };

    if (prevLink) {
        var prevButton = document.createElement("button");
        prevButton.textContent = "Previous";
        prevButton.className = "pageButton";
        prevButton.style.marginTop = "10px";
        prevButton.addEventListener('click',() => {
            changePage(`https://cors-anywhere.herokuapp.com/${prevLink}`);
        })
        lyricsDiv.appendChild(prevButton);

    }


    if (nextLink) {
        var nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.className = "pageButton";
        nextButton.style.marginTop = "10px";
        nextButton.addEventListener('click',() => {
            changePage(`https://cors-anywhere.herokuapp.com/${nextLink}`);
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


