// Show initial data
const paragraphInfoDiv = document.querySelector(`#paragraphs`)
fetch(`http://localhost:3000/prices`)
    .then(response => response.json())
    .then(prices => {
        prices.forEach(price => {
            const p = document.createElement(`p`)
            p.textContent = `${price.name}: $${price.price}. There are ${price.seatsAmount} seats available at this price in ${price.seatLocation}.`
            paragraphInfoDiv.append(p)
            })
        })

//allow returning user to enter name and see curated info
const returningUserButton = document.querySelector(`#returning-user-button`)
const buttonDiv = document.querySelector(`#button-div`)
const div = document.querySelector(`#info`)
const moreShowsDiv = document.querySelector(`#more-shows-button`)
returningUserButton.addEventListener(`click`, (event) => {
    event.preventDefault()
    buttonDiv.innerHTML = ``
    const form = document.createElement('form')
    const label = document.createElement(`label`)
    const inputName = document.createElement(`input`)
    const inputButton = document.createElement(`input`)
    form.id = `name-input`
    inputName.type = `text`
    inputName.placeholder = `Name`
    inputButton.type = `submit`
    inputButton.value = `Submit`
    buttonDiv.append(form)
    form.append(label)
    label.append(inputName)
    label.append(document.createElement(`br`))
    label.append(inputButton)

// after cicking submit, show personalized page with user info and prices
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        //remove submit button and change experience slightly
        form.remove()
        returningUserButton.textContent = `Change User`
        populateInfo(inputName.value, `Welcome Back`)
   }) 
})

