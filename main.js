const gridHTML = document.getElementById("grid")
const button = document.querySelector("button")
const levelHTML = document.getElementById("level")
let root = document.documentElement
let width = Number(getComputedStyle(root).getPropertyValue("--col-number"))
let bombsAmount = 5
let gameOver = false

let randomNumbers = []

const lossScreen = document.getElementById("loss")
const winScreen = document.getElementById("win")

//TODO - GIVE POSSIBILITY TO RESIZE THE GRID CHANGING THE NUMBERS INSIDE THE FOR LOOPS

// levelHTML.addEventListener("change", () => {
//     button.addEventListener("click", () => {
//         if (levelHTML.value == "medium") {
//             console.log("medium")
//             root.style.setProperty('--col-number', 9)
//         } else if (levelHTML.value == "easy") {
//             console.log("easy")
//             root.style.setProperty('--col-number', width)
//         } else if (levelHTML.value == "hard") {
//             console.log("hard")
//             root.style.setProperty('--col-number', 7)
//             console.log(getComputedStyle(root).getPropertyValue("--col-number"))
//         }
//         createGrid()
//     })


// Victory and defeat screens are on d-none on deafult
winScreen.style.display = "none"
lossScreen.style.display = "none"

// when the difficulty gets changed, bombs amount change accordingly and the button gets a new event
levelHTML.addEventListener("change", () => {
    button.addEventListener("click", () => {
        if (levelHTML.value == "medium") {
            bombsAmount = 10
        } else if (levelHTML.value == "easy") {
            bombsAmount = 5
        } else if (levelHTML.value == "hard") {
            bombsAmount = 15
        }
        winScreen.style.display = "none"
        lossScreen.style.display = "none"
        createGrid()
    })
})


// })
// button has an event by deafault if the level isnt changed, and it's set on easy (5 bombs) as default
button.addEventListener("click", createGrid)

let boxes = []

// this function resets the game to the window load state whenever a new grid is generated
function gameReset() {
    boxes = []
    gameOver = false
    document.querySelector("main").style.backgroundColor = "aquamarine"
    winScreen.style.display = "none"
    lossScreen.style.display = "none"
    let boxesToDelete = document.querySelectorAll(".box")
    console.log(boxesToDelete)
    boxesToDelete.forEach((box) => {
        box.remove()
    })
}

// generates a new grid based on game width, populating 2 arrays with the proper empty-cells to bombs ratio and then shuffling it, then assigning id's, classes and event listeners to each box

function createGrid() {
    gameReset()
    const bombArray = Array(bombsAmount).fill("bomb")
    const emptyArray = Array(width * width - bombsAmount).fill("empty")
    const boardArraySorted = bombArray.concat(emptyArray)
    const randomizedBoard = boardArraySorted.sort(() => Math.random() - 0.5)



    for (let i = 0; i < width ** 2; i++) {
        const box = document.createElement("div")
        let boxspan = document.createElement("span")
        box.classList.add("box")
        boxspan.classList.add(randomizedBoard[i])
        box.classList.add(randomizedBoard[i])
        box.id = i
        gridHTML.appendChild(box)
        boxspan.classList.add("d-none")
        box.appendChild(boxspan)
        box.addEventListener("click", function (e) {
            console.log(box)
            checkBox(box)
        })
        box.addEventListener("contextmenu", () => {
            event.preventDefault()
            if (!box.classList.contains("active")) {
                if (!box.classList.contains("flag")) {
                    console.log("flagging")
                    let flag = new Image()
                    flag.src = "./assets/flag.gif"
                    flag.classList.add("flag")
                    flag.style.width = "100%"
                    box.classList.add("flag")
                    box.appendChild(flag)
                    let bombs = document.querySelectorAll("div.bomb")
                    let winCheck = true
                    console.log(bombs)
                    for (let i = 0; i < bombs.length; i++) {
                        if (!bombs[i].className.includes("flag")) {
                            winCheck = false
                        }
                    }

                    if (winCheck) {
                        winScreen.style.display = "flex"
                        let divflags = document.querySelectorAll("div.flag")
                        divflags.forEach((div) => {
                            let bombImg = new Image()
                            bombImg.src = "./assets/bomb.gif"
                            bombImg.style.width = "50%"
                            div.appendChild(bombImg)
                        })
                    }
                } else if (box.classList.contains("flag")) {
                    box.classList.remove("flag")
                    let flagIMG = box.querySelectorAll("img.flag")
                    flagIMG.forEach((img) => {
                        img.remove()
                    })

                }


            }
        })

        if (box.className.includes("bomb")) {
            boxspan.innerText = ""
            let bombImg = new Image()
            bombImg.src = "./assets/bomb.gif"
            bombImg.style.width = "50%"
            boxspan.append(bombImg)
        }

        boxes.push(box)




    }

    // this for loop (Who costed my mental sanity), checks all of the boxes adjacent to the one whose getting looped (accounting for grid edges), and stores the amount of bombs found in a variable, whose at the end assigned to each span's innertext
    for (let i = 0; i < boxes.length; i++) {

        const isOnLeftEdge = (i % width == 0)
        const isOnRightEdge = (i % width == width - 1)
        let adjacentBombs = 0
        let boxspan = boxes[i].querySelector("span")
        if (boxes[i].classList.contains("empty")) {
            if (i > 0 && !isOnLeftEdge && boxes[i - 1].className.includes("bomb")) {
                adjacentBombs++
            }
            if (i > 9 && !isOnRightEdge && boxes[i + 1 - width].className.includes("bomb")) {
                adjacentBombs++
            }
            if (i > 10 && boxes[i - width].className.includes("bomb")) {
                adjacentBombs++
            }
            if (i > 11 && !isOnLeftEdge && boxes[i - 1 - width].className.includes("bomb")) {
                adjacentBombs++
            }
            if (i < 98 && !isOnRightEdge && boxes[i + 1].className.includes("bomb")) {
                adjacentBombs++
            }

            if (i < 90 && !isOnLeftEdge && boxes[i - 1 + width].className.includes("bomb")) {
                adjacentBombs++
            }
            if (i < 88 && !isOnRightEdge && boxes[i + 1 + width].className.includes("bomb")) {
                adjacentBombs++
            }
            if (i < 89 && boxes[i + width].className.includes("bomb")) {
                adjacentBombs++
            }

            if (adjacentBombs > 0) {
                boxspan.innerText = adjacentBombs
            } else {
                boxspan.innerText = ""
            }




        }
    }

}


