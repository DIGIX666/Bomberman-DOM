import { socket } from "../connexion.js";


const bomberMan = document.querySelector('.game');
const character = document.createElement('div');

character.classList.add('character');
bomberMan.appendChild(character);

const characterBox = character.getBoundingClientRect();

let docCharacter = document.querySelector(".character")

const characterStyle = getComputedStyle(docCharacter);
const characterLeft = parseInt(characterStyle.left.replace("px", ""));
const characterTop = parseInt(characterStyle.top.replace("px", ""));
const characterBottom = parseInt(characterStyle.bottom.replace("px", ""));
const characterRight = parseInt(characterStyle.right.replace("px", ""));



const characterWidth = 10; // Largeur du personnage
const characterHeight = 67; // Hauteur du personnage

export class Player {
    constructor(namePlayer, adress, direction, lives, bombe, positionLeft, positionRight, positionBottom, positionTop, hitPlayer, canMove) {

        this.namePlayer = namePlayer = ""
        this.adress = adress = ""
        this.direction = direction = ""
        this.lives = lives = 3
        this.bombe = bombe = false
        this.positionLeft = positionLeft = characterLeft
        this.positionTop = positionTop = characterTop
        this.positionRight = positionRight = characterRight
        this.positionBottom = positionBottom = characterBottom
        this.hitPlayer = hitPlayer = false
        this.canMove = canMove = false

    }
}

export const mapData = [
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', ' ', 'b', ' ', ' ', ' ', ' ', 'b', ' ', '#'],
    ['#', ' ', '#', ' ', ' ', ' ', ' ', '#', ' ', '#'],
    ['#', 'b', '#', '#', 'b', 'b', '#', '#', 'b', '#'],
    ['#', ' ', 'b', ' ', ' ', ' ', ' ', 'b', ' ', '#'],
    ['#', 'b', '#', '#', 'b', 'b', '#', '#', 'b', '#'],
    ['#', ' ', 'b', ' ', ' ', ' ', ' ', 'b', ' ', '#'],
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#']
];

let count = 0

export function GameInit(mapData) {

    for (let row = 0; row < mapData.length; row++) {
        for (let col = 0; col < mapData[row].length; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            if (mapData[row][col] === '#') {
                cell.classList.add('wall');

            } else if (mapData[row][col] === 'b') {
                cell.setAttribute('data-row', row); // Ajouter l'attribut de données pour la ligne
                cell.setAttribute('data-col', col); // Ajouter l'attribut de données pour la colonne
                cell.classList.add('brick');
            }
            bomberMan.appendChild(cell);
        }
    }

    //Send to server that the Initialization it's done
    socket.send(JSON.stringify({
        Type: "GameSet",
        Data: null
    }))
}

export function GetNameAndAdress(activeCo) {

    const result = {
        Name: activeCo.name,
        Adress: activeCo.adress,
    }

    return result
}

