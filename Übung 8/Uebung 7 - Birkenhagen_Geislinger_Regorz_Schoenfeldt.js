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
	normalsLoc,
	texCoordLoc;

let modelMatrixLoc,
	modelMatrix;

let lightPositionLoc,
	lightPosition,
	IaLoc,
	IdLoc,
	IsLoc,
	kaLoc,
	kdLoc,
	ksLoc,
	isTexturedLoc;

let	normalMatrixLoc,
	normalMatrix;

let viewMatrixLoc,
	viewMatrix;

let clock;

let projectionMatrixLoc,
	projectionMatrix;

	let keyPressed = {
		KeyW: false,
		KeyA: false,
		KeyS: false,
		KeyD: false
	};

let sandTexture,
	sandNormalTexture;
let diffuseMapLoc,
	normalMapLoc;

	const speed = 0.02;

let perspectiveHAngle = 270;
let perspectiveVAngle= 0 ;


function degToRad (deg) {
	return deg * Math.PI / 180;
}

class Pyramidenstumpf {
		constructor (from = {x: -0.5, y: -0.0, z: -0.5}, to = {x: 0.5, y: 0.5, z: 0.5}, 
			isTextured = 0) {
			this.from = from;
			this.to = to;
			this.mesh;
			this.normals;
			this.orientation = {x: 0, y: 0, z: 0};
			this.position = {x: 0.0, y: 0.0, z: 0.0};
			this.verticesVBO = gl.createBuffer();
			this.modelMatrix;
			this.normalMatrix;
			this.ka = vec4.fromValues(0.218, 0.1084, 0.030, 1.0);
			this.kd = vec4.fromValues(0.545, 0.271, 0.075, 1.0);
			this.ks = vec4.fromValues(0.0, 0.0, 0.0, 1.0);
			this.specularExponent = 4.0;
			this.isTextured = isTextured;

			this.SetModelMatrix(this.position, this.orientation);
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
			//Back
			0.0, -0.3, 1.0,
			0.0, -0.3, 1.0,
			0.0, -0.3, 1.0,

			0.0, -0.3, 1.0,
			0.0, -0.3, 1.0,
			0.0, -0.3, 1.0,
			
			//Right
			1.0, -0.3, 0.0,
			1.0, -0.3, 0.0,
			1.0, -0.3, 0.0,

			1.0, -0.3, 0.0,
			1.0, -0.3, 0.0,
			1.0, -0.3, 0.0,

			//Front
			
			0.0, -0.3, -1.0,
			0.0, -0.3, -1.0,
			0.0, -0.3, -1.0,

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
		SetModelMatrix (position = this.position, orientation = this.orientation) {
		
			// Convert the orientation to RAD
			this.position = position;
			this.orientation = orientation;

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
			let modelViewMatrix = mat4.create();
			mat4.multiply(modelViewMatrix, viewMatrix, this.modelMatrix);
			this.normalMatrix = mat4.create();
			mat4.transpose(this.normalMatrix, modelViewMatrix);
			mat4.invert(this.normalMatrix, this.normalMatrix);

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
			gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesVBO);

			this.SetModelMatrix();

			// Push the matrix to the buffer
			gl.uniformMatrix4fv(modelMatrixLoc, false, new Float32Array(this.modelMatrix));		
			gl.uniformMatrix4fv(normalMatrixLoc, false, new Float32Array(this.normalMatrix));

			//Übergebe hier die Materialkoeffizienten des Objektes an den Shader
			gl.uniform4f(kaLoc, this.ka[0], this.ka[1], this.ka[2], this.ka[3]);
			gl.uniform4f(ksLoc, this.ks[0], this.ks[1], this.ks[2], this.ks[3]);
			gl.uniform4f(kdLoc, this.kd[0], this.kd[1], this.kd[2], this.kd[3]);
			gl.uniform1f(specularExponentLoc, this.specularExponent);	
			gl.uniform1i(isTexturedLoc, this.isTextured);
			
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
		Colors = {ka: [1.0, 1.0, 0.0, 1.0], kd: [1.0, 1.0, 0.0, 1], 
			ks: [1.0, 1.0, 0.0, 1.0]}, isTextured = 0) {
		this.from = from;
		this.to = to;
		this.mesh;
		this.normals;
		this.textureCoordinates;
		this.orientation = {x: 0, y: 0, z: 0};
		this.position = {x: 0, y: 0, z: 0};
		this.verticesVBO = gl.createBuffer();
		this.modelMatrix;
		this.normalMatrix;
		this.ka = vec4.fromValues(Colors.ka[0],Colors.ka[1],Colors.ka[2],Colors.ka[3]);
		this.kd = vec4.fromValues(Colors.kd[0],Colors.kd[1],Colors.kd[2],Colors.kd[3]);
		this.ks = vec4.fromValues(Colors.ks[0],Colors.ks[1],Colors.ks[2],Colors.ks[3]);
		this.specularExponent = 4.0;
		this.isTextured = isTextured;

		this.SetModelMatrix(this.position, this.orientation);
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

		this.normals = [
			// Front
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,

			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,

			// Right
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,

			// Back
			0.0, 0.0, -1.0,
			0.0, 0.0, -1.0,
			0.0, 0.0, -1.0,

			0.0, 0.0, -1.0,
			0.0, 0.0, -1.0,
			0.0, 0.0, -1.0,

			// Left
			-1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0,

			-1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0,

			// Bottom
			0.0, -1.0, 0.0,
			0.0, -1.0, 0.0,
			0.0, -1.0, 0.0,

			0.0, -1.0, 0.0,
			0.0, -1.0, 0.0,
			0.0, -1.0, 0.0,

			// Top
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,

			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0
		];
		this.textureCoordinates = [
			// Front
			1.0, 0.0,
			0.0, 0.0,
			1.0, 1.0,

			0.0, 1.0,
			1.0, 1.0,
			0.0, 0.0,

			// Right
			1.0, 1.0,
			1.0, 0.0,
			0.0, 0.0,

			0.0, 1.0,
			1.0, 1.0,
			0.0, 0.0,

			// Back
			0.0, 0.0,
			1.0, 0.0,
			0.0, 1.0,

			1.0, 1.0,
			0.0, 1.0,
			1.0, 0.0,

			// Left
			0.0, 1.0,
			0.0, 0.0,
			1.0, 0.0,

			1.0, 1.0,
			0.0, 1.0,
			1.0, 0.0,

			// Bottom
			0.0, 1.0,
			0.0, 0.0,
			1.0, 1.0,

			1.0, 0.0,
			0.0, 0.0,
			1.0, 1.0,

			// Top
			0.0, 1.0,
			0.0, 0.0,
			1.0, 1.0,

			1.0, 0.0,
			0.0, 0.0,
			1.0, 1.0
		];
	}

