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

    // Allow user to increase or decrese price preference with arrow keys
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
                //add person's image
                const image = document.createElement(`img`)
                image.src = person.profilePic
                image.id = `main-image`
                div.append(image)
                
                //display person's show preferences
                person.preferences.forEach(show => {
                    const showName = show.show
                    const maxPrice = show.maxPrice

                    fetch(`http://localhost:3000/prices`)
                    .then(response => response.json())
                    .then(prices => {
                        prices.forEach(price => {
                            if (showName === price.name) {
                                if (price.price < maxPrice) {
                                const p = document.createElement(`p`)
                                p.textContent = `${showName}: $${price.price}. There are ${price.seatsAmount} seats available at this price in ${price.seatLocation}.`
                                div.append(p)
                                }
                            }
                        })
                        if (document.querySelector(`#main-image`).nextElementSibling === null) {
                            const p = document.createElement(`p`)
                            p.textContent = `Unfortunately, there are no tickets for any show at your desired price. Please come back later.`
                            div.append(p)
                        }
                    })
                })
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

                    newShowsForm.addEventListener(`submit`, (event) => {
                        event.preventDefault();
                        // fetch(`http://localhost:3000/people`, {
                        //     method: `POST`,
                        //     headers: {
                        //         "Content-Type": "application/json",
                        //         "Accept": "application/json"
                        //     },
                        //     body: JSON.stringify({
                        //         preferences: [
                        //             {
                        //                 show: inputShow.value,
                        //                 showTechnicalName: ``,
                        //                 maxPrice: parseInt(inputPrice.value, 10)
                        //             }
                        //         ]
                        //     })
                        // })
                        // .then(response => response.json())
                        // .then(newShow => {
                        //     populateInfo(personName, `Thanks for joining`)
                        // })
                    })
                })
            }
        });
    })
}