export function PlayerMoved(socket, player, data, mapData) {

    let currentLife = player.lives
    let playerName = player.namePlayer


    console.log("data from moving:", data)


    // Gérer le mouvement du personnage avec les flèches du clavier


    // Vérifier les collisions avec les murs et les briques
    const newRow = Math.floor(player.positionTop / 100);
    const newCol = Math.floor(player.positionLeft / 98);
    const bottomRow = Math.floor((player.positionTop + characterHeight) / 100);
    const rightCol = Math.floor((player.positionLeft + characterWidth) / 98);

    // Vérifier si le mouvement est possible

    // if (
    //     newRow >= 0 && newCol >= 0 && bottomRow <= mapData.length && rightCol <= mapData[0].length &&
    //     mapData[newRow][newCol] !== '#' &&
    //     mapData[newRow][rightCol] !== '#' &&
    //     mapData[bottomRow][newCol] !== '#' &&
    //     mapData[bottomRow][rightCol] !== '#' &&
    //     mapData[newRow][newCol] !== 'b' &&
    //     mapData[newRow][rightCol] !== 'b' &&
    //     mapData[bottomRow][newCol] !== 'b' &&
    //     mapData[bottomRow][rightCol] !== 'b'
    // ) {
    //     if (data.direction == "Up") {
    //         console.log("Enter UP")
    //         player.positionTop = data.position - 10
    //     } else if (data.direction == "Down") {
    //         console.log("Enter Down")
    //         player.positionTop = data.position + 10
    //     } else if (data.direction == "Left") {
    //         console.log("Enter Left")
    //         player.positionLeft = data.position - 10
    //     } else if (data.direction == "Right") {
    //         console.log("Enter Right")
    //         player.positionLeft = data.position + 10
    //     }
    //     character.style.left = player.positionLeft + 'px';
    //     character.style.top = player.positionTop + 'px';
    // } else {

    //     if (data.direction == "Up") {
    //         console.log("Enter UP")
    //         player.positionTop = data.position + 10
    //     } else if (data.direction == "Down") {
    //         console.log("Enter Down")
    //         player.positionTop = data.position - 10
    //     } else if (data.direction == "Left") {
    //         console.log("Enter Left")
    //         player.positionLeft = data.position + 10
    //     } else if (data.direction == "Right") {
    //         console.log("Enter Right")
    //         player.positionLeft = data.position - 10
    //     }
    //     character.style.left = player.positionLeft + 'px';
    //     character.style.top = player.positionTop + 'px';


    // }
    if (data.direction == "Up" && data.move) {
        console.log("Enter UP")
        player.positionTop = data.position - 10
        character.style.top = player.positionTop + 'px';
    } else if (data.direction == "Down" && data.move) {
        console.log("Enter Down")
        player.positionTop = data.position + 10
        character.style.top = player.positionTop + 'px';

    } else if (data.direction == "Left" && data.move) {
        console.log("Enter Left")
        player.positionLeft = data.position - 10
        character.style.left = player.positionLeft + 'px';

    } else if (data.direction == "Right" && data.move) {
        console.log("Enter Right")
        player.positionLeft = data.position + 10
        character.style.left = player.positionLeft + 'px';

    }
    // character.style.top = player.positionTop + 'px';
    // character.style.left = player.positionLeft + 'px';
    document.addEventListener('keydown', (event) => {

        // Ajouter la logique pour déposer une bombe avec la touche Espace
        if (event.key === ' ') { // Touche Espace
            dropBomb(character, characterLeft + characterWidth / 2, characterTop + characterHeight / 2, currentLife, player.hitPlayer);
            socket.send(JSON.stringify({
                Type: "Player Dropped Bomb",
                data: {
                    name: playerName,
                    adress: playerAdress,
                    x: characterLeft + characterWidth / 2,
                    y: characterTop + characterHeight / 2,
                    currentLife: currentLife

                }
            }))
        }
    });
}

