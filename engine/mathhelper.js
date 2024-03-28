 /******************************
   * mathhelper.js by Hurray Banana 2023-2024
   ******************************/ 
/** @classdesc will contain general maths routines ?? */
class MathHelper{
    
}
/** @classdesc holds a 4x4 matrix to hold combinatoral transformation in a single matrix */
class Matrix{

    //h
    m00;m01;m02;m03;
    m10;m11;m12;m13;
    m20;m21;m22;m23;
    m30;m31;m32;m33;

    /** creates a new matrix
     * @param {float[][]} matrixarr if an array with 4 rows and columns is supplied a matrix will be
     * created with those values. If ommitted then an Identity matrix will be create 
     * @example
     * //an identity matrix
     * [
     * [1,0,0,0],
     * [0,1,0,0],
     * [0,0,1,0];
     * [0,0,0,1];
     * ]
     */
    constructor(matrixarr){
        if (matrixarr === undefined){
            this.reset();
        } else {
            this.m00 = matrixarr[0][0];this.m01 = matrixarr[0][1]; this.m02 = matrixarr[0][2]; this.m03 = matrixarr[0][3];
            this.m10 = matrixarr[1][0];this.m11 = matrixarr[1][1]; this.m12 = matrixarr[1][2]; this.m13 = matrixarr[1][3];
            this.m20 = matrixarr[2][0];this.m21 = matrixarr[2][1]; this.m22 = matrixarr[2][2]; this.m23 = matrixarr[2][3];
            this.m30 = matrixarr[3][0];this.m31 = matrixarr[3][1]; this.m32 = matrixarr[3][2]; this.m33 = matrixarr[3][3];
        }
    }

    /**
     * multiply this matrix with matrix m t*m
     * @param {Matrix} m 
    */
    multiply(m){
        let m00 = this.m00;let m01 = this.m01; let m02 = this.m02; let m03 = this.m03;
        let m10 = this.m10;let m11 = this.m11; let m12 = this.m12; let m13 = this.m13;
        let m20 = this.m20;let m21 = this.m21; let m22 = this.m22; let m23 = this.m23;
        let m30 = this.m30;let m31 = this.m31; let m32 = this.m32; let m33 = this.m33;
        
        this.m00 = m00 * m.m00 + m01 * m.m10 + m02 * m.m20 + m03 * m.m30;
        this.m01 = m00 * m.m01 + m01 * m.m11 + m02 * m.m21 + m03 * m.m31;
        this.m02 = m00 * m.m02 + m01 * m.m12 + m02 * m.m22 + m03 * m.m32;
        this.m03 = m00 * m.m03 + m01 * m.m13 + m02 * m.m23 + m03 * m.m33;

        this.m10 = m10 * m.m00 + m11 * m.m10 + m12 * m.m20 + m13 * m.m30;
        this.m11 = m10 * m.m01 + m11 * m.m11 + m12 * m.m21 + m13 * m.m31;
        this.m12 = m10 * m.m02 + m11 * m.m12 + m12 * m.m22 + m13 * m.m32;
        this.m13 = m10 * m.m03 + m11 * m.m13 + m12 * m.m23 + m13 * m.m33;

        this.m20 = m20 * m.m00 + m21 * m.m10 + m22 * m.m20 + m23 * m.m30;
        this.m21 = m20 * m.m01 + m21 * m.m11 + m22 * m.m21 + m23 * m.m31;
        this.m22 = m20 * m.m02 + m21 * m.m12 + m22 * m.m22 + m23 * m.m32;
        this.m23 = m20 * m.m03 + m21 * m.m13 + m22 * m.m23 + m23 * m.m33;

        this.m30 = m30 * m.m00 + m31 * m.m10 + m32 * m.m20 + m33 * m.m30;
        this.m31 = m30 * m.m01 + m31 * m.m11 + m32 * m.m21 + m33 * m.m31;
        this.m32 = m30 * m.m02 + m31 * m.m12 + m32 * m.m22 + m33 * m.m32;
        this.m33 = m30 * m.m03 + m31 * m.m13 + m32 * m.m23 + m33 * m.m33;
    }
    /** @returns {Matrix} An identity matrix, start point for building a custom matrix*/
    static get identity(){
        return new Matrix();
    }
    /**
     * @param {angle} angle in degrees to rotate around the z axis (into the screen, effectively a 2d rotation) 
     * @returns {Matrix} Z axis rotation matrix
     */
    static rotateZ(angle){
        angle *= Math.PIby180;
        let m = new Matrix();
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        m.m00 = c; m.m01 = -s;
        m.m10 = s; m.m11 = c;
        return m;
    }
    /**
     * @param {angle} angle in degrees to rotate around the y axis 
     * @returns {Matrix} y axis rotation matrix
     */
    static rotateY(angle){
        angle *= Math.PIby180;
        let m = new Matrix();
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        m.m00 = c; m.m02 = s;
        m.m20 = -s; m.m22 = c;
        return m;
    }
    /**
     * @param {angle} angle in degrees to rotate around the x 
     * @returns {Matrix} x axis rotation matrix
     */
    static rotateX(angle){
        angle *= Math.PIby180;

        let m = new Matrix();
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        m.m11 = c; m.m12 = -s;
        m.m21 = s; m.m22 = c;
        return m;
    }
    /**
     * directly applies a z axis rotation to this matrix
     * @param {float} angle in degrees to apply to z axis
     */
    applyrotZ(angle){
        angle *= Math.PIby180;
        let m = new Matrix();
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        m.m00 = c; m.m01 = -s;
        m.m10 = s; m.m11 = c;
        this.multiply(m);
    }
    /**
     * directly applies a y axis rotation to this matrix
     * @param {float} angle in degrees to apply to y axis
     */
    applyrotY(angle){
        angle *= Math.PIby180;
        let m = new Matrix();
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        m.m00 = c; m.m02 = s;
        m.m20 = -s; m.m22 = c;
        this.multiply(m);
    }
    /**
     * directly applies a x axis rotation to this matrix
     * @param {float} angle in degrees to apply to x axis
     */
    applyrotX(angle){
        angle *= Math.PIby180;
        let m = new Matrix();
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        m.m11 = c; m.m12 = -s;
        m.m21 = s; m.m22 = c;
        this.multiply(m);
    }