// Allow New User to create profile
const newUserButton = document.querySelector(`#new-user-button`)
newUserButton.addEventListener(`click`, (event) => {
    event.preventDefault()
    buttonDiv.innerHTML = ``;
    const form = document.createElement('form')
    const label = document.createElement(`label`)
    const inputName = document.createElement(`input`)
    const inputPic = document.createElement(`input`)
    const inputShow = document.createElement(`input`)
    const inputPrice = document.createElement(`input`)
    const inputButtonNewUser = document.createElement(`input`)
    const br = document.createElement(`br`)
    form.id = `name-input`
    inputName.type = `text`
    inputPic.type = `text`
    inputShow.type = `text`
    inputPrice.type = `text`
    inputName.placeholder = `Name`
    inputPic.placeholder = `Profile Pic URL`
    inputShow.placeholder = `Name of Show`
    inputPrice.placeholder = `Price`
    inputButtonNewUser.type = `submit`
    inputButtonNewUser.value = `Submit`
    buttonDiv.append(form)
    form.append(label)
    label.append(inputName)
    label.append(inputPic)
    label.append(inputShow)
    label.append(inputPrice)
    label.append(br)
    label.append(inputButtonNewUser)

    // POST submitted data
    form.addEventListener(`submit`, (event) => {
        event.preventDefault()
        fetch(`http://localhost:3000/people`, {
            method: `POST`,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: inputName.value,
                profilePic: inputPic.value,
                preferences: [
                    {
                        show: inputShow.value,
                        showTechnicalName: ``,
                        maxPrice: parseInt(inputPrice.value, 10)
                    }
                ]
            })
        })
        .then(response => response.json())
        .then(newPerson => {
            populateInfo(newPerson.name, `Thanks for joining`)
        })
    })

    // Allow user to increase or decrease price preference with arrow keys
    inputPrice.addEventListener(`keydown`, (event) => {
        if (event.key === `ArrowUp`) {
            const currentPrice = parseInt(inputPrice.value, 10);
            const newPrice = currentPrice + 1;
            inputPrice.value = newPrice;
        } else if (event.key === `ArrowDown`) {
            const currentPrice = parseInt(inputPrice.value, 10);
            const newPrice = currentPrice - 1;
            inputPrice.value = newPrice.toFixed(0);
        }
    })
})
// Populate page with curated info
function populateInfo (name, greeting) {
    // remove everything to make clean slate
    div.innerHTML = ``;
    moreShowsDiv.innerHTML = ``;
    // add person's name
    const personName = name
    const firstName = personName.split(` `)[0]
    const h1 = document.createElement(`h1`)
    h1.textContent = `${greeting}, ${firstName}!`
    div.append(h1)
    // get person's image and show preferences
    fetch(`http://localhost:3000/people`)
    .then(response => response.json())
    .then(people => {
        people.forEach(person => {
            if (personName === person.name) {
                const id = person.id
                const preferences = person.preferences
                //add person's image
                const image = document.createElement(`img`)
                image.src = person.profilePic
                image.id = `main-image`
                div.append(image)
                const paragraphInfoDiv = document.createElement(`div`)
                paragraphInfoDiv.id = `paragraph-info`
                div.append(paragraphInfoDiv)
                
                //display person's show preferences
                const showPromises = person.preferences.map(show => {
                    const showName = show.show;
                    const maxPrice = show.maxPrice;
                
                    return fetch(`http://localhost:3000/prices`)
                        .then(response => response.json())
                        .then(prices => {
                            const matchingPrices = prices.filter(price => price.name === showName && price.price < maxPrice);
                
                            matchingPrices.forEach(price => {
                                const p = document.createElement(`p`);
                                p.textContent = `${showName}: $${price.price}. There are ${price.seatsAmount} seats available at this price in ${price.seatLocation}.`;
                                paragraphInfoDiv.append(p);
                            });
                        });
                });
                
                Promise.all(showPromises)
                    .then(() => {
                        // Check if no tickets are available at the desired price
                        if (paragraphInfoDiv.childElementCount === 0) {
                            const p = document.createElement('p');
                            p.textContent = `Unfortunately, there are no tickets for any show at your desired price. Please come back later.`;
                            div.append(p);
                        }
                    })
                
                // Display add show button
                const addShowsButton = document.createElement(`button`)
                addShowsButton.textContent = `Add Another Show`
                moreShowsDiv.append(addShowsButton)
                addShowsButton.addEventListener(`click`, (event) => {
                    event.preventDefault()
                    addShowsButton.remove()
                    const newShowsForm = document.createElement('form')
                    const newShowsLabel = document.createElement(`label`)
                    const inputNewShow = document.createElement(`input`)
                    const inputNewPrice = document.createElement(`input`)
                    const inputButtonNewShow = document.createElement(`input`)
                    newShowsForm.id = `new-show`
                    inputNewShow.type = `text`
                    inputNewPrice.type = `text`
                    inputNewShow.placeholder = `Name of Show`
                    inputNewPrice.placeholder = `Price`
                    inputButtonNewShow.type = `submit`
                    inputButtonNewShow.value = `Submit New Show`
                    moreShowsDiv.append(newShowsForm)
                    newShowsForm.append(newShowsLabel)
                    newShowsLabel.append(inputNewShow)
                    newShowsLabel.append(inputNewPrice)
                    newShowsLabel.append(inputButtonNewShow)
                    
                    // allow user to add show preference to their preferences
                    newShowsForm.addEventListener(`submit`, (event) => {
                        event.preventDefault();
                        addShow();
                        function addShow () {
                            
                            fetch(`http://localhost:3000/people/${id}`, {
                                method: `PATCH`,
                                headers: {},
                                body: JSON.stringify({
                                    preferences: [
                                        ...preferences,
                                        {
                                        show: inputNewShow.value,
                                        showTechnicalName: ``,
                                        maxPrice: parseInt(inputNewPrice.value, 10)
                                        }
                                    ]
                                })
                            })
                            .then(response => response.json())
                            .then(show => {
                                populateInfo(personName, `Welcome Back`)
                            })
                        }
                    })
                })
            }
        });
    })
}

// // WRITE STUBHUB API CALL
// const apiKey = `8s4RENhd`;
// const applicationKey = `5saQ1M1lbC`
// const apiUrl = 'https://sandbox.api.stubhub.net/catalog/events/152150271';

// // Example endpoint, replace with the actual endpoint you want to query
// const endpoint = 'example/endpoint';

// // Example parameters, replace with the actual parameters required by the endpoint
// const queryParams = {
//   param1: 'value1',
//   param2: 'value2',
// };

// // Construct the URL with parameters
// const url = new URL(apiUrl + endpoint);
// url.search = new URLSearchParams(queryParams);

// // Make the API request
// fetch(apiUrl, {
//   method: 'GET',
//   headers: {
//     'Authorization': `Bearer ${apiKey}`,
//     // 'App-Token': applicationKey,
//     'Accept': 'application/json',
//   },
// })
//   .then(response => response.json())
//   .then(data => {
//     // Handle the data from the API response
//     console.log('API Response:', data);
//   })
//   .catch(error => {
//     // Handle errors
//     console.error('API Request Error:', error);
//   });
