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

let pointLoc;
//let colorLoc;
let normalsLoc;

let lightPositionLoc,
	lightPosition,
	IaLoc,
	IdLoc,
	IsLoc;
let kaLoc;
let kdLoc;
let ksLoc;

let modelMatrixLoc,
	modelMatrix;

let	normalMatrixLoc,
	normalMatrix;

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
		constructor (from = {x: -0.5, y: -0.0, z: -0.5}, to = {x: 0.5, y: 0.5, z: 0.5}) {
			this.from = from;
			this.to = to;
			this.mesh = [];
			this.normals = [];
			this.orientation = {x: 0, y: 0, z: 0};
			this.position = {x: 0.0, y: 0.0, z: 0.0};
			this.verticesVBO = gl.createBuffer();
			this.SetModelMatrix(this.position, this.orientation);
			this.normalMatrix;
			this.ka = vec4.fromValues(0.218, 0.1084, 0.030, 1.0);
			this.kd = vec4.fromValues(0.545, 0.271, 0.075, 1.0);
			this.ks = vec4.fromValues(0.545, 0.271, 0.075, 1.0);
	
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
			];
	
			// Setze die Normalen - ähnlich zu den Positionen 
			// (Merke: eine Normale ist ein Richtungs- und kein Positionsvektor)
			this.normals = [
			//Front
			
			0.0, -0.3, -1.0,
			0.0, -0.3, -1.0,
			0.0, -0.3, -1.0,

			0.0, -0.3, -1.0,
			0.0, -0.3, -1.0,
			0.0, -0.3, -1.0,
			
			//Right
			1.0, -0.3, 0.0,
			1.0, -0.3, 0.0,
			1.0, -0.3, 0.0,

			1.0, -0.3, 0.0,
			1.0, -0.3, 0.0,
			1.0, -0.3, 0.0,

			//Back
			0.0, -0.3, 1.0,
			0.0, -0.3, 1.0,
			0.0, -0.3, 1.0,

			0.0, -0.3, -1.0,
			0.0, -0.3, -1.0,
			0.0, -0.3, -1.0,

			//Left
			-1.0, -0.3, 0.0,
			-1.0, -0.3, 0.0,
			-1.0, -0.3, 0.0,

			-1.0, -0.3, 0.0,
			-1.0, -0.3, 0.0,
			-1.0, -0.3, 0.0,

			//Bottom
			0.0, -1.0,  0.0,
			0.0, -1.0,  0.0,
			0.0, -1.0,  0.0,

			0.0, -1.0,  0.0,
			0.0, -1.0,  0.0,
			0.0, -1.0,  0.0,

			//Top
			0.0,  1.0,  0.0,
			0.0,  1.0,  0.0,
			0.0,  1.0,  0.0,
			 
			0.0,  1.0,  0.0,
			0.0,  1.0,  0.0,
			0.0,  1.0,  0.0			

		];
			


		}
	
		/**
		 * Sets the model and hopefully normal matrix
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

			//Set the normalmatrix 
			//(Erstelle hier die Normalenmatrix und speichere sie in die Variable this.normalMatrix
			//       Errechne dafür zunächst die modelMatrix im Weltkoordinatensystem, indem du sie mit der
			//       viewMatrix multiplizierst. Erzeuge dann die transponierte, inverse Normalenmatrix)
			this.normalMatrix = mat4.create();
			mat4.invert(this.normalMatrix,(modelMatrix * viewMatrix));
			mat4.transpose(this.normalMatrix,this.normalMatrix);
		}
	
		/**
		 * Sets the buffer data
		 */
		InitBuffer () {
			gl.useProgram(program);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesVBO);

			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.concat(this.normals)), gl.STATIC_DRAW);
			gl.uniformMatrix4fv(modelMatrixLoc, false, new Float32Array(this.modelMatrix));		
			gl.uniformMatrix4fv(normalMatrixLoc, false, new Float32Array(this.normalMatrix));		
			
		}
	
		/**
		 * Updates the model matrix to the buffer
		 */
		UpdateBuffer () {
			// Push the matrix to the buffer
			gl.uniformMatrix4fv(modelMatrixLoc, false, new Float32Array(this.modelMatrix));		
			gl.uniformMatrix4fv(normalMatrixLoc, false, new Float32Array(this.normalMatrix));

			//Übergebe hier die Materialkoeffizienten des Objektes an den Shader
			gl.uniform4f(kaLoc, this.ka[0], this.ka[1], this.ka[2], this.ka[3]);
			gl.uniform4f(ksLoc, this.ks[0], this.ks[1], this.ks[2], this.ks[3]);
			gl.uniform4f(kdLoc, this.kd[0], this.kd[1], this.kd[2], this.kd[3]);
			
		}
	
		Render () {
			
			// Bind the program and the vertex buffer object
			gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesVBO);
	
			// Set attribute pointers and enable them
			gl.vertexAttribPointer(pointLoc, 3, gl.FLOAT, false, 0, 0);
			gl.vertexAttribPointer(normalsLoc, 3, gl.FLOAT, false, 0, this.mesh.length*4);

			gl.enableVertexAttribArray(pointLoc);
			gl.enableVertexAttribArray(normalsLoc);
	
			// Set uniforms
			this.UpdateBuffer();
	
			// Draw the object
			gl.drawArrays(gl.TRIANGLES, 0, this.mesh.length/3);
		}
	}


