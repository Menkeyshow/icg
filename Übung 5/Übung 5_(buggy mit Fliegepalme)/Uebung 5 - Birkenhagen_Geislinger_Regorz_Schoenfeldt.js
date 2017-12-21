/* ICG
**
** Übung 6
**
** Gruppe 4_5 
** Birkenhagen, Maximilian    - 6948018
** Geislinger, Robert         - 6947836
** Regorz, Marvin             - 6801009
** Schönfeldt, Jan Alexander  - 6948115
** 
*/


// Environment variables
let gl,
	canvas;

// Scene variables
let objects = [];

// Shader variables
let program;

let pointLoc,
	colorLoc;

let modelMatrixLoc;

let viewMatrixLoc,
	viewMatrix;

let projectionMatrixLoc,
	projectionMatrix;

let eye, target, up;

let mouseX, mouseY;

let perspectiveHAngle = 270;
let perspectiveVAngle= 0 ;


function degToRad (deg) {
	return deg * Math.PI / 180;
}

class Pyramidenstumpf {
		constructor (from = {x: -0.5, y: -0.0, z: -0.5}, to = {x: 0.5, y: 0.5, z: 0.5}, 
			sideColors = {front: [0.545, 0.271, 0.075, 1], right: [0.545, 0.271, 0.075, 1], back: [0.545, 0.271, 0.075, 1], left: [0.545, 0.271, 0.075, 1],
				 bottom: [0.545, 0.271, 0.075, 1], top: [0.545, 0.271, 0.075, 1]}) {
			this.from = from;
			this.to = to;
			this.sideColors = sideColors;
			this.mesh = [];
			this.colors = [];
			this.orientation = {x: 0, y: 0, z: 0};
			this.position = {x: 0.0, y: -0.99, z: 0.0};
			this.verticesVBO = gl.createBuffer();
			this.modelMatrix = this.SetModelMatrix(this.position, this.orientation);
	
			this.MakeModel();
			this.InitBuffer();
		}
	
		/**
		 * Makes the model, namely the mesh and the colors arrays
		 */
		MakeModel () {
			this.mesh = [
				// Front
				this.from.x*(1/2), this.from.y, this.to.z*(1/2),
				this.to.x*(1/2), this.from.y, this.to.z*(1/2),
				this.from.x, this.to.y, this.to.z,
	
				this.to.x, this.to.y, this.to.z,
				this.from.x, this.to.y, this.to.z,
				this.to.x*(1/2), this.from.y, this.to.z*(1/2),
	
				// Right
				this.to.x, this.to.y, this.to.z,
				this.to.x*(1/2), this.from.y, this.to.z*(1/2),
				this.to.x*(1/2), this.from.y, this.from.z*(1/2),
	
				this.to.x, this.to.y, this.from.z,
				this.to.x, this.to.y, this.to.z,
				this.to.x*(1/2), this.from.y, this.from.z*(1/2),
	
				// Back
				this.from.x*(1/2), this.from.y, this.from.z*(1/2),
				this.to.x*(1/2), this.from.y, this.from.z*(1/2),
				this.from.x, this.to.y, this.from.z,
	
				this.to.x, this.to.y, this.from.z,
				this.from.x, this.to.y, this.from.z,
				this.to.x*(1/2), this.from.y, this.from.z*(1/2),
	
				// Left
				this.from.x, this.to.y, this.to.z,
				this.from.x*(1/2), this.from.y, this.to.z*(1/2),
				this.from.x*(1/2), this.from.y, this.from.z*(1/2),
	
				this.from.x, this.to.y, this.from.z,
				this.from.x, this.to.y, this.to.z,
				this.from.x*(1/2), this.from.y, this.from.z*(1/2),
	
				// Bottom
				this.from.x*(1/2), this.from.y, this.to.z*(1/2),
				this.from.x*(1/2), this.from.y, this.from.z*(1/2),
				this.to.x*(1/2), this.from.y, this.to.z*(1/2),
	
				this.to.x*(1/2), this.from.y, this.from.z*(1/2),
				this.from.x*(1/2), this.from.y, this.from.z*(1/2),
				this.to.x*(1/2), this.from.y, this.to.z*(1/2),
	
				// Top
				this.from.x, this.to.y, this.to.z,
				this.from.x, this.to.y, this.from.z,
				this.to.x, this.to.y, this.to.z,
	
				this.to.x, this.to.y, this.from.z,
				this.from.x, this.to.y, this.from.z,
				this.to.x, this.to.y, this.to.z
			]
	
			for (let i = 0; Math.floor(i/6) < 6; i++) {
	
				this.colors = this.colors.concat(Object.values(this.sideColors)[Math.floor(i/6)]);
	
			}
		}
	
