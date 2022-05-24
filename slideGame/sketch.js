let man, temp, temp2;

function setup(){
    createCanvas(600,300);
    man = new Man();

    let posArr = [man.pos1, man.pos2, man.pos3];
    let i = 0;

    setInterval(()=>{
        man.pos = posArr[i];
        if(++i === 3) i = 0;
    },200);
}

function draw(){
    background(180);
    man.show();
}

function Man(){

    this.x = 100;
    this.y = 100;
    this.show = function(){
        fill(10);

        //  Position 1:
        this.pos();
    }
    this.pos = function(){
        this.pos1();
    };

    this.pos1 = function(){
        ellipse(this.x+5,this.y-10,30,30);   // Head
        line(this.x, this.y+15, this.x-20, this.y+80);   // Body
        line(this.x, this.y+15, this.x-30, this.y+30); // Arm 1
        line(this.x-30, this.y+30, this.x-35, this.y+50); // Hand 1
        line(this.x, this.y+15, this.x+20, this.y+30); // Arm 2
        line(this.x+20, this.y+30, this.x+39, this.y+15); // Hand 2
        line(this.x-20, this.y+80, this.x-20, this.y+90); // Thigh 1
        line(this.x-20, this.y+90, this.x-35, this.y+105); // Leg 1
        line(this.x-20, this.y+80, this.x+10, this.y+60); // Thigh 2
        line(this.x+10, this.y+60, this.x, this.y+100); // Leg 2
    }
    this.pos2 = function(){
        //  Position 2:
        ellipse(this.x+5,this.y-10,30,30);   // Head
        line(this.x, this.y+15, this.x-20, this.y+80);   // Body
        line(this.x, this.y+15, this.x-30, this.y+39); // Arm 1
        line(this.x-30, this.y+39, this.x-5, this.y+50); // Hand 1
        line(this.x, this.y+15, this.x+10, this.y+39); // Arm 2
        line(this.x+10, this.y+39, this.x+35, this.y+15); // Hand 2
        line(this.x-20, this.y+80, this.x-25, this.y+100); // Thigh 1
        line(this.x-25, this.y+100, this.x-35, this.y+115); // Leg 1
        line(this.x-20, this.y+80, this.x, this.y+100); // Thigh 2
        line(this.x, this.y+100, this.x-10, this.y+110); // Leg 2
    }
    this.pos3 = function(){
        //  Position 3:
        ellipse(this.x+5,this.y-10,30,30);   // Head
        line(this.x, this.y+15, this.x-20, this.y+80);   // Body
        line(this.x, this.y+15, this.x-30, this.y+39); // Arm 1
        line(this.x-30, this.y+39, this.x+5, this.y+30); // Hand 1
        line(this.x, this.y+15, this.x+5, this.y+39); // Arm 2
        line(this.x+5, this.y+39, this.x+25, this.y+20); // Hand 1
        line(this.x-20, this.y+80, this.x-30, this.y+100); // Thigh 1
        line(this.x-30, this.y+100, this.x-39, this.y+115); // Leg 1
        line(this.x-20, this.y+80, this.x, this.y+80); // Thigh 2
        line(this.x, this.y+80, this.x-10, this.y+110); // Leg 2
    }
}