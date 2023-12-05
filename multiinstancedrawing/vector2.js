/*
vector2 class
provides access to 2 float values as a group
and some useful methods for manipulating them as a column vector
written as a class so extension can be easily made to add more vector2 procedures
*/
class vector2{
	/*
	x - x value to use
	y - y value to use
	*/
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}
	/*
	returns the x value as width for readability in code where
	the vector2 is used for dimension information
	*/
	get width() {return this.x;}
	/*
	returns the y value as height for readability in code where
	the vector2 is used for dimension information
	*/
	get height() {return this.y;}
	/*
	sets the x value as width for readability in code where
	the vector2 is used for dimension information
	*/
	set width(value) {this.x = value;}
	/*
	sets the y value as height for readability in code where
	the vector2 is used for dimension information
	*/
	set height(value) {this.y = value;}
	/*
	convert to unit vector (same direction but of unit length)
	by dividing the direction by its length (expensive square root)
	*/
	normalise()
	{
		var mag = this.magnitude
		this.x /= mag
		this.y /= mag
	}
	/*
	given the vector is already set to a direction for a velocity
	this will nomralise and multiply the x and y components with the speed
	value producing a vector pointing in the original direction but with a different length/speed
	*/
	strength(speed)
	{
		this.normalise();
		this.x *= speed;
		this.y *= speed;
	}
	/*
	returns magnitude (length) of vector
	expensive operation lots of game engines have a 
	lengthsquared method which does all but the square root operation
	which is used when we don't need the exact length but something comparable
	*/
	get magnitude() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	/*
	multiplies the vector by the given scaler (single number) value 
	*/
	multiply(scaler)
	{
		return new vector2(this.x * scaler, this.y * scaler);
	}

	/*
	adds a vector2 value to this vector2 value
	*/
	add(vector2value)
	{
		this.x += vector2value.x;
		this.y += vector2value.y;
	}
}