		/**
		 * Sets the model matrix
		 * @param {Object} position x,y,z
		 * @param {Object} orientation x,y,z - angles in degree
		 */
		SetModelMatrix (position, orientation) {
			
			// Convert the orientation to RAD
			orientation = {x: degToRad(orientation.x), y: degToRad(orientation.y), z: degToRad(orientation.z)};
		
			// Set the transformation matrix
			return [
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				position.x, position.y, position.z, 1
			];
		}
	
		/**
		 * Sets the buffer data
		 */
		InitBuffer () {
			gl.useProgram(program);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesVBO);
	
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.concat(this.colors)), gl.STATIC_DRAW);
		}
	
		/**
		 * Updates the model matrix to the buffer
		 */
		UpdateBuffer () {
			// Push the matrix to the buffer
			gl.uniformMatrix4fv(modelMatrixLoc, false, new Float32Array(this.modelMatrix));		
		}
	
		Render () {
			
			// Bind the program and the vertex buffer object
			gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesVBO);
	
			// Set attribute pointers and enable them
			gl.vertexAttribPointer(pointLoc, 3, gl.FLOAT, false, 0, 0);
			gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, this.mesh.length*4);
			gl.enableVertexAttribArray(pointLoc);
			gl.enableVertexAttribArray(colorLoc);
	
			// Set uniforms
			this.UpdateBuffer();
	
			// Draw the object
			gl.drawArrays(gl.TRIANGLES, 0, this.mesh.length/3);
		}
	}


class Cube {
	constructor (from = {x: -0.5, y: -0.5, z: -0.5}, to = {x: 0.5, y: 0.5, z: 0.5}, 
		sideColors = {front: [0, 0, 1, 1], right: [0, 1, 0, 1], back: [1, 0, 0, 1], left: [1, 1, 0, 1],
			 bottom: [1, 0, 1, 1], top: [0, 1, 1, 1]}) {
		this.from = from;
		this.to = to;
		this.sideColors = sideColors;
		this.mesh = [];
		this.colors = [];
		this.orientation = {x: 0, y: 0, z: 0};
		this.position = {x: 0, y: 0, z: 0};
		this.verticesVBO = gl.createBuffer();
		this.modelMatrix = this.SetModelMatrix(this.position, this.orientation);

		this.MakeModel();
		this.InitBuffer();
	}

	/**
	 * Makes the model, namely the mesh and the colors arrays
	 */
	MakeModel () {
		this.mesh = [
			// Front
			this.from.x, this.from.y, this.to.z,
			this.to.x, this.from.y, this.to.z,
			this.from.x, this.to.y, this.to.z,

			this.to.x, this.to.y, this.to.z,
			this.from.x, this.to.y, this.to.z,
			this.to.x, this.from.y, this.to.z,

			// Right
			this.to.x, this.to.y, this.to.z,
			this.to.x, this.from.y, this.to.z,
			this.to.x, this.from.y, this.from.z,

			this.to.x, this.to.y, this.from.z,
			this.to.x, this.to.y, this.to.z,
			this.to.x, this.from.y, this.from.z,

			// Back
			this.from.x, this.from.y, this.from.z,
			this.to.x, this.from.y, this.from.z,
			this.from.x, this.to.y, this.from.z,

			this.to.x, this.to.y, this.from.z,
			this.from.x, this.to.y, this.from.z,
			this.to.x, this.from.y, this.from.z,

			// Left
			this.from.x, this.to.y, this.to.z,
			this.from.x, this.from.y, this.to.z,
			this.from.x, this.from.y, this.from.z,

			this.from.x, this.to.y, this.from.z,
			this.from.x, this.to.y, this.to.z,
			this.from.x, this.from.y, this.from.z,

			// Bottom
			this.from.x, this.from.y, this.to.z,
			this.from.x, this.from.y, this.from.z,
			this.to.x, this.from.y, this.to.z,

			this.to.x, this.from.y, this.from.z,
			this.from.x, this.from.y, this.from.z,
			this.to.x, this.from.y, this.to.z,

			// Top
			this.from.x, this.to.y, this.to.z,
			this.from.x, this.to.y, this.from.z,
			this.to.x, this.to.y, this.to.z,

			this.to.x, this.to.y, this.from.z,
			this.from.x, this.to.y, this.from.z,
			this.to.x, this.to.y, this.to.z
		]

		for (let i = 0; Math.floor(i/6) < 6; i++) {

			this.colors = this.colors.concat(Object.values(this.sideColors)[Math.floor(i/6)]);

		}
	}

