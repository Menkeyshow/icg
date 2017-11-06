let gl;

const boxSize = 0.02;
let positions = [];
let colors = [];

function init() {

    // 1. Get canvas and setup WebGL context
    const canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl');

    // 2. Configure viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // 3. Specify geometry
    //x, y, r, g, b, size Geschweifte Klammern machen die Box zu einem Objekt, 
    //wo man direkt auf die Variablen zugreifen kann

    for (let i = -1 ; i < 1; i += boxSize) {            //Iteration jede Spalte zu jeder Zeiler
        for (let j = -1 ; j < 1; j += boxSize) {
            if (i.toFixed(2) == -1 || i.toFixed(2) == 1 - boxSize || j.toFixed(2) == -1 || j.toFixed(2) == 1 - boxSize) {  //FLoatverbesserung auf 2.Nachkommastelle + Randbau
                const box = {
                    x: i + boxSize / 2,
                    y: j + boxSize / 2,
                    r: Math.random(),
                    g: Math.random(),
                    b: Math.random(),
                    size: boxSize
                }

                // Wir bauen eine Box mithilfe von 2 Dreiecken
                //In den posotions wird dabei einmal die x und einmal
                //die y Koordinate relationell beschrieben

                positions = positions.concat([                                  //Verbinden von positions-arrays
                                   box.x - box.size / 2, box.y - box.size / 2,  //unten links
                                   box.x - box.size / 2, box.y + box.size / 2,  //oben links
                                   box.x + box.size / 2, box.y + box.size / 2,  //oben rechts

                                   box.x - box.size / 2, box.y - box.size / 2,  //unten links
                                   box.x + box.size / 2, box.y + box.size / 2,  //oben rechts
                                   box.x + box.size / 2, box.y - box.size / 2,  //unten rechts
                ]);

                colors = colors.concat([                                        //Verbinden von colors-array
                                    box.r, box.g, box.b, 1,
                                    box.r, box.g, box.b, 1,
                                    box.r, box.g, box.b, 1,
                                    box.r, box.g, box.b, 1,
                                    box.r, box.g, box.b, 1,
                                    box.r, box.g, box.b, 1,
                ]);
            }
        }
    }

    console.log(positions.length); //�berpr�fung, ob Array Konkatenation erfolgreich war


    // 4. Init shader program via additional function and bind it
    const program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // 5. Create VBO
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    // 6. Fill VBO with positions and colors
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions.concat(colors)), gl.STATIC_DRAW);

    // 7. Link data in VBO to shader variables
    const vPosition = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vPosition);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

    const vColor = gl.getAttribLocation(program, "vColor");
    gl.enableVertexAttribArray(vColor);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, positions.length * 4); //hier 48

    // 8. Render
    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, positions.length/2);
}

init();