	/**
	 * Sets the model matrix
	 * @param {Object} position x,y,z
	 * @param {Object} orientation x,y,z - angles in degree
	 */
	SetModelMatrix (position = this.position, orientation = this.orientation) {
		
		// Convert the orientation to RAD
		this.position = position;
		this.orientation = orientation;

		orientation = {x: degToRad(orientation.x), y: degToRad(orientation.y), z: degToRad(orientation.z)};

		// Set the transformation matrix
		this.modelMatrix = mat4.create();
		mat4.translate(this.modelMatrix, this.modelMatrix, [position.x, position.y, position.z]);
		mat4.rotate(this.modelMatrix, this.modelMatrix, orientation.x, [1, 0, 0]);
		mat4.rotate(this.modelMatrix, this.modelMatrix, orientation.y, [0, 1, 0]);
		mat4.rotate(this.modelMatrix, this.modelMatrix, orientation.z, [0, 0, 1]);

		//Set the normalmatrix 
		let modelViewMatrix = mat4.create();
		mat4.multiply(modelViewMatrix, viewMatrix, this.modelMatrix);
		this.normalMatrix = mat4.create();
		mat4.transpose(this.normalMatrix, modelViewMatrix);
		mat4.invert(this.normalMatrix, this.normalMatrix);

	}
	/**
	 * Sets the buffer data
	 */
	InitBuffer () {
		gl.useProgram(program);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesVBO);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.concat(this.normals.concat(this.textureCoordinates))), gl.STATIC_DRAW);
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

		this.SetModelMatrix();

		//Übergebe hier die Materialkoeffizienten des Objektes an den Shader
		gl.uniform4f(kaLoc, this.ka[0], this.ka[1], this.ka[2], this.ka[3]);
		gl.uniform4f(ksLoc, this.ks[0], this.ks[1], this.ks[2], this.ks[3]);
		gl.uniform4f(kdLoc, this.kd[0], this.kd[1], this.kd[2], this.kd[3]);
		gl.uniform1f(specularExponentLoc, this.specularExponent);	
		gl.uniform1i(isTexturedLoc, this.isTextured);

	}

	Render () {
		
		// Bind the program and the vertex buffer object
		gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesVBO);

		// Set attribute pointers and enable them
		gl.vertexAttribPointer(pointLoc, 3, gl.FLOAT, false, 0, 0);
		gl.vertexAttribPointer(normalsLoc, 3, gl.FLOAT, false, 0, this.mesh.length*4);
		gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, (this.mesh.length + this.normals.length)*4);
		gl.enableVertexAttribArray(pointLoc);
		gl.enableVertexAttribArray(normalsLoc);
		gl.enableVertexAttribArray(texCoordLoc);
		
		// Set uniforms
		this.UpdateBuffer();

		// Draw the object
		gl.drawArrays(gl.TRIANGLES, 0, this.mesh.length/3);
	}
	}

	class WasserCube {
	constructor (levelOfDetail = 2, Colors = {ka: [1.0, 0.0, 1.0, 1.0], kd: [1.0, 0.0, 1.0, 1], 
	    ks: [0.3, 0.0, 0.3, 1.0]}, isTextured = 0) {
	        this.levelOfDetail = levelOfDetail;
	        this.size = 10.0;
	        this.mesh = [];
	        this.normals = [];
	        this.orientation = {x: 0, y: 0, z: 0};
	        this.position = {x: 0, y: 0, z: 0};
	        this.verticesVBO = gl.createBuffer();
	        this.modelMatrix;
	        this.normalMatrix;
	        this.ka = vec4.fromValues(Colors.ka[0],Colors.ka[1],Colors.ka[2],Colors.ka[3]);
	        this.kd = vec4.fromValues(Colors.kd[0],Colors.kd[1],Colors.kd[2],Colors.kd[3]);
	        this.ks = vec4.fromValues(Colors.ks[0],Colors.ks[1],Colors.ks[2],Colors.ks[3]);
	        this.specularExponent = 4.0;
	        this.isTextured = isTextured;

	        this.SetModelMatrix(this.position, this.orientation);
	        this.MakeModel();
	        this.InitBuffer();
		
	    }

    /**
	 * Makes the model, namely the mesh and the colors arrays
	 */
	    MakeModel () {
            
	        for(let i = 0; i < this.levelOfDetail; i++)
	        {
	            for(let j = 0; j < this.levelOfDetail; j++)
	            {
	                let I1 = 2 * this.size * i / this.levelOfDetail - 1;
	                let I2 = 2 * this.size * (i + 1) / this.levelOfDetail - 1;

	                let J1 = 2 * this.size * j / this.levelOfDetail - 1;
	                let J2 = 2 * this.size * (j + 1) / this.levelOfDetail - 1;

	                this.mesh = this.mesh.concat([I1, -0.99, J1]);
	                this.mesh = this.mesh.concat([I2, -0.99, J1]);
	                this.mesh = this.mesh.concat([I1, -0.99, J2]);

	                this.mesh = this.mesh.concat([I2, -0.99, J1]);
	                this.mesh = this.mesh.concat([I1, -0.99, J2]);
	                this.mesh = this.mesh.concat([I2, -0.99, J2]);

	            }

	        }
	    
	        for(let i = 0; i < this.levelOfDetail*this.levelOfDetail*6; i++)
	        {
	            this.normals = this.normals.concat([0.0, 1.0, 0.0]);
	        }

	        console.log(this.mesh);
	        console.log(this.normals);
            

	       // this.mesh = this.mesh.concat([-1.0, -0.99, -1.0, -1.0, -0.99, 1.0, 1.0, -0.99, 1.0]);
	        //this.normals = this.normals.concat([0.0, 1.0, 0.0,0.0, 1.0, 0.0,0.0, 1.0, 0.0]);
	}

    /**
	 * Sets the model matrix
	 * @param {Object} position x,y,z
	 * @param {Object} orientation x,y,z - angles in degree
	 */
	SetModelMatrix (position = this.position, orientation = this.orientation) {
		
	    // Convert the orientation to RAD
	    this.position = position;
	    this.orientation = orientation;

	    orientation = {x: degToRad(orientation.x), y: degToRad(orientation.y), z: degToRad(orientation.z)};

	    // Set the transformation matrix
	    this.modelMatrix = mat4.create();
	    mat4.translate(this.modelMatrix, this.modelMatrix, [position.x, position.y, position.z]);
	    mat4.rotate(this.modelMatrix, this.modelMatrix, orientation.x, [1, 0, 0]);
	    mat4.rotate(this.modelMatrix, this.modelMatrix, orientation.y, [0, 1, 0]);
	    mat4.rotate(this.modelMatrix, this.modelMatrix, orientation.z, [0, 0, 1]);

	    //Set the normalmatrix 
	    let modelViewMatrix = mat4.create();
	    mat4.multiply(modelViewMatrix, viewMatrix, this.modelMatrix);
	    this.normalMatrix = mat4.create();
	    mat4.transpose(this.normalMatrix, modelViewMatrix);
	    mat4.invert(this.normalMatrix, this.normalMatrix);

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

	        this.SetModelMatrix();

	        //Übergebe hier die Materialkoeffizienten des Objektes an den Shader
	        gl.uniform4f(kaLoc, this.ka[0], this.ka[1], this.ka[2], this.ka[3]);
	        gl.uniform4f(ksLoc, this.ks[0], this.ks[1], this.ks[2], this.ks[3]);
	        gl.uniform4f(kdLoc, this.kd[0], this.kd[1], this.kd[2], this.kd[3]);
	        gl.uniform1f(specularExponentLoc, this.specularExponent);	
	        gl.uniform1i(isTexturedLoc, this.isTextured);

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
class HimmelCube {
	constructor (from = {x: 0.0, y: 0.0, z: 0.0}, to = {x: 0.0, y: 0.0, z: 0.0}, 
		Colors = {ka: [1.0, 1.0, 0.0, 1.0], kd: [1.0, 1.0, 0.0, 1], 
			ks: [1.0, 1.0, 0.0, 1.0]}, isTextured = 0) {
		this.from = from;
		this.to = to;
		this.mesh;
		this.normals;
		this.textureCoordinates;
		this.orientation = {x: 0, y: 0, z: 0};
		this.position = {x: 0, y: 0, z: 0};
		this.verticesVBO = gl.createBuffer();
		this.modelMatrix;
		this.normalMatrix;
		this.ka = vec4.fromValues(Colors.ka[0],Colors.ka[1],Colors.ka[2],Colors.ka[3]);
		this.kd = vec4.fromValues(Colors.kd[0],Colors.kd[1],Colors.kd[2],Colors.kd[3]);
		this.ks = vec4.fromValues(Colors.ks[0],Colors.ks[1],Colors.ks[2],Colors.ks[3]);
		this.specularExponent = 4.0;
		this.isTextured = isTextured;

		this.SetModelMatrix(this.position, this.orientation);
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

		this.normals = [
			// Front
			0.0, 0.0, -1.0,
			0.0, 0.0, -1.0,
			0.0, 0.0, -1.0,

			0.0, 0.0, -1.0,
			0.0, 0.0, -1.0,
			0.0, 0.0, -1.0,

			// Right
			-1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0,
			
			-1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0,

			// Back
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,

			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,

			// Left
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,

			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,

			// Bottom
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,

			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,

			// Top
			0.0, -1.0, 0.0,
			0.0, -1.0, 0.0,
			0.0, -1.0, 0.0,

			0.0, -1.0, 0.0,
			0.0, -1.0, 0.0,
			0.0, -1.0, 0.0
		];
		this.textureCoordinates = [
			// Front
			1.0, 0.0,
			0.0, 0.0,
			1.0, 1.0,

			0.0, 1.0,
			1.0, 1.0,
			0.0, 0.0,

			// Right
			1.0, 1.0,
			1.0, 0.0,
			0.0, 0.0,

			0.0, 1.0,
			1.0, 1.0,
			0.0, 0.0,

			// Back
			0.0, 0.0,
			1.0, 0.0,
			0.0, 1.0,

			1.0, 1.0,
			0.0, 1.0,
			1.0, 0.0,

			// Left
			0.0, 1.0,
			0.0, 0.0,
			1.0, 0.0,

			1.0, 1.0,
			0.0, 1.0,
			1.0, 0.0,

			// Bottom
			0.0, 1.0,
			0.0, 0.0,
			1.0, 1.0,

			1.0, 0.0,
			0.0, 0.0,
			1.0, 1.0,

			// Top
			0.0, 1.0,
			0.0, 0.0,
			1.0, 1.0,

			1.0, 0.0,
			0.0, 0.0,
			1.0, 1.0
		];
	}

	/**
	 * Sets the model matrix
	 * @param {Object} position x,y,z
	 * @param {Object} orientation x,y,z - angles in degree
	 */
	SetModelMatrix (position = this.position, orientation = this.orientation) {
		
		// Convert the orientation to RAD
		this.position = position;
		this.orientation = orientation;

		orientation = {x: degToRad(orientation.x), y: degToRad(orientation.y), z: degToRad(orientation.z)};

		// Set the transformation matrix
		this.modelMatrix = mat4.create();
		mat4.translate(this.modelMatrix, this.modelMatrix, [position.x, position.y, position.z]);
		mat4.rotate(this.modelMatrix, this.modelMatrix, orientation.x, [1, 0, 0]);
		mat4.rotate(this.modelMatrix, this.modelMatrix, orientation.y, [0, 1, 0]);
		mat4.rotate(this.modelMatrix, this.modelMatrix, orientation.z, [0, 0, 1]);

		//Set the normalmatrix 
		let modelViewMatrix = mat4.create();
		mat4.multiply(modelViewMatrix, viewMatrix, this.modelMatrix);
		this.normalMatrix = mat4.create();
		mat4.transpose(this.normalMatrix, modelViewMatrix);
		mat4.invert(this.normalMatrix, this.normalMatrix);

	}
	/**
	 * Sets the buffer data
	 */
	InitBuffer () {
		gl.useProgram(program);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesVBO);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.concat(this.normals.concat(this.textureCoordinates))), gl.STATIC_DRAW);
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

		this.SetModelMatrix();

		//Übergebe hier die Materialkoeffizienten des Objektes an den Shader
		gl.uniform4f(kaLoc, this.ka[0], this.ka[1], this.ka[2], this.ka[3]);
		gl.uniform4f(ksLoc, this.ks[0], this.ks[1], this.ks[2], this.ks[3]);
		gl.uniform4f(kdLoc, this.kd[0], this.kd[1], this.kd[2], this.kd[3]);
		gl.uniform1f(specularExponentLoc, this.specularExponent);	
		gl.uniform1i(isTexturedLoc, this.isTextured);

	}

	Render () {
	    clock++;
		// Bind the program and the vertex buffer object
		gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesVBO);

		// Set attribute pointers and enable them
		gl.vertexAttribPointer(pointLoc, 3, gl.FLOAT, false, 0, 0);
		gl.vertexAttribPointer(normalsLoc, 3, gl.FLOAT, false, 0, this.mesh.length*4);
		gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, (this.mesh.length + this.normals.length)*4);
		gl.enableVertexAttribArray(pointLoc);
		gl.enableVertexAttribArray(normalsLoc);
		gl.enableVertexAttribArray(texCoordLoc);
		
		// Set uniforms
		this.UpdateBuffer();

		// Draw the object
		gl.drawArrays(gl.TRIANGLES, 0, this.mesh.length/3);
	}
}
function initTextures() {
    sandTexture = gl.createTexture();
    sandImage = new Image();
    sandImage.onload = function () { handleTextureLoaded(sandImage, sandTexture); }
	sandImage.src = "sand_diffuse.jpg";
}
function initNormals() {
	sandNormalTexture = gl.createTexture();
	sandNormalImage = new Image();
	sandNormalImage.onload = function () { handleTextureLoaded(sandNormalImage, sandNormalTexture); }
	sandNormalImage.src = "sand_normal.jpg";
	    // Erstelle analog zu diffuser Textur eine Normal Map für den Sand. - müsste laufen ^^
}
function handleTextureLoaded(image, texture) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
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
	normalsLoc = gl.getAttribLocation(program, "vNormal");
	texCoordLoc = gl.getAttribLocation(program, "vTexCoord");
	modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
	normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");
	isTexturedLoc = gl.getUniformLocation(program, "isTextured");

	viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
	projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
	
	lightPositionLoc = gl.getUniformLocation(program, "lightPosition");
	IaLoc = gl.getUniformLocation(program, "Ia");
	IdLoc = gl.getUniformLocation(program, "Id");
	IsLoc = gl.getUniformLocation(program, "Is");
	kaLoc = gl.getUniformLocation(program, "ka");
	kdLoc = gl.getUniformLocation(program, "kd");
	ksLoc = gl.getUniformLocation(program, "ks");
	specularExponentLoc = gl.getUniformLocation(program, "specExp");
	
	diffuseMapLoc = gl.getUniformLocation(program, "diffuseMap");
	normalMapLoc = gl.getUniformLocation(program, "normalMap");

	// Set view matrix
	eye = vec3.fromValues(0.0, -0.75, 0.48);
	target = vec3.fromValues(0.0, -0.75, 0.0);
	up = vec3.fromValues(0.0, 1.0, 0.0);

	viewMatrix = mat4.create();
	mat4.lookAt(viewMatrix, eye, target, up);

	projectionMatrix = mat4.create();
	mat4.perspective(projectionMatrix, Math.PI * 0.4, canvas.width / canvas.height, 0.1, 100);

	// Initialize textures
	initTextures();
	initNormals();

	gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);
	
    gl.uniform3fv(lightPositionLoc, [0.5, 0.0, -0.5]); //vorn rechts
	gl.uniform4fv(IaLoc, [0.1, 0.1, 0.1, 1.0]);
	gl.uniform4fv(IdLoc, [0.8, 0.8, 0.8, 1.0]);
	gl.uniform4fv(IsLoc, [0.5, 0.5, 0.5, 1.0]);

	document.addEventListener("keydown", keydown);
	document.addEventListener("keyup", keyup);
	document.addEventListener("mousemove", changeView);
	canvas.onmousedown = function() {
        canvas.requestPointerLock();
	}
	
	// 3. Specify vertices
	
	//Himmel
   	//let Himmel = new HimmelCube({x: -1.0, y: -1.0, z: -1.0},{x: 1.0, y: 1.0, z: 1.0}, {ka: [0.529, 0.808, 0.922, 1.0], kd: [0.229, 0.408, 0.472, 1.0], ks: [0.0, 0.0, 0.0, 1.0]});
	//objects.push(Himmel);
	
	//Ozean
	let Ozean = new WasserCube();	//rumspielen!
	objects.push(Ozean);

	//Strand
	//let Strand = new Cube({x: -0.5, y: -0.98, z: -0.5},{x: 0.5, y: -0.97, z: 0.5}, {ka: [1.0, 1.0, 0.0, 1.0], kd: [0.0, 0.0, 0.0, 1.0], ks: [0.2, 0.2, 0.0, 1.0]}, isTextured = 1); //rumspielen!; kd entfällt
	//objects.push(Strand);
	
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
	let Palmenblatt1 = new Cube({x: -0.04, y: -0.715, z: -0.2},{x: 0.04, y: -0.705, z: 0.2}, {ka: [0.0, 0.2 ,0.0, 1.0], kd: [0.0, 0.8 , 0.0, 1.0], ks: [0.0, 0.0, 0.0, 1.0]});
	objects.push(Palmenblatt1);

	let Palmenblatt2 = new Cube(from = {x: -0.2, y: -0.715, z: -0.04}, to = {x: 0.2, y: -0.705, z: 0.04}, {ka: [0.0, 0.2 ,0.0, 1.0], kd: [0.0, 0.8 ,0.0, 1.0], ks: [0.0, 0.0, 0.0, 1.0]});
	objects.push(Palmenblatt2);

	// 8. Render
	gameLoop();
};


