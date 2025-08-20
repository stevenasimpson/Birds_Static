const URL = "./data/nzbird.json";
var complete_data;

var btn = document.getElementById('filter_button');
var searchBox = document.getElementById('bird_text');
var conservSelect = document.getElementById('filter_status');
var sortSelect = document.getElementById('filter_sort');
var img = document.getElementById('bird_img');
var card = document.getElementById('card');

// callback for when the fetch response arrives
function responseCallback(response) {
    if (response.status == 200) {
        return response.text();
    }
}

// callback for when the data is ready to use
function dataReadyCallback(data) {
    this.complete_data = JSON.parse(data);
    //console.log(data);
    displayBirds(this.complete_data);   
}

// callback for when a fetch error occurs
function fetchErrorCallback(error) {
    alert("An error occured when fetching the bird data.  Please try again later.");
    console.log(error);
}

function displayBirds(data){
    const main = document.querySelector('.main');
    
    //remove all existing bird cards
    while (main.hasChildNodes()) {
        main.removeChild(main.firstChild);
    }

    for (let bird of data) {
        //elem for content
        let bird_card = document.createElement('div');
        bird_card.setAttribute('class', 'bird_card');

        //img
        let img = document.createElement('img');
        img.setAttribute('class', 'bird_img');
        img.setAttribute('src', bird.photo.source);
        bird_card.appendChild(img);

        //common name
        let bird_common = document.createElement('p');
        bird_common.setAttribute('class', 'p_heading');
        bird_common.textContent = bird.common_name;
        bird_card.appendChild(bird_common);
        
        //original name
        let bird_original = document.createElement('p');
        bird_original.setAttribute('class', 'p_orig_name');
        bird_original.textContent = bird.original_name;
        bird_card.appendChild(bird_original);

        //small div for credit, original name and status symbol
        let two_div = document.createElement('div');
        two_div.setAttribute('class', 'two_div');
        
        //img credit
        let img_credit = document.createElement('p');
        img_credit.setAttribute('class', 'p_photo');
        img_credit.textContent = "Photo by " + bird.photo.credit;
        two_div.appendChild(img_credit);

        //endagered status circle
        let bird_circle = document.createElement('p');
        bird_circle.setAttribute('class', 'bird_status');
        let status = bird.status;
        //switching color based on status 
        if (status.includes("Not Threatened")){
            bird_circle.style.backgroundColor = "#02a028";
        } else if (status.includes("Naturally Uncommon")){
            bird_circle.style.backgroundColor = "#649a31";
        } else if (status.includes("Relict")){
            bird_circle.style.backgroundColor = "#99cb68";
        } else if (status.includes("Recovering")){
            bird_circle.style.backgroundColor = "#fecc33";
        } else if (status.includes("Declining")){
            bird_circle.style.backgroundColor = "#fe9a01";
        } else if (status.includes("Nationally Increasing")){
            bird_circle.style.backgroundColor = "#c26967";
        } else if (status.includes("Nationally Vulnerable")){
            bird_circle.style.backgroundColor = "#9b0000";
        } else if (status.includes("Nationally Endangered")){
            bird_circle.style.backgroundColor = "#660032";
        } else if (status.includes("Nationally Critical")){
            bird_circle.style.backgroundColor = "#320033";
        } else if (status.includes("Extinct")){
            bird_circle.style.backgroundColor = "black";
        } else if (status.includes("Data Deficient")){
            bird_circle.style.backgroundColor = "black";
        } else {
            bird_circle.style.backgroundColor = "blue";
        }

        two_div.appendChild(bird_circle);

        bird_card.appendChild(two_div);

        //bird info grid
        let bird_info = document.createElement('div');
        bird_info.setAttribute('class', 'bird_grid');
        bird_card.appendChild(bird_info);

        //scientific name
        let bird_sc_title = document.createElement('p');
        bird_sc_title.setAttribute('class', 'p_main_bold');
        bird_sc_title.textContent = "Scientific Name";
        bird_info.appendChild(bird_sc_title);

        let bird_sc_name = document.createElement('p');
        bird_sc_name.setAttribute('class', 'p_main');
        bird_sc_name.textContent = bird.scientific_name;
        bird_info.appendChild(bird_sc_name);

        //family
        let bird_family_title = document.createElement('p');
        bird_family_title.setAttribute('class', 'p_main_bold');
        bird_family_title.textContent = "Family";
        bird_info.appendChild(bird_family_title);

        let bird_family = document.createElement('p');
        bird_family.setAttribute('class', 'p_main');
        bird_family.textContent = bird.family;
        bird_info.appendChild(bird_family);

        //order
        let bird_order_title = document.createElement('p');
        bird_order_title.setAttribute('class', 'p_main_bold');
        bird_order_title.textContent = "Order";
        bird_info.appendChild(bird_order_title);

        let bird_order = document.createElement('p');
        bird_order.setAttribute('class', 'p_main');
        bird_order.textContent = bird.order;
        bird_info.appendChild(bird_order);

        //status
        let bird_status_title = document.createElement('p');
        bird_status_title.setAttribute('class', 'p_main_bold');
        bird_status_title.textContent = "Status";
        bird_info.appendChild(bird_status_title);

        let bird_status = document.createElement('p');
        bird_status.setAttribute('class', 'p_main');
        bird_status.textContent = bird.status;
        bird_info.appendChild(bird_status);

        //length
        let bird_length_title = document.createElement('p');
        bird_length_title.setAttribute('class', 'p_main_bold');
        bird_length_title.textContent = "Length";
        bird_info.appendChild(bird_length_title);

        let bird_length = document.createElement('p');
        bird_length.setAttribute('class', 'p_main');
        bird_length.textContent = bird.length;
        bird_info.appendChild(bird_length);

        //weight
        let bird_weight_title = document.createElement('p');
        bird_weight_title.setAttribute('class', 'p_main_bold');
        bird_weight_title.textContent = "Weight";
        bird_info.appendChild(bird_weight_title);

        let bird_weight = document.createElement('p');
        bird_weight.setAttribute('class', 'p_main');
        bird_weight.textContent = bird.weight;
        bird_info.appendChild(bird_weight);

        main.appendChild(bird_card);
    }

    let filter_results = document.getElementById('filter_results');
    filter_results.textContent = data.length + " results found."
}