    /**
     * creates a translation matrix
     * @param {float} x translation in x axis
     * @param {float} y translation in y axis
     * @param {float} z translation in z axis
     * @returns {Matrix} translation matrix requested
     */
    static translate(x,y,z){
        let m = new Matrix();

        m.m03 = x;
        m.m13 = y;
        m.m23 = z;
    }
    /**
     * directly applies a translation matrix to this matrix
     * @param {float} x translation in x axis
     * @param {float} y translation in y axis
     * @param {float} z translation in z axis
     */
    applytranslate(x,y,z){
        let m = new Matrix();

        m.m03 = x;
        m.m13 = y;
        m.m23 = z;
        this.multiply(m);
    }
    /**
     * sets this matrix to the indentity matrix
     */
    reset(){
        this.m00 = 1;this.m01 = 0; this.m02 = 0; this.m03 = 0;
        this.m10 = 0;this.m11 = 1; this.m12 = 0; this.m13 = 0;
        this.m20 = 0;this.m21 = 0; this.m22 = 1; this.m23 = 0;
        this.m30 = 0;this.m31 = 0; this.m32 = 0; this.m33 = 1;
    }
    /**
     * applies the matrix to given vector or array of vectors
     * @param {vector3|vector3[]} v 
     */
    transform(v){
        if (Array.isArray(v)){
            for (let p = 0; p < v.length; p++){
                let x = v[p].x;
                let y = v[p].y;
                let z = v[p].z;
                v[p].x = x * this.m00 + y * this.m01 + z * this.m02 + this.m03;
                v[p].y = x * this.m10 + y * this.m11 + z * this.m12 + this.m13;
                v[p].z = x * this.m20 + y * this.m21 + z * this.m22 + this.m23;
            }
        }else{//apply to single vector3 value
            let x = v.x;
            let y = v.y;
            let z = v.z;
            v.x = x * this.m00 + y * this.m01 + z * this.m02 + this.m03;
            v.y = x * this.m10 + y * this.m11 + z * this.m12 + this.m13;
            v.z = x * this.m20 + y * this.m21 + z * this.m22 + this.m23;
        }
    }
    get toString(){
        return "[" + this.m00 + "," + this.m01 + "," + this.m02 + "," + this.m03 + "]\n"+
        "[" + this.m10 + "," + this.m11 + "," + this.m12 + "," + this.m13 + "]\n"+
        "[" + this.m20 + "," + this.m21 + "," + this.m22 + "," + this.m23 + "]\n"+
        "[" + this.m30 + "," + this.m31 + "," + this.m32 + "," + this.m33 + "]";

    }
}