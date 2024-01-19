//allow returning user to enter name and see curated info
const returningUserButton = document.querySelector(`#returning-user-button`)
const newUserButton = document.querySelector(`#new-user-button`)
let div = document.querySelector(`#info`)
returningUserButton.addEventListener(`click`, (event) => {
    event.preventDefault()
    let form = document.createElement('form')
    let label = document.createElement(`label`)
    let inputName = document.createElement(`input`)
    let inputButton = document.createElement(`input`)
    form.setAttribute(`id`, `name-input`)
    inputName.setAttribute('type', `text`)
    inputName.setAttribute('value', `Name`)
    inputButton.setAttribute(`type`, `submit`)
    inputButton.setAttribute(`value`, `Submit`)
    div.append(form)
    form.append(label)
    label.append(inputName)
    label.append(document.createElement(`br`))
    label.append(inputButton)

    form.addEventListener('submit', (event) => {
        
    })
})