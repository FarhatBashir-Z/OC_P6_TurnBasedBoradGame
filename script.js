const rows = 10;
const cols = 10;
//Space for Arrays.Objects and Global Variables
const weaponsArray = [
	{ name: 'Rifle', power: 30, x: 0, y: 0, beenEquipped: false },
	{ name: 'Flail', power: 25, x: 0, y: 0, beenEquipped: false },
	{ name: 'Sword', power: 15, x: 0, y: 0, beenEquipped: false },
	{ name: 'Dagger', power: 10, x: 0, y: 0, beenEquipped: false }
];
const usersArray = [
	{
		username: 'Captin America',
		name: 'player1',
		health: 100, x: 0, y: 0,
		pname: 'Default',
		power: 10,
        weapon: null,
		has_moved: false,
		color: 'legal1',
		isAttacking: true,
		current_moves_available: 3,
		direction: "all",
		defend: false,
	},
	{
		username: 'Superman',
		name: 'player2',
		health: 100, x: 0, y: 0,
		pname: 'Default',
		power: 10,
        weapon: null,
		has_moved: true,
		color: 'legal2',
		isAttacking: true,
		current_moves_available: 3,
		direction: "all",
		defend: false,
	},
];
//holds 18 unique numbers --- 0-11 -> Obstacles --- 11-15 -> Weapons --- 15-17 -> 
class Game{
  constructor(){
		this.unique_cordinates = [];
		this.obstaclesArray = [];
		this.current_player = usersArray[0];
		this.toggler = 0;
		this.round = 0;
		this.unique_xy = [];
		this.squaresArray = [];
		this.max_moves = 3;
		this.current_moves = 0;
  }
 uniqueXY() {
	let count = 0;
	while (count < 18) {
		let randx = Math.floor(Math.random() * rows);
		let randy = Math.floor(Math.random() * cols);
		if (count > 16) {
			while (
				(this.unique_xy[16][0] == randx) && (Math.abs(this.unique_xy[16][1] - randy) < 2)
				||
				(this.unique_xy[16][1] == randy) && (Math.abs(this.unique_xy[16][0] - randx) < 2)) {
				randx = Math.floor(Math.random() * rows);
				randy = Math.floor(Math.random() * cols);
			}

		}
		if (this.unique_xy.filter(v => (v[0] === randx && v[1] === randy)).length === 0) {
			this.unique_xy.push([randx, randy]);
			count++;
		}
	}

}


//Create a grid of 10*10 dynamically with CSS grid
 createGrid() {
	for (let x = 0; x < 10; x++) {
		let row = [];
		for (let y = 0; y < 10; y++) {
			// let cell = $('<div class = "grid-item" data-x=' + x + ' data-y=' + y + '></div>');
			let cell = document.createElement("div");
			cell.setAttribute("class", "grid-item")
			cell.setAttribute("data-x", x);
			cell.setAttribute("data-y", y);
			//save in javascript variable.
			$('.grid-container').append(cell);
			row.push(cell);

			//Use createElement function to create the grid item.
		}
		this.squaresArray.push(row);
	}
}

// function to populate obstacles at 12 random positions
 populate_obstacles() {
	for (let i = 0; i < 12; i++) {
		let x = this.unique_xy[i][0]
		let y = this.unique_xy[i][1]
		this.squaresArray[x][y].classList.add('obstacle');
	}
}

//function to populate weapons at 4 random positions
 populate_items(array, offset, type) {
	//let userOnePos = undefined;
	for (let i = 0; i < array.length; i++) {
		let x = this.unique_xy[i + offset][0]
		let y = this.unique_xy[i + offset][1]
		this.squaresArray[x][y].classList.add(array[i].name);
		array[i].x = x;
		array[i].y = y;
	}
}

//function to switch players.
 switch_player() {
	console.log("chainging",current_player)
	if (isEven(toggler)) {
		console.log('P2 turn')
		this.current_player.direction = 'all';
		this.current_player.current_moves_available = 3;
		this.current_player = usersArray[1];
		toggler++
		console.log('current player changed to',current_player.name)
	}
	else {
		console.log('P1 turn')
		this.current_player.direction = 'all';
		this.current_player.current_moves_available = 3;
		this.current_player = usersArray[0];
		toggler++
		console.log('current player changed to',current_player.name)
	}
	this.checkFight();
	this.updateStatus();
}

//function move players
 handle_keys(event,self) {
	event.preventDefault();
	//console.log(event.key);
	var cond = true;
	if(cond){this.current_player = usersArray[0]; cond = false;}
	console.log(this.current_player)
	if (this.current_player.current_moves_available === 0) {
		this.switch_player();
	}
	if (this.current_player.current_moves_available > 0) {
		switch (event.key) {
			case "ArrowUp": self.move(this.current_player.x - 1, this.current_player.y, event.key, this.current_player.direction); break;
			case "ArrowDown": self.move(this.current_player.x + 1, this.current_player.y, event.key, this.current_player.direction); break;
			case "ArrowLeft": self.move(this.current_player.x, this.current_player.y - 1, event.key, this.current_player.direction); break;
			case "ArrowRight": self.move(this.current_player.x, this.current_player.y + 1, event.key, this.current_player.direction); break;
			//Use "s" to end moves by player instead taking all 3.
      case "s": this.switch_player(); break;
			}
	}
}

//function to check move is valid or not e.g if player is at 0:0 point and like to move left.
 move(newX, newY, desiredDirection, availableDirection) {
    //console.log(current_player)

	if ((newX > 9 || newY > 9) || (newX < 0 || newY < 0)) {
			//alert('Cant Move There');
			this.current_player.current_moves_available=0;
			return;
	}
    //function to check for obstacles is called here.
	if(this.checkObstacle(newX,newY)){
		//alert('Obstacle encountered');
		this.current_player.current_moves_available=0;
		return;
    }

    const weapon = weaponsArray.find(w => w.x == newX && w.y == newY)
    //console.log(weapon);

    if (weapon) {
    // remove the wepon from the board
		this.squaresArray[newX][newY].classList.remove(weapon.name)
		// if the player has a weapon drop the weapon in the current position 
        // because a new weapon will be equiped
		if (this.current_player.weapon) {
            const playerWeapon = weaponsArray.find(w => w.name == this.current_player.weapon);
            this.squaresArray[this.current_player.x][this.current_player.y].classList.add(playerWeapon.name);
        }
        // add the current player
        this.squaresArray[newX][newY].classList.add(this.current_player.name);
        // update the power of the current player with the damage of the weapon
        this.current_player.power = weapon.power;
        // update the weapon of the current player
				this.current_player.weapon = weapon.name;
				this.checkFight();
				this.updateStatus();
    }
	
	if (availableDirection === 'all') {
		let oldX = this.current_player.x;
		let oldY = this.current_player.y;
			this.squaresArray[newX][newY].classList.add(this.current_player.name);
			this.squaresArray[oldX][oldY].classList.remove(this.current_player.name);
			this.current_player.x = newX;
			this.current_player.y = newY;
			this.current_player.current_moves_available -= 1;
			this.current_player.direction = desiredDirection;
			this.checkFight();
			this.updateStatus();
	}
	else if (availableDirection != 'all' && desiredDirection === this.current_player.direction) {
		let oldX = this.current_player.x;
		let oldY = this.current_player.y;
			this.squaresArray[newX][newY].classList.add(this.current_player.name);
			this.squaresArray[oldX][oldY].classList.remove(this.current_player.name);
			this.current_player.x = newX;
			this.current_player.y = newY;
			this.current_player.current_moves_available -= 1;
			this.checkFight();
			this.updateStatus();
	}
  //after moving in a certian direction, player try to change direction.
	else {
		//alert("Invalid Move.");
		return;
	}
}

// function to check for obstacles.
 static checkObstacle(newX,newY){
	for (let i = 0; i < 12; i++) {
		let x = this.unique_xy[i][0]
		let y = this.unique_xy[i][1]
		if(newX === x && newY === y){
			return true;
		}
	}
}