function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Connect diffuse map to the shader
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, sandTexture);
	gl.uniform1i(diffuseMapLoc, 0);
	// Verknüpfe Normal Map analog zu diffuser Map mit Shader.
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, sandNormalTexture);
	gl.uniform1i(normalMapLoc, 0);
	// Call every render function
    objects.forEach(function(object) {
		object.Render();
	});

}

function update()
{
	let look = [(target[0] - eye[0]) * speed,
				(target[1] - eye[1]) * speed,
				(target[2] - eye[2]) * speed];
	
	/* 
	 *	Using gl-matrix:
		let look = vec3.create();
		vec3.sub(look, target, eye);
		vec3.scale(look, look, speed);
	*/

	if(keyPressed.KeyW) {
		eye[0] += look[0];
		eye[2] += look[2];
		target[0] += look[0];
		target[2] += look[2];
	}
	if(keyPressed.KeyS) {
		eye[0] -= look[0];
		eye[2] -= look[2];
		target[0] -= look[0];
		target[2] -= look[2];
	}
	if(keyPressed.KeyA) {
		eye[0] += look[2];
		eye[2] -= look[0];
		target[0] += look[2];
		target[2] -= look[0];
	}
	if(keyPressed.KeyD) {
		eye[0] -= look[2];
		eye[2] += look[0];
		target[0] -= look[2];
		target[2] += look[0];
	}
	mat4.lookAt(viewMatrix, eye, target, up);

	// Set view matrix
	gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
}
function gameLoop() 
{
	update();
	render();
	requestAnimationFrame(gameLoop);
}

function keydown(e) 
{
	keyPressed[e.code] = true;
}

function keyup(e) 
{
	keyPressed[e.code] = false;
}

function changeView(e)
{
	vec3.rotateY(target, target, eye, -e.movementX * speed);
	mat4.lookAt(viewMatrix, eye, target, up);
}

init ();