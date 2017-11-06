let gl;

let radius_ = 3;
let numberOfVertices_ = 8;
let angleMouth_ = 45;


function drawPacman(radius, numberOfVertices, angleMouth) {

    // 1. Get canvas and setup WebGL context
    const canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl');

    // 2. Configure viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // 3. Specify geometry
    //x, y, r, g, b, size Geschweifte Klammern machen die Box zu einem Objekt, 
    //wo man direkt auf die Variablen zugreifen kann

    
    let pacman = new Float32Array([0, 0, 1, 1, 0, 1]);
    let winkel = 360/numberOfVertices;
   
    for(let i = (angleMouth/2) ; i <= (360 - angleMouth/2) ;i += winkel){
        console.log("hello??");
                                                    //for (let i = -1 ; i < 1; i += boxSize) {            //Iteration jede Spalte zu jeder Zeiler
                                                    //for (let j = -1 ; j < 1; j += boxSize) {
                                                    //if (i.toFixed(2) == -1 || i.toFixed(2) == 1 - boxSize || j.toFixed(2) == -1 || j.toFixed(2) == 1 - boxSize) {  //FLoatverbesserung auf 2.Nachkommastelle + Randbau
               
                pacman = pacman.concat([
                    Math.cos(i * ((Math.PI * 2) / 360)).toFixed(2),  
                    Math.sin(i * ((Math.PI * 2) / 360)).toFixed(2),  
                    1,
                    1,
                    0,
                    1                   
                ]);
                console.log(pacman);
            }
            
    // 4. Init shader program via additional function and bind it
    const program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // 5. Create VBO
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    // 6. Fill VBO with positions and colors
    gl.bufferData(gl.ARRAY_BUFFER, pacman, gl.STATIC_DRAW);

    // 7. Link data in VBO to shader variables
    const vPosition = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vPosition);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 24, 0);

    const vColor = gl.getAttribLocation(program, "vColor");
    gl.enableVertexAttribArray(vColor);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 24, 8);

    // 8. Render
    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, numberOfVertices_ + 1);
}

drawPacman(radius_, numberOfVertices_, angleMouth_);