	/**
	 * Sets the model matrix
	 * @param {Object} position x,y,z
	 * @param {Object} orientation x,y,z - angles in degree
	 */
	SetModelMatrix (position, orientation) {
		
		// Convert the orientation to RAD
		orientation = {x: degToRad(orientation.x), y: degToRad(orientation.y), z: degToRad(orientation.z)};
	
		// Set the transformation matrix
		this.modelMatrix = mat4.create();
		mat4.translate(this.modelMatrix, this.modelMatrix, [position.x, position.y, position.z]);
		mat4.rotate(this.modelMatrix, this.modelMatrix, orientation.x, [1, 0, 0]);
		mat4.rotate(this.modelMatrix, this.modelMatrix, orientation.y, [0, 1, 0]);
		mat4.rotate(this.modelMatrix, this.modelMatrix, orientation.z, [0, 0, 1]);
	}

	/**
	 * Sets the buffer data
	 */
	InitBuffer () {
		gl.useProgram(program);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesVBO);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.concat(this.colors)), gl.STATIC_DRAW);
	}

	/**
	 * Updates the model matrix to the buffer
	 */
	UpdateBuffer () {
		// Push the matrix to the buffer
		gl.uniformMatrix4fv(modelMatrixLoc, false, new Float32Array(this.modelMatrix));		
	}

	Render () {
		
		// Bind the program and the vertex buffer object
		gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesVBO);

		// Set attribute pointers and enable them
		gl.vertexAttribPointer(pointLoc, 3, gl.FLOAT, false, 0, 0);
		gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, this.mesh.length*4);
		gl.enableVertexAttribArray(pointLoc);
		gl.enableVertexAttribArray(colorLoc);

		// Set uniforms
		this.UpdateBuffer();

		// Draw the object
		gl.drawArrays(gl.TRIANGLES, 0, this.mesh.length/3);
	}
}

/**
 * Initializes the program, models and shaders
 */
