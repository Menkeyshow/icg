/* Human-Computer Interaction
**
** Übung 2 - Aufgabe 1
**
** Birkenhagen, Maximilian    - 6948018
** Geislinger, Robert         - 6947836
** Regorz, Marvin             - 6801009
** Schönfeldt, Jan Alexander  - 6948115
** 
*/

let gl;

//Hier können die Parameter geändert werden.
let radius_ = 0.5;              
let numberOfVertices_ = 55;
let angleMouth_ = 50;


let pacman = [0, 0, 1, 1, 0, 1]; //Initialisieren eines Arrays mit dem Mittelpunkt des Pacman und der Farbe gelb

function drawPacman(radius, numberOfVertices, angleMouth) {

    // 1. Get canvas and setup WebGL context
    const canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl');

    // 2. Configure viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // 3. Specify geometry
    //Berechnung des Winkelabstands von einem Eckpunkt zum nächsten.
    let winkel = (360-angleMouth)/(numberOfVertices-1).toFixed(2); 

    for(let i = 0 ; i < numberOfVertices ;i ++){
           let ganzerWinkel = angleMouth/2 + i * winkel; //Berechnung des Winkels gegen den Uhrzeigersinn von der x-Achse aus.
                                
                pacman = pacman.concat([
                    (Math.cos(ganzerWinkel * ((Math.PI * 2) / 360)).toFixed(2)) * radius,  // x
                    (Math.sin(ganzerWinkel * ((Math.PI * 2) / 360)).toFixed(2)) * radius,  // y
                    1, 1, 0, 1                                                             // gelb
                ]);
            }
            
    // 4. Init shader program via additional function and bind it
    const program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // 5. Create VBO
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    // 6. Fill VBO with positions and colors
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(pacman), gl.STATIC_DRAW);

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
    gl.drawArrays(gl.TRIANGLE_FAN, 0, pacman.length/6);
}

drawPacman(radius_, numberOfVertices_, angleMouth_);
