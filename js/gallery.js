function getImages(){
    let url = "/gallery/list";
    fetch(url, {
        method: "GET",
    }).then(response => {
        return response.json();                 //now return that promise to JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));        // if it does, convert JSON object to string and alert
        } else {
            let qty = response.images.length;
            let rows = Math.ceil(response.images.length / 4);
            let cols = 0;
            let arr = Array.from(Array(rows), () => new Array(4))
            for(let image of response.images){
                console.log(image.url);
                for(let i = 0; i < rows; i++){
                    if(qty >= 4) cols = 4;
                    else cols = qty % 4;
                    for(let j = 0; j < cols; j++){
                        arr[i][j] = 1;
                        console.log(i + " " + j + " " + arr[i][j]);
                    }
                }
            }
            alert(arr.toString());
        }
    });
}