function init() {

	// 1. Get canvas and setup WebGL context
    canvas = document.getElementById("gl-canvas");
	gl = canvas.getContext('webgl');
	
	// 2. Configure viewport
	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(0.95,0.95,0.95,1.0);
	gl.enable(gl.DEPTH_TEST);

	// 3. Specify vertices

	//Himmel
	objects.push(new Cube(from = {x: -1.0, y: -1.0, z: -1.0}, to = {x: 1.0, y: 1.0, z: 1.0}, sideColors = {front: [0.529, 0.808, 0.980, 1], right: [0.529, 0.808, 0.980, 1], back: [0.529, 0.808, 0.980, 1], left: [0.529, 0.808, 0.980, 1], bottom: [0.529, 0.808, 0.980, 1], top: [0.529, 0.808, 0.980, 1]}));
	
	//Ozean
	objects.push(new Cube(from = {x: -1.0, y: -0.99, z: -1.0}, to = {x: 1, y: -0.99, z: 1.0}, sideColors = {front: [0, 0, 1, 1], right: [1, 1, 0, 1], back: [1, 1, 0, 1], left: [1, 1, 0, 1], bottom: [0, 0, 1, 1], top: [0, 0, 1, 1]}));	
	
	//Strand
	objects.push(new Cube(from = {x: -0.5, y: -0.99, z: -0.5}, to = {x: 0.5, y: -0.98, z: 0.5}, sideColors = {front: [1, 1, 0, 1], right: [1, 1, 0, 1], back: [1, 1, 0, 1], left: [1, 1, 0, 1], bottom: [1, 1, 0, 1], top: [1, 1, 0, 1]}));	
	
	//Palmenstamm

	let digga = new Pyramidenstumpf(from = {x: -0.04, y: 0.0, z: -0.04}, to = {x: 0.04, y: 0.04, z: 0.04}, 
		sideColors = {front: [0.545, 0.271, 0.075, 1], right: [0.545, 0.271, 0.075, 1], back: [0.545, 0.271, 0.075, 1], left: [0.545, 0.271, 0.075, 1],
			bottom: [0.545, 0.271, 0.075, 1], top: [0.545, 0.271, 0.075, 1]});

			//digga.SetModelMatrix({x: 0, y: 0, z: 0}, {x: 45, y: 45, z: 45});

			objects.push(digga);
	
	objects.push(new Pyramidenstumpf(from = {x: -0.04, y: 0.04, z: -0.04}, to = {x: 0.04, y: 0.08, z: 0.04}, 
		sideColors = {front: [0.545, 0.271, 0.075, 1], right: [0.545, 0.271, 0.075, 1], back: [0.545, 0.271, 0.075, 1], left: [0.545, 0.271, 0.075, 1],
			bottom: [0.545, 0.271, 0.075, 1], top: [0.545, 0.271, 0.075, 1]}));

	objects.push(new Pyramidenstumpf(from = {x: -0.04, y: 0.08, z: -0.04}, to = {x: 0.04, y: 0.12, z: 0.04}, 
		sideColors = {front: [0.545, 0.271, 0.075, 1], right: [0.545, 0.271, 0.075, 1], back: [0.545, 0.271, 0.075, 1], left: [0.545, 0.271, 0.075, 1],
			bottom: [0.545, 0.271, 0.075, 1], top: [0.545, 0.271, 0.075, 1]}));

	objects.push(new Pyramidenstumpf(from = {x: -0.04, y: 0.12, z: -0.04}, to = {x: 0.04, y: 0.16, z: 0.04}, 
		sideColors = {front: [0.545, 0.271, 0.075, 1], right: [0.545, 0.271, 0.075, 1], back: [0.545, 0.271, 0.075, 1], left: [0.545, 0.271, 0.075, 1],
			bottom: [0.545, 0.271, 0.075, 1], top: [0.545, 0.271, 0.075, 1]}));

	objects.push(new Pyramidenstumpf(from = {x: -0.04, y: 0.16, z: -0.04}, to = {x: 0.04, y: 0.20, z: 0.04}, 
		sideColors = {front: [0.545, 0.271, 0.075, 1], right: [0.545, 0.271, 0.075, 1], back: [0.545, 0.271, 0.075, 1], left: [0.545, 0.271, 0.075, 1],
			bottom: [0.545, 0.271, 0.075, 1], top: [0.545, 0.271, 0.075, 1]}));

	objects.push(new Pyramidenstumpf(from = {x: -0.04, y: 0.2, z: -0.04}, to = {x: 0.04, y: 0.24, z: 0.04}, 
		sideColors = {front: [0.545, 0.271, 0.075, 1], right: [0.545, 0.271, 0.075, 1], back: [0.545, 0.271, 0.075, 1], left: [0.545, 0.271, 0.075, 1],
			bottom: [0.545, 0.271, 0.075, 1], top: [0.545, 0.271, 0.075, 1]}));

	objects.push(new Pyramidenstumpf(from = {x: -0.04, y: 0.24, z: -0.04}, to = {x: 0.04, y: 0.28, z: 0.04}, 
		sideColors = {front: [0.545, 0.271, 0.075, 1], right: [0.545, 0.271, 0.075, 1], back: [0.545, 0.271, 0.075, 1], left: [0.545, 0.271, 0.075, 1],
			bottom: [0.545, 0.271, 0.075, 1], top: [0.545, 0.271, 0.075, 1]}));
	
	//Palmenblätter
	objects.push(new Cube(from = {x: -0.04, y: -0.71, z: -0.2}, to = {x: 0.04, y: -0.715, z: 0.2}, sideColors = {front: [0.000, 0.502, 0.000, 1], right: [0.000, 0.502, 0.000, 1], back: [0.000, 0.502, 0.000, 1], left: [0.000, 0.502, 0.000, 1], bottom: [0.000, 0.502, 0.000, 1], top: [0.000, 0.502, 0.000, 1]}));
	objects.push(new Cube(from = {x: -0.2, y: -0.71, z: -0.04}, to = {x: 0.2, y: -0.715, z: 0.04}, sideColors = {front: [0.000, 0.502, 0.000, 1], right: [0.000, 0.502, 0.000, 1], back: [0.000, 0.502, 0.000, 1], left: [0.000, 0.502, 0.000, 1], bottom: [0.000, 0.502, 0.000, 1], top: [0.000, 0.502, 0.000, 1]}));
	
	// 4. Init shader program via additional function and bind it
	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	// 7 Save attribute location to address them
	pointLoc = gl.getAttribLocation(program, "vPosition");
	colorLoc = gl.getAttribLocation(program, "vColor");
	modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");

    // Set view matrix
	eye = vec3.fromValues(0.0, -0.75, 0.48);
	target = vec3.fromValues(0.0, -0.76, 0.47);
	up = vec3.fromValues(0.0, 1.0, 0.0);

	viewMatrix = mat4.create();
	mat4.lookAt(viewMatrix, eye, target, up);

	// 7 Save uniform location and save the view matrix into it
	viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
	gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);

    // Set projection matrix

	projectionMatrix = mat4.create();
	mat4.perspective(projectionMatrix, Math.PI * 0.4, canvas.width / canvas.height, 0.1, 100);

	// 7 Save uniform location and save the projection matrix into it
	projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
	gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);
	
	//Melde Listener an
	window.addEventListener('keydown', TastenAktion);
	window.addEventListener('mousemove', MausAktion);
	// 8. Render
	render();
};

