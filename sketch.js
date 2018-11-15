var player;
var ground = [];
var textures = {
  PUMPKIN: null
}

function preload() {
  textures.PUMPKIN = loadImage('https://i.imgur.com/UQlTlIt.jpg');
}
function setup() {
    createCanvas(1000, 1000, WEBGL);
    player = new Player(new Vector(0, 50, 0), new Vector(1, 0, 0));



    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            ground.push(new Box(new Vector(i*50, 0, j*50), 50, {r: 255, g: 100, b: 0}));
        }
    }
}

function draw() {
    background(0, 0, 0);
    noFill();

    player.tick();
    player.render();

    for (let b of ground) {
        b.tick();
        b.render();
    }

    box(50);
}

class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
        return this;
    }

    multiply(m) {
        this.x *= m;
        this.y *= m;
        this.z *= m;
        return this;
    }

    mult(m) {
      let vec = this;
      vec.x *= m;
      vec.y *= m;
      vec.z *= m;
      return vec;
    }

    magnitude() {
        return sqrt(x*x + y*y + z*z);
    }

    normalize() {
        var mag = this.magnitude();
        this.x /= mag;
        this.y /= mag;
        this.z /= mag;
        return this;
    }

    cross(vec) { //right-hand rule
        var x = this.y * vec.z - this.z * vec.y;
        var y = this.z * vec.x - this.x * vec.z;
        var z = this.x * vec.y - this.y * vec.x;
        return new Vector(x, y, z);
    }

    static sphereToCart(r, t, p) {
        var x = r * cos(p) * cos(t);
        var y = r * sin(p);
        var z = r * cos(p) * sin(t);
        return new Vector(x, y, z);
    }
}

class Player {
    constructor(pos, dir) {
        this.pos = pos;
        this.dir = dir;
        this.forwardVelo = 0;
        this.friction = 0.8;
        this.turnVelo = 0;
        this.turnFriction = 0.8;
    }

    tick() {
        var theta = this.dir.y;
        var phi = this.dir.z;
        var radius = 1;
        this.dir = new Vector(radius, theta, phi);
        let moving = keyIsDown(87) || keyIsDown(83);

        if (keyIsDown(87)) { //forward
          this.forwardVelo += 5;
        }

        if (keyIsDown(83)) { //backward
          this.forwardVelo -= 5;
        }
        this.forwardVelo *= this.friction;

        let newpos = Vector.sphereToCart(this.forwardVelo, -theta, phi);
        newpos.y = 0;
        this.pos.add(newpos);

        if (keyIsDown(65) && moving) {
          this.turnVelo -= .01;
        }

        if (keyIsDown(68) && moving) {
          this.turnVelo += .01;
        }
        this.turnVelo *= this.turnFriction;
        this.dir.y += this.turnVelo;
    }

    render() {
      let dir = Vector.sphereToCart(this.dir.x, -this.dir.y, this.dir.z);
      camera(this.pos.x, this.pos.y + 25, this.pos.z, dir.x + this.pos.x, dir.y + this.pos.y + 25, dir.z + this.pos.z, 0, -1, 0);
    }
}

class Box {
    constructor(pos, size, col) {
        this.pos = pos;
        this.size = size;
        this.col = col;
    }

    tick() {

    }

    render() {
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        stroke(this.col.r, this.col.g, this.col.b);
        fill(0);
        texture(textures.PUMPKIN);
        box(this.size);
        pop();
    }
}