class Cube {
	constructor (from = {x: 0.0, y: 0.0, z: 0.0}, to = {x: 0.0, y: 0.0, z: 0.0}, 
		Colors = {ka: [1, 1, 0, 1], kd: [1, 1, 0, 1], ks: [1, 1, 0, 1]}) {
		this.from = from;
		this.to = to;
		this.mesh = [];
		this.normals = [];
		this.orientation = {x: 0, y: 0, z: 0};
		this.position = {x: 0, y: 0, z: 0};
		this.verticesVBO = gl.createBuffer();
		this.modelMatrix;
		this.SetModelMatrix(this.position, this.orientation);
		this.normalMatrix;
		this.ka = vec4.fromValues(Colors.ka[0],Colors.ka[1],Colors.ka[2],Colors.ka[3]);
		this.kd = vec4.fromValues(Colors.kd[0],Colors.kd[1],Colors.kd[2],Colors.kd[3]);
		this.ks = vec4.fromValues(Colors.ks[0],Colors.ks[1],Colors.ks[2],Colors.ks[3]);

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
		];

		this.normals = [
			//Front
			0.0, 0.0, -1.0,
			0.0, 0.0, -1.0,
			0.0, 0.0, -1.0,

			0.0, 0.0, -1.0,
			0.0, 0.0, -1.0,
			0.0, 0.0, -1.0,
			
			//Right
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,

			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,

			//Back
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,

			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,

			//Left
			-1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0,

			-1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0,

			//Bottom
			0.0, -1.0,  0.0,
			0.0, -1.0,  0.0,
			0.0, -1.0,  0.0,

			0.0, -1.0,  0.0,
			0.0, -1.0,  0.0,
			0.0, -1.0,  0.0,

			//Top
			0.0,  1.0,  0.0,
			0.0,  1.0,  0.0,
			0.0,  1.0,  0.0,
			 
			0.0,  1.0,  0.0,
			0.0,  1.0,  0.0,
			0.0,  1.0,  0.0			

		];
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

