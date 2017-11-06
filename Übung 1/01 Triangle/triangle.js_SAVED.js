let gl;

function init() {

	// 1. Get canvas and setup WebGL context
    const canvas = document.getElementById("gl-canvas");
	gl = canvas.getContext('webgl');

	// 2. Configure viewport
	gl.viewport((canvas.width)/4,0, (canvas.width)/2, (canvas.height)/2);
	gl.clearColor(0.4,0.8,1,0.7);

	// 3. Specify geometry
	const vertices = new Float32Array([ -1, -1 , 
										-1, 0.5,
                                         1, 0.5,
	                                     1, -1 ,
                                        1, 0, 0, 1, 
									    1, 1, 0, 1,
									    0, 0, 1, 1,
                                        1, 1, 0, 1,
                                        ]);


	// 4. Init shader program via additional function and bind it
	const program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);
	
    // 5. Create VBO for positions and colors and activate it
	const posVBO = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, posVBO);

    // 6. Fill VBO with positions and colors
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // 7.1 Link data in VBO to shader variables
	const vPosition = gl.getAttribLocation(program, "vPosition");
	gl.enableVertexAttribArray(vPosition);
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

    // 7.2 Link data in VBO to shader variables
	const vColor = gl.getAttribLocation(program, "vColor");
	gl.enableVertexAttribArray(vColor);
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 32); // hier Offset von 34 Byte

	// 8. Render
	render();
};

function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

init();