function filterData(eventData){
    //console.log("Button Clicked");
    
    let str_data = filterByString();
    let filtered_data = filterByStatus(str_data);
    let sorted_data = sortData(filtered_data);

    displayBirds(sorted_data);
}

function filterByString(){
    let searchStr = searchBox.value;
    let string_data;

    if (searchStr === "") {
        string_data = complete_data;
    } else {      
        string_data = complete_data.filter(compareString);
    }
    return string_data;
}

function compareString(bird){
    let str_bird = JSON.stringify(bird).toLowerCase();
    //console.log(typeof(str_bird));
    let str_bird_norm = str_bird.normalize('NFC');
    

    let searchStr_lower = searchBox.value.toLowerCase();
    let searchStr_norm = searchStr_lower.normalize('NFC');
    //console.log(searchStr_norm);
    
    return str_bird_norm.includes(searchStr_norm);
}

function filterByStatus(data){
    let conserValue = this.conservSelect.value;
    let filtered_data;
    //filtering by conservation status    
    if (conserValue === 'All') {
        filtered_data = data;
    } else {
        filtered_data = data.filter(checkStatus);  
    }

    return filtered_data;
}

function checkStatus(bird){
    return bird.status === conservSelect.value;
}

function sortData(data){
    let sortValue = sortSelect.value;
    let sorted_data;
    //sorting data
    if (sortValue === "alpha") {
        sorted_data = data.sort(compareAlpha);
    }
    if (sortValue === 'lighest_heaviest') {
        sorted_data = data.sort(compareWeight);
    }
    if (sortValue === 'shortest_longest') {
        sorted_data = data.sort(compareLength);
    }

    return sorted_data;
}

function compareAlpha(a, b){
    let x = a.common_name.toLowerCase();
    let y = b.common_name.toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
}

function compareLength(a, b) {
    let a_length = Number(a.length.split(" ")[0]);
    let b_length = Number(b.length.split(" ")[0]);
    
    return a_length - b_length;
}

function compareWeight(a, b) {
    let a_weight_str = a.weight.split(" ");
    let b_weight_str = b.weight.split(" ");

    let a_weight = Number(a_weight_str[0]);
    if (a_weight_str.includes("kg")) {
        a_weight = a_weight * 1000;
    }

    let b_weight = Number(b_weight_str[0]);
    if (b_weight_str.includes("kg")) {
        b_weight = b_weight * 1000;
    }

    return a_weight - b_weight;
}

btn.addEventListener("click", filterData);

fetch(URL)
    .then(responseCallback)
    .then(dataReadyCallback)
    .catch(fetchErrorCallback);