			this.normalMatrix = mat4.create();
			mat4.invert(this.normalMatrix,(modelMatrix * viewMatrix));
			mat4.transpose(this.normalMatrix,this.normalMatrix);
		}

	/**
	 * Sets the buffer data
	 */
	InitBuffer () {
		gl.useProgram(program);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesVBO);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.concat(this.normals)), gl.STATIC_DRAW);
		gl.uniformMatrix4fv(modelMatrixLoc, false, new Float32Array(this.modelMatrix));		
		gl.uniformMatrix4fv(normalMatrixLoc, false, new Float32Array(this.normalMatrix));	
	}

	/**
	 * Updates the model matrix to the buffer
	 */
	UpdateBuffer () {
		// Push the matrix to the buffer
		gl.uniformMatrix4fv(modelMatrixLoc, false, new Float32Array(this.modelMatrix));	
		gl.uniformMatrix4fv(normalMatrixLoc, false, new Float32Array(this.normalMatrix));

		//Übergebe hier die Materialkoeffizienten des Objektes an den Shader
		gl.uniform4f(kaLoc, this.ka[0], this.ka[1], this.ka[2], this.ka[3]);
		gl.uniform4f(ksLoc, this.ks[0], this.ks[1], this.ks[2], this.ks[3]);
		gl.uniform4f(kdLoc, this.kd[0], this.kd[1], this.kd[2], this.kd[3]);
				
	
	}

	Render () {
		
		// Bind the program and the vertex buffer object
		gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesVBO);

		// Set attribute pointers and enable them
		gl.vertexAttribPointer(pointLoc, 3, gl.FLOAT, false, 0, 0);
		gl.vertexAttribPointer(normalsLoc, 3, gl.FLOAT, false, 0, this.mesh.length*4);
		gl.enableVertexAttribArray(pointLoc);
		gl.enableVertexAttribArray(normalsLoc);

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

	// 4. Init shader program via additional function and bind it
	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	// 7 Save attribute location to address them
	pointLoc = gl.getAttribLocation(program, "vPosition");
	normalsLoc = gl.getAttribLocation(program, "vNormal"); //statt color
	modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");

	

    // Set view matrix
	eye = vec3.fromValues(0.0, -0.75, 0.48);
	target = vec3.fromValues(0.0, 0.0, 0.47);
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
	
	// 3. Specify vertices
	
	//Himmel
	let Himmel = new Cube({x: -1.0, y: -1.0, z: -1.0},{x: 1.0, y: 1.0, z: 1.0}, {ka: [0.529, 0.808, 0.922, 1.0], kd: [0.0, 0.0, 0.0, 1.0], ks: [0.0, 0.0, 0.0, 1.0]});
	objects.push(Himmel);
	
	//Ozean
	let Ozean = new Cube({x: -1.0, y: -0.99, z: -1.0},{x: 1, y: -0.98, z: 1.0}, {ka: [0.0, 1.0, 1.0, 1.0], kd: [0.0, 0.8, 0.8, 1.0], ks: [0.0, 0.6, 0.6, 1.0]});	//rumspielen!
	objects.push(Ozean);

	//Strand
	let Strand = new Cube({x: -0.5, y: -0.98, z: -0.5},{x: 0.5, y: -0.97, z: 0.5}, {ka: [1.0, 1.0, 0.0, 1.0], kd: [0.5, 0.5, 0.0, 1.0], ks: [0.6, 0.6, 0.0, 1.0]}); //rumspielen!
	objects.push(Strand);
	
	
	//Palmenstamm
	let Palmenstamm1 = new Pyramidenstumpf({x: -0.04, y: -0.99, z: -0.04},{x: 0.04, y: -0.95, z: 0.04});
	objects.push(Palmenstamm1);
	
	let Palmenstamm2 = new Pyramidenstumpf({x: -0.04, y: -0.95, z: -0.04},{x: 0.04, y: -0.91, z: 0.04});
	objects.push(Palmenstamm2);

	let Palmenstamm3 = new Pyramidenstumpf({x: -0.04, y: -0.91, z: -0.04},{x: 0.04, y: -0.87, z: 0.04});
	objects.push(Palmenstamm3);

	let Palmenstamm4 = new Pyramidenstumpf({x: -0.04, y: -0.87, z: -0.04},{x: 0.04, y: -0.83, z: 0.04});
	objects.push(Palmenstamm4);

	let Palmenstamm5 = new Pyramidenstumpf({x: -0.04, y: -0.83, z: -0.04},{x: 0.04, y: -0.79, z: 0.04});
	objects.push(Palmenstamm5);

	let Palmenstamm6 = new Pyramidenstumpf({x: -0.04, y: -0.79, z: -0.04},{x: 0.04, y: -0.75, z: 0.04});
	objects.push(Palmenstamm6);

	let Palmenstamm7 = new Pyramidenstumpf({x: -0.04, y: -0.75, z: -0.04},{x: 0.04, y: -0.71, z: 0.04});
	objects.push(Palmenstamm7);
	

	//Palmenblätter
	let Palmenblatt1 = new Cube({x: -0.04, y: -0.71, z: -0.2},{x: 0.04, y: -0.715, z: 0.2}, {ka: [0.0, 0.2 ,0.0, 1.0], kd: [0.0, 0.3, 0.0, 1.0], ks: [0.0, 0.1,0.0, 1.0]});
	objects.push(Palmenblatt1);

	let Palmenblatt2 = new Cube(from = {x: -0.2, y: -0.71, z: -0.04}, to = {x: 0.2, y: -0.715, z: 0.04}, {ka: [0.0, 0.2 ,0.0, 1.0], kd: [0.0, 0.3,0.0, 1.0], ks: [0.0, 0.1, 0.0, 1.0]});
	objects.push(Palmenblatt2);


	//Hier die Speicherlocations der Normalenmatrix, der Materialkoeffizienten und der Lichtintensitäten in die globalen Variablen speichern
	normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");

	kaLoc = gl.getUniformLocation(program, "ka");
	kdLoc = gl.getUniformLocation(program, "kd");
	ksLoc = gl.getUniformLocation(program, "ks");

	//Setze hier die Lichteigenschaften I als Uniform-Variablen
	lightPositionLoc = gl.getUniformLocation(program, "lightPosition");
	gl.uniform3f(lightPositionLoc, 0.0, -0.80, 0.0); // Ecke vorne Links mit (0.0,-0.8,0.0)

	IaLoc = gl.getUniformLocation(program, "Ia");
	gl.uniform4f(IaLoc, 0.5, 0.5, 0.5, 1.0);

	IsLoc = gl.getUniformLocation(program, "Is");
	gl.uniform4f(IsLoc, 1.0, 1.0, 1.0, 1.0);

	IdLoc = gl.getUniformLocation(program, "Id");
	gl.uniform4f(IdLoc, 0.2, 0.2, 0.2, 1.0);

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