// this function checks the box whose getting targeted with the click event listener, returns in case the game is over, or if the box has already been clicked\flagged.
// In case it contains a box, the game ends revealing all other bombs, in case it contains a number clue, it reveals it. Else, it calls the "check adjacent" fucntion that checks the adjacent boxes with a very similar method to the previous for loop, but accounting for the increasing numeric id that was assigned to each box. By calling each others, this 2 functions loop stops whenever a non-empty box is found, giving the desired "spread" effect
function checkBox(box) {

    let span = box.querySelector("span")


    if (gameOver) return
    if (box.classList.contains("flag") || box.classList.contains("active")) return
    span.classList.remove("d-none")



    if (box.classList.contains("bomb")) {
        console.log(box.classList)
        box.style.backgroundColor = "red"
        document.querySelector("main").style.backgroundColor = "brown"
        gameOver = true
        document.querySelectorAll(".active").forEach((cell) => {
            cell.classList.remove("active")
        })
        let spanbombs = document.querySelectorAll("span.bomb")
        let divbombs = document.querySelectorAll("div.bomb")
        spanbombs.forEach((span) => {
            span.classList.remove("d-none")
            lossScreen.style.display = "flex"
        })

        divbombs.forEach((div) => {
            div.style.backgroundColor = "red"
            if (div.classList.contains("flag")) {
                const bombIMG = new Image()
                bombIMG.src = "./assets/bomb.gif"
                bombIMG.style.width = "40%"
                div.appendChild(bombIMG)
            }
        })

        return
    } else {
        if (span.innerText == 0) {
            box.classList.add("active")
            checkAdjacent(box)
            return
        }

    }

    box.classList.add("active")
}

function checkAdjacent(box) {

    const isOnLeftEdge = (box.id % width == 0)
    const isOnRightEdge = (box.id % width == width - 1)
    if (box.id > 0 && !isOnLeftEdge) {

        let adjacentID = boxes[Number(box.id) - 1].id
        let adjacentBox = document.getElementById(adjacentID)

        checkBox(adjacentBox)

    }

    if (box.id > 9 && !isOnRightEdge) {
        let adjacentID = boxes[Number(box.id) + 1 - width].id
        let adjacentBox = document.getElementById(adjacentID)

        checkBox(adjacentBox)

    }

    if (box.id > width) {
        let adjacentID = boxes[Number(box.id) - width].id
        let adjacentBox = document.getElementById(adjacentID)

        checkBox(adjacentBox)

    }

    if (box.id > 11 && !isOnLeftEdge) {
        let adjacentID = boxes[Number(box.id) - 1 - width].id
        let adjacentBox = document.getElementById(adjacentID)

        checkBox(adjacentBox)

    }

    if (box.id < 98 && !isOnRightEdge) {
        let adjacentID = boxes[Number(box.id) + 1].id
        let adjacentBox = document.getElementById(adjacentID)

        checkBox(adjacentBox)

    }

    if (box.id < 88 && !isOnRightEdge) {
        let adjacentID = boxes[Number(box.id) + 1 + width].id
        let adjacentBox = document.getElementById(adjacentID)

        checkBox(adjacentBox)

    }

    if (box.id < 90 && !isOnLeftEdge) {
        let adjacentID = boxes[Number(box.id) - 1 + width].id
        let adjacentBox = document.getElementById(adjacentID)

        checkBox(adjacentBox)

    }

    if (box.id < 89) {
        let adjacentID = boxes[Number(box.id) + width].id
        let adjacentBox = document.getElementById(adjacentID)

        checkBox(adjacentBox)

    }


}