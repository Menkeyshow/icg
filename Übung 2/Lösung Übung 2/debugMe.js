let gl;
// Declare arrays with global scope to make them accessible throughout the entire program
let positions = [];
let colors = [];

function init() {

	// 1. Get canvas and setup WebGL context
    const canvas = document.getElementById("gl-canvas");
	gl = canvas.getContext('webgl');

	// 2. Configure viewport
	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(1.0,1.0,1.0,1.0);

	const blockSize = 0.1;
	// Use nested for loops to iterate over columns (outer loop) and rows (inner loop) of the canvas
	for(let i = -1 + blockSize/2; i < 1; i += blockSize) {
		for(let j = -1 + blockSize/2; j < 1; j += blockSize) {

			// Floating point arithmetic is not 100% accurate, e.g., 0.1 + 0.2 add up to 0.30000000000000004 (because of binary representation)
			// Workaround: use toFixed to convert i and j into strings with only 2 decimals
			if(i.toFixed(2) == 1 - blockSize/2 || j.toFixed(2) == 1 - blockSize/2 || i == -1 + blockSize/2 || j == -1 + blockSize/2) {
				
				const newSquare = {
					x: i,
					y: j,
					r: Math.random(),
					g: Math.random(),
					b: Math.random(),
					halfSize: blockSize/2
				};

				// 3. Specify geometry
				// Use concat to join old array with values of new square
				positions = positions.concat([	newSquare.x - newSquare.halfSize, newSquare.y - newSquare.halfSize, 
												newSquare.x - newSquare.halfSize, newSquare.y + newSquare.halfSize, 
									 			newSquare.x + newSquare.halfSize, newSquare.y + newSquare.halfSize, 
									 			newSquare.x + newSquare.halfSize, newSquare.y + newSquare.halfSize, 
									 			newSquare.x + newSquare.halfSize, newSquare.y - newSquare.halfSize, 
									 			newSquare.x - newSquare.halfSize, newSquare.y - newSquare.halfSize]);

				colors = colors.concat([		newSquare.r, newSquare.g, newSquare.b, 1,
								    			newSquare.r, newSquare.g, newSquare.b, 1, 
							        			newSquare.r, newSquare.g, newSquare.b, 1,
				                    			newSquare.r, newSquare.g, newSquare.b, 1, 
								    			newSquare.r, newSquare.g, newSquare.b, 1,
								    			newSquare.r, newSquare.g, newSquare.b, 1]);
			}
		}
	}

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
	// Compute offset of first color in VBO with NumberOfVertexPositions * NumberOfComponentsPerVertexPosition * NumberOfBytesPerComponent
	// = NumberOfVertices * 2 * 4 Bytes = positions.length * 4 Bytes
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, positions.length * 4); 

	// 8. Render
	render();
};

function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	// Compute number of vertices as positions.length / 2 (since array 'positions' contains x and y value for every vertex)
	gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);
}

init();