function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Call every render function
    objects.forEach(function(object) {
		object.Render();
	});

	    // Set view matrix
		viewMatrix = mat4.create();
		mat4.lookAt(viewMatrix, eye, target, up);
	
		// 7 Save uniform location and save the view matrix into it
		viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
		gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);

	requestAnimationFrame(render);
}



function MausAktion(e) {
	
	//horizontal
	perspectiveHAngle = (180 + e.x*0.5) % 360;

	target[0]=eye[0] + Math.cos(degToRad(perspectiveHAngle));
	target[2]=eye[2] + Math.sin(degToRad(perspectiveHAngle));

	//vertikal
	let v = (e.y-260)/260*45;
	if(v < -44){
		perspectiveVAngle=-44;
	}else{
		if(v > 44){
			perspectiveVAngle = 44;
		}
		else{
			perspectiveVAngle = v;
		}
	}

	if(perspectiveVAngle == 0){
		target[1] = eye[1];
	}else{
	target[1]=eye[1]+(Math.sin(degToRad(-perspectiveVAngle))*(Math.cos(degToRad(perspectiveHAngle)))/(Math.cos(degToRad(-perspectiveHAngle))));
	}


}
function localEyeAndTarget(winkel){
	let localEyeX =  eye[0] + 0.01*Math.cos(degToRad(perspectiveHAngle+winkel));
	let localTargetX	= target[0] + 0.01*Math.cos(degToRad(perspectiveHAngle+winkel));
	if((localEyeX < 0.5) && (localEyeX > -0.5)){
		target[0] = localTargetX;
		eye[0] = localEyeX;
		
	}
	
	let localEyeZ = eye[2] + 0.01*Math.sin(degToRad(perspectiveHAngle+winkel));
	let localTargetZ =target[2] + 0.01*Math.sin(degToRad(perspectiveHAngle+winkel));
	if ((localEyeZ < 0.5) && (localEyeZ > -0.5)){
	target[2] = localTargetZ;
	eye[2] =localEyeZ;
	}

}
function TastenAktion(e) {
    let key = e.key;
    switch(key){
		case 'a' : 
		localEyeAndTarget(-90);
        break

		case 's' : 
		localEyeAndTarget(-180);
        break

		case 'w' : 
		localEyeAndTarget(0);
		break
		
		case 'd' : 
		localEyeAndTarget(90);		
		break


	}

	gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
	
}
init ();