 getOtherplayer(){
	return (this.current_player.name == 'player1')?usersArray[1]:usersArray[0]
}

 attack(){
	console.log('attack has been initiated')
	let otherplayer = getOtherplayer();
	if (otherplayer.defend){
		otherplayer.health = otherplayer.health-(this.current_player.power/2)
		otherplayer.defend = false;
			}
	else{
		otherplayer.health = otherplayer.health-this.current_player.power;
		otherplayer.defend = false;
	}

this.checkGameover();
//enable attack defend buttons for the other player, and disable attack defend button for current_player.
//write the if condition. 
this.switch_player();
}
 defend(){
	console.log('player choose to defend')
	this.current_player.defend = true;
	//enable attack defend buttons for the other player, and disable attack defend button for current_player.
	this.switch_player();
}

 checkGameover(){
  if (usersArray[0].health <= 0){
    alert("Superman Won");
		location.reload();
  }
  else if(usersArray[1].health <= 0){
    alert("Captin America Won")
		location.reload();
  }
}

 updateStatus(){
	var p1 = usersArray[0]
	var p2 = usersArray[1]

	var p1_Status = $('#p1-Status').empty();
	var p2_Status = $('#p2-Status').empty();

	var s1 = `
	<p>Health: ${p1.health} </p>
	<p>Weapon: ${p1.pname} </p>
	<p>Power: ${p1.power} </p>
	<p>Moves Left: ${p1.current_moves_available} </p>
	<p>Active: ${this.current_player==p1?'True':'False'}</p>
	`
	var s2 = `
	<p>Health: ${p2.health} </p>
	<p>Weapon: ${p2.pname} </p>
	<p>Power: ${p2.power} </p>
	<p>Moves Left: ${p2.current_moves_available} </p>
	<p>Active: ${this.current_player==p2?'True':'False'}</p>
	`

	p1_Status.append(s1)
	p2_Status.append(s2)

	$('#p1btn').hide()
	$('#p2btn').hide()

	if(this.checkFight()){
	this.current_player == p1?$('#p1btn').show():$('#p2btn').show()
	}
}
 checkFight(){
var cp = this.current_player;
var op = this.getOtherplayer();
var currentPosition = cp.x * 10 + cp.y
var otherPosition = op.x * 10 + op.y
var r = false;
var positions = [currentPosition - 10, currentPosition + 1, currentPosition + 10, currentPosition -1];
positions.forEach(pos =>{
	if (pos == otherPosition){
		r =  true;
		console.log('found')
	}
})

//console.log(cp.name,op.name);

return r;
}


 isEven(n) {
	return n % 2 == 0;
}
}
const game = new Game();
game.createGrid();
game.uniqueXY();
game.populate_obstacles();
game.populate_items(weaponsArray, 12, "weapons");
game.populate_items(usersArray, 16, "users");
game.updateStatus();
document.addEventListener("keydown", game.handle_keys,game);