export function GamePlay(socket, player, mapData) {

    let currentLife = player.lives

    // Vérifier les collisions avec les murs et les briques

    // const newRow = Math.floor(player.positionTop / 100);
    // const newCol = Math.floor(player.positionLeft / 98);
    // const bottomRow = Math.floor((player.positionTop + characterHeight) / 100);
    // const rightCol = Math.floor((player.positionLeft + characterWidth) / 98);



    const charWidth = characterBox.width = characterWidth
    const charHeight = characterBox.height = characterHeight
    const charTop = characterBox.top
    const charBottom = characterBox.bottom
    const charLeft = characterBox.left
    const charRight = characterBox.right


    let coordWall = {
        bottom: [],
        top: [],
        left: [],
        right: []
    }

    let coordBrick = {
        bottom: [],
        top: [],
        left: [],
        right: []
    }

    let checkFreeSpaceBrick = []
    let checkFreeSpaceWall = []

    // mapData.forEach((row, rowIndex) => {
    //     row.forEach((col, colIndex) => {
    //         if (col === "#") {
    //             coordWall.bottom.push(rowIndex * 100)
    //             coordWall.top.push(rowIndex * 100 + 100)
    //             coordWall.left.push(colIndex * 98)
    //             coordWall.right.push(colIndex * 98 + 98)
    //         } else if (col === "b") {
    //             coordBrick.bottom.push(rowIndex * 100)
    //             coordBrick.top.push(rowIndex * 100 + 100)
    //             coordBrick.left.push(colIndex * 98)
    //             coordBrick.right.push(colIndex * 98 + 98)
    //         }
    //     })
    // })

    let brickBox = []
    let wallBox = []

    document.querySelectorAll(".brick").forEach((element) => {

        let x = element.getBoundingClientRect().x
        let y = element.getBoundingClientRect().y
        let left = element.getBoundingClientRect().left
        let right = element.getBoundingClientRect().right
        let bottom = element.getBoundingClientRect().bottom
        let top = element.getBoundingClientRect().top

        let gauche = x / left
        let haut = y / top

        brickBox.push(gauche)
        brickBox.push(haut)
        brickBox.push(bottom)
        brickBox.push(right)



    })
    document.querySelectorAll(".wall").forEach((element) => {
        let x = element.getBoundingClientRect().x
        let y = element.getBoundingClientRect().y
        let left = element.getBoundingClientRect().left
        let right = element.getBoundingClientRect().right
        let bottom = element.getBoundingClientRect().bottom
        let top = element.getBoundingClientRect().top

        let gauche = x / left
        let haut = y / top

        wallBox.push(gauche)
        wallBox.push(haut)
        wallBox.push(bottom)
        wallBox.push(right)
    })

    console.log("brickBox", brickBox)
    console.log("wallBox", wallBox)

    let i = 0
    let j = 0
    document.addEventListener('keydown', (event) => {
        const walls = wallBox.sort()
        const bricks = brickBox.sort()


        if (event.key === 'ArrowRight') {
            // i = 0
            // j = 0

            // while (i < wallBox.length || j < brickBox.length) {

            //     // console.log("brickBox",brickBox)

            //     if (!wallBox.includes(player.positikonRight) && !brickBox.includes(player.positikonRight)) {
            //         player.canMove = true
            //         break
            //     }
            //     i++
            //     j++

            // }

            if (!walls.includes(player.positionLeft) || !bricks.includes(player.positionLeft)) {
                player.canMove = true
                // break
            } else {
                player.canMove = false
            }

            console.log("player.canMove right", player.canMove)


            // if (player.canMove) {

            if (player.positionRight >= walls[walls.length - 1]) {
                player.positionRight = wallBox[walls.length - 1]

                if (player.canMove) {
                    character.style.left = player.positionLeft + 'px';
                }
                // character.style.left = player.positionLeft + 'px';
                console.log("send player right")
                socket.send(JSON.stringify({
                    Type: "PlayerMoving",
                    Data: {
                        direction: "Right",
                        player: player.adress,
                        name: player.playerName,
                        position: player.positionLeft,
                        move: player.canMove
                    }
                }))
            } else {

                player.positionRight += 10
                if (player.canMove) {
                    character.style.left = player.positionLeft + 'px';
                }
                // character.style.left = player.positionLeft + 'px';
                console.log("send player right")
                socket.send(JSON.stringify({
                    Type: "PlayerMoving",
                    Data: {
                        direction: "Right",
                        player: player.adress,
                        name: player.playerName,
                        position: player.positionLeft,
                        move: player.canMove
                    }
                }))
            }
            // }
        }

        if (event.key === 'ArrowLeft') {
            // i = 0
            // j = 0
            // while (i < wallBox.length || j < brickBox.length) {

            //     if (!wallBox.includes(player.positionLeft) && !brickBox.includes(player.positionLeft)) {
            //         player.canMove = true
            //         break
            //     }
            //     i++
            //     j++
            // }

            if (!walls.includes(player.positionLeft) || !bricks.includes(player.positionLeft)) {
                player.canMove = true
                // break
            } else {
                player.canMove = false
            }

            console.log("player.canMove left", player.canMove)

            // if (player.canMove) {

            if (player.positionLeft <= walls[0]) {
                player.positionLeft = wallBox[0]
                if (player.canMove) {
                    character.style.left = player.positionLeft + 'px';
                }


                console.log("send player left")
                socket.send(JSON.stringify({
                    Type: "PlayerMoving",
                    Data: {
                        direction: "Left",
                        player: player.adress,
                        name: player.playerName,
                        position: player.positionLeft,
                        move: player.canMove
                    }
                }))

            } else {
                player.positionLeft -= 10
                if (player.canMove) {
                    character.style.left = player.positionLeft + 'px';
                }
                console.log("send player left")
                socket.send(JSON.stringify({
                    Type: "PlayerMoving",
                    Data: {
                        direction: "Left",
                        player: player.adress,
                        name: player.playerName,
                        position: player.positionLeft,
                        move: player.canMove
                    }
                }))
            }
            // }
        }
        if (event.key === 'ArrowUp') {
            // i = 0
            // j = 0
            // while (i < wallBox.length || i < brickBox.length) {

            //     if (!wallBox.includes(player.positionTop) && !brickBox.includes(player.positionTop)) {
            //         player.canMove = true
            //         break

            //     }
            //     i++
            //     j++
            // }

            if (!walls.includes(player.positionTop) || !bricks.includes(player.positionTop)) {
                player.canMove = true
                // break
            } else {
                player.canMove = false
            }

            console.log("player.canMove up", player.canMove)

            // if (player.canMove) {

            if (player.positionTop <= 0) {

                player.positionTop = wallBox[0]
                if (player.canMove) {
                    character.style.top = player.positionTop + 'px';
                }

                
                // character.style.top = player.positionTop + 'px';
                console.log("send player up")
                socket.send(JSON.stringify({
                    Type: "PlayerMoving",
                    Data: {
                        direction: "Up",
                        player: player.adress,
                        name: player.playerName,
                        position: player.positionTop,
                        move: player.canMove
                    }
                }))
            } else {
                player.positionTop -= 10
                if (player.canMove) {
                    character.style.top = player.positionTop + 'px';
                }
                console.log("send player up")
                socket.send(JSON.stringify({
                    Type: "PlayerMoving",
                    Data: {
                        direction: "Up",
                        player: player.adress,
                        name: player.playerName,
                        position: player.positionTop,
                        move: player.canMove
                    }
                }))
            }
            // }
        }

        if (event.key === 'ArrowDown') {
            // i = 0
            // j = 0
            // while (i < wallBox.length || i < brickBox.length) {

            //     if (!wallBox.includes(player.positionBottom) && !brickBox.includes(player.positionBottom)) {
            //         player.canMove = true
            //         break
            //     }
            //     i++
            //     j++
            // }

            if (!walls.includes(player.positionTop) || !bricks.includes(player.positionTop)) {
                player.canMove = true
                // break
            } else {
                player.canMove = false
            }

            console.log("player.canMove down", player.canMove)

            // if (player.canMove) {

            if (player.positionBottom >= walls[walls.length - 1]) {
                player.positionBottom = wallBox[walls.length - 1]
                if (player.canMove) {

                    character.style.top = player.positionTop + 'px';

                }

                console.log("send player down")
                socket.send(JSON.stringify({
                    Type: "PlayerMoving",
                    Data: {
                        direction: "Down",
                        player: player.adress,
                        name: player.playerName,
                        position: player.positionBottom,
                        move: player.canMove
                    }
                }))

            } else {

                player.positionBottom += 10
                if (player.canMove) {
                    character.style.top = player.positionTop + 'px';
                }
                console.log("send player down")
                socket.send(JSON.stringify({
                    Type: "PlayerMoving",
                    Data: {
                        direction: "Down",
                        player: player.adress,
                        name: player.playerName,
                        position: player.positionTop,
                        move: player.canMove
                    }
                }))
            }
            // }
        }

        checkFreeSpaceBrick = []
        checkFreeSpaceWall = []

        // Vérifier si le mouvement est possible

        // Gérer le mouvement du personnage avec les flèches du clavier

        // Ajouter la logique pour déposer une bombe avec la touche Espace
        if (event.key === ' ') { // Touche Espace
            dropBomb(character, characterLeft + characterWidth / 2, characterTop + characterHeight / 2, currentLife, player.hitPlayer);
            socket.send(JSON.stringify({
                Type: "Player Dropped Bomb",
                data: {
                    name: playerName,
                    adress: playerAdress,
                    x: characterLeft + characterWidth / 2,
                    y: characterTop + characterHeight / 2,
                    currentLife: currentLife

                }
            }))
        }
        // } 
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function dropBomb(character, x, y, currentLife, player) {
    const bomb = document.createElement('div');
    bomb.classList.add('bombe');
    bomb.style.left = x + 'px';
    bomb.style.top = y + 'px';
    bomberMan.appendChild(bomb);

    // Programmer l'animation d'explosion après 3 secondes
    setTimeout(function () {
        bomberMan.removeChild(bomb); // Supprimer l'élément de la bombe

        // Créer l'élément d'explosion
        const explosion = document.createElement('div');
        explosion.classList.add('explosion');
        explosion.style.left = x + 'px';
        explosion.style.top = y + 'px';
        bomberMan.appendChild(explosion);

        // Vérifier les collisions avec les briques
        const bricks = document.querySelectorAll('.brick');
        bricks.forEach((brick) => {
            if (checkCollision(explosion, brick)) {
                const brickRow = parseInt(brick.getAttribute('data-row'));
                const brickCol = parseInt(brick.getAttribute('data-col'));
                brick.style.visibility = 'hidden'; // Cacher la brique visuellement
                brick.classList.remove('brick'); // Retirer la classe "brick"

                mapData[brickRow][brickCol] = ' '; // Mettre à jour le modèle de données
                if (
                    checkCollision(explosion, character) &&
                    !player.hitPlayer
                ) {
                    player.hitPlayer = true; // Marquer que le joueur a été touché
                    reduceLife(currentLife, player); // Appeler la fonction pour réduire la vie du joueur
                    console.log("vie perdu");
                }
            }
        });

        // Supprimer l'élément d'explosion après un délai
        setTimeout(function () {
            bomberMan.removeChild(explosion);
        }, 1000); // Supprimer l'explosion après 1 seconde
    }, 2000); // 3 secondes
}

function reduceLife(currentLife, player) {
    const lifeElement = document.querySelector('.life');
    currentLife = parseInt(lifeElement.textContent);

    if (currentLife > 0) {
        currentLife--;
        lifeElement.textContent = currentLife;

        if (currentLife === 0) {
            const characterLife = document.querySelector('.character');
            bomberMan.removeChild(characterLife);
            console.log("Game over!");
            socket.send(JSON.stringify({
                Type: "GAME OVER",
                Data: {
                    name: player.namePlayer,
                    adress: player.playerAdress,
                }
            }))
        }
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////

function checkCollision(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
}

function Collision(positionLeft, positionTop, mapData) {

    let newRow = Math.floor(positionTop / 100);
    let newCol = Math.floor(positionLeft / 98);
    let bottomRow = Math.floor((positionTop + characterHeight) / 100);
    let rightCol = Math.floor((positionLeft + characterWidth) / 98);

    if (
        newRow >= 0 && newCol >= 0 &&
        bottomRow < mapData.length &&
        rightCol < mapData[0].length &&
        mapData[newRow][newCol] !== '#' &&
        mapData[newRow][rightCol] !== '#' &&
        mapData[bottomRow][newCol] !== '#' &&
        mapData[bottomRow][rightCol] !== '#' &&
        mapData[newRow][newCol] !== 'b' &&
        mapData[newRow][rightCol] !== 'b' &&
        mapData[bottomRow][newCol] !== 'b' &&
        mapData[bottomRow][rightCol] !== 'b'
    ) {
        return true
    } else {
        return false
    }
}

//////////////////////////////// FIN JEU ////////////////////////////////