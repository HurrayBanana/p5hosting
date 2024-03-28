/******************************
 * 
 * 
 * rectangle.js
 * 
 * 
 ******************************/ 
//one lone coder rect and dynamic rect collision implementations need wori#king for javascript
//might wack in a custom one for the tilemap stuff as well
/*bool RayVsRect(const olc::vf2d& ray_origin, const olc::vf2d& ray_dir, const rect* target, olc::vf2d& contact_point, olc::vf2d& contact_normal, float& t_hit_near)
{
  contact_normal = { 0,0 };
  contact_point = { 0,0 };

  // Cache division
  olc::vf2d invdir = 1.0f / ray_dir;

  // Calculate intersections with rectangle bounding axes
  olc::vf2d t_near = (target->pos - ray_origin) * invdir;
  olc::vf2d t_far = (target->pos + target->size - ray_origin) * invdir;

  if (std::isnan(t_far.y) || std::isnan(t_far.x)) return false;
  if (std::isnan(t_near.y) || std::isnan(t_near.x)) return false;

  // Sort distances
  if (t_near.x > t_far.x) std::swap(t_near.x, t_far.x);
  if (t_near.y > t_far.y) std::swap(t_near.y, t_far.y);

  // Early rejection		
  if (t_near.x > t_far.y || t_near.y > t_far.x) return false;

  // Closest 'time' will be the first contact
  t_hit_near = std::max(t_near.x, t_near.y);

  // Furthest 'time' is contact on opposite side of target
  float t_hit_far = std::min(t_far.x, t_far.y);

  // Reject if ray direction is pointing away from object
  if (t_hit_far < 0)
    return false;

  // Contact point of collision from parametric line equation
  contact_point = ray_origin + t_hit_near * ray_dir;

  if (t_near.x > t_near.y)
    if (invdir.x < 0)
      contact_normal = { 1, 0 };
    else
      contact_normal = { -1, 0 };
  else if (t_near.x < t_near.y)
    if (invdir.y < 0)
      contact_normal = { 0, 1 };
    else
      contact_normal = { 0, -1 };

  // Note if t_near == t_far, collision is principly in a diagonal
  // so pointless to resolve. By returning a CN={0,0} even though its
  // considered a hit, the resolver wont change anything.
  return true;
}

		bool DynamicRectVsRect(const olc::aabb::rect* r_dynamic, const float fTimeStep, const olc::aabb::rect& r_static,
			olc::vf2d& contact_point, olc::vf2d& contact_normal, float& contact_time)
		{
			// Check if dynamic rectangle is actually moving - we assume rectangles are NOT in collision to start
			if (r_dynamic->vel.x == 0 && r_dynamic->vel.y == 0)
				return false;

			// Expand target rectangle by source dimensions
			olc::aabb::rect expanded_target;
			expanded_target.pos = r_static.pos - r_dynamic->size / 2;
			expanded_target.size = r_static.size + r_dynamic->size;

			if (RayVsRect(r_dynamic->pos + r_dynamic->size / 2, r_dynamic->vel * fTimeStep, &expanded_target, contact_point, contact_normal, contact_time))
				return (contact_time >= 0.0f && contact_time < 1.0f);
			else
				return false;
		}



		bool ResolveDynamicRectVsRect(olc::aabb::rect* r_dynamic, const float fTimeStep, olc::aabb::rect* r_static)
		{
			olc::vf2d contact_point, contact_normal;
			float contact_time = 0.0f;
			if (DynamicRectVsRect(r_dynamic, fTimeStep, *r_static, contact_point, contact_normal, contact_time))
			{
				if (contact_normal.y > 0) r_dynamic->contact[0] = r_static; else nullptr;
				if (contact_normal.x < 0) r_dynamic->contact[1] = r_static; else nullptr;
				if (contact_normal.y < 0) r_dynamic->contact[2] = r_static; else nullptr;
				if (contact_normal.x > 0) r_dynamic->contact[3] = r_static; else nullptr;

				r_dynamic->vel += contact_normal * olc::vf2d(std::abs(r_dynamic->vel.x), std::abs(r_dynamic->vel.y)) * (1 - contact_time);
				return true;
			}

			return false;
		}

*/

/** support for box areas (rectangle with depth) */
class Box{
    #corner;
    #dimension;

    /** creates a box shape which defines a 3d cube area (3d rectangle)
     * 
     * @example 
     * //create a box left at 50, top at 100 and front at 200, width, height of 200 and depth 400
     * //right is at 250, bottom is at 300 and back is at -200
     * new box(50,100,200, 200, 200, 400);
     * 
     * //create a box using 2 vector3 values one for corner and one for dimension
     * new box(new vector3(50,100,200), new vector3(200,200,400));
     *
     */
    constructor(left, top, front, width, height, depth){
      if (front === undefined){
        this.#corner = left.clone;
        this.#dimension = top.clone;
      } else {
        this.#corner = new vector3(left, top, front);
        this.#dimension = new vector3(width, height, depth);
      }
    }
    /** gets the x centre of the box */
    get centrex(){return this.#corner.x + this.#dimension.x/2;}
    /** gets the y centre of the box */
    get centrey(){return this.#corner.y + this.#dimension.y/2;}
    /** gets the z centre of the box */
    get centrez(){return this.#corner.z + this.#dimension.z/2;}
    /** gets the centre of the box as a vector3*/
    get centre(){return new vector3(this.#corner.x + this.#dimension.x/2,this.#corner.y + this.#dimension.y/2,this.#corner.z + this.#dimension.z/2);}
    /** gets the left hand side of the box */
    get x() { return this.#corner.x; }
    /** gets the top hand side of the box */
    get y() { return this.#corner.y; }
    /** gets the front hand side of the box */
    get z() { return this.#corner.z; }
    set x(value){this.#corner.x = value;}
    set y(value){this.#corner.y = value;}
    set z(value){this.#corner.z = value;}
    set w(value){this.#dimension.x = value;}
    set h(value){this.#dimension.y = value;}
    set d(value){this.#dimension.z = value;}
    /** gets the left hand side of the box */
    get l() { return this.#corner.x; }
    /** gets the right hand side of the box */
    get r() { return this.#corner.x + this.#dimension.x; }
    /** gets the top of the box */
    get t() { return this.#corner.y; }
    /** gets the bottom of the box */
    get b() { return this.#corner.y + this.#dimension.y; }
    /** width of box */
    get w() { return this.#dimension.x; }
    /** height of box */
    get h() { return this.#dimension.y; }   
    /** depth of box */
    get d() { return this.#dimension.z; } 

    /** gets the left hand side of the box */
    get left() { return this.#corner.x; }
    /** gets the right hand side of the box */
    get right() { return this.#corner.x + this.#dimension.x; }
    /** gets the top of the box */
    get top() { return this.#corner.y; }
    /** gets the bottom of the box */
    get bottom() { return this.#corner.y + this.#dimension.y; }
    /** gets the front of the box */
    get front() { return this.#corner.z; }
    /** gets the back of the box */
    get back() { return this.#corner.z - this.#dimension.z; }
    /** width of box */
    get width() { return this.#dimension.x; }
    /** height of box */
    get height() { return this.#dimension.y; }
    /** depth of box */
    get depth() { return this.#dimension.z; } 

    /** creates a unit box with corner 0,0,0 and dimensions 1,1,1 */
    static get unit(){
      return new box(0,0,0,1,1,1);
    }
    flate(offsets){
        this.#corner.x -= offsets.x;
        this.#corner.y -= offsets.y;
        this.#dimension.x += (offsets.x + offsets.w);
        this.#dimension.y += (offsets.y + offsets.h);
    }
  }
  /** support for rectangular areas and actions upon them */
  class Rectangle{
    #x;
    #y;
    #w;
    #h;
    
    constructor(x, y, w, h){
      this.#x = x;
      this.#y = y;
      this.#w = w;
      this.#h = h;
    }
    get clone(){return new Rectangle(this.#x,this.#y,this.#w,this.#h);}
    
    cloneto(here){
      here.x = this.#x;
      here.y = this.#y;
      here.w = this.#w;
      here.h = this.#h;
    }
    //portion(){}
    
    /** gets the horizontal centre of the rectangle */
    get centrex(){return this.#x + this.#w/2;}
    /** gets the vertical centre of the rectangle */
    get centrey(){return this.#y + this.#h/2;}
    /** gets the centre as a vector3 object - can be used in place of a vector2 */
    get centre(){return new vector3(this.#x + this.#w/2,this.#y + this.#h/2,0);}

    get x(){return this.#x;}
    get y(){return this.#y;}
    get w(){return this.#w;}
    get width(){return this.#w;}
    get h(){return this.#h;}
    get height(){return this.#h;}
    set x(value){this.#x = value;}
    set y(value){this.#y = value;}
    set w(value){this.#w = value;}
    set h(value){this.#h = value;}
    //area names
    get l(){return this.#x;}
    get t(){return this.#y;}
    get r(){return this.#x + this.#w;}
    get b(){return this.#y + this.#h;}
    //area names
    get left(){return this.#x;}
    get top(){return this.#y;}
    get right(){return this.#x + this.#w;}
    get bottom(){return this.#y + this.#h;}    
  
    static get zero(){return new Rectangle(0,0,0,0);}
    static get one(){return new Rectangle(1,1,1,1);}
    in(x, y){
      return  x >= this.#x &&
              x <= (this.#x + this.#w) &&
              y >= this.#y &&
              y <= (this.#y + this.#h);
    }
    /** determines if this rectanlge intersects with the given rectangle */
    intersects(r){
      //return ()
    }
    //not implemented yet
    randomoutside(margin){
      if (margin === undefined) {margin = 0;}
      return {x:this.#x + margin + Math.random() * (this.#w - margin*2),y:this.#y +margin + Math.random() * (this.#h - margin*2)};
    }
  
    randominside(margin){
      if (margin === undefined) {margin = 0;}
      return {x:this.#x + margin + Math.random() * (this.#w - margin*2),y:this.#y +margin + Math.random() * (this.#h - margin*2)};
    }
    /** produces a vector2 offset for a rectangle portion, this can be mapped back to an
     * original texture rectangle portion
     */
    sub(offsetportion){
      return new vector2(offsetportion.x - this.x, offsetportion.y - this.y);
    }
    /** produces a vector2 offset from a rectangle portion, this can be mapped back to an
     * original texture rectangle portion
     */    
    static sub(rect, offsetportion){
      return new vector2(offsetportion.x - rect.x, offsetportion.y - rect.y);
    }
    /** displaces this rectangle by the given vector2 value */
    displace(offset){
      this.#x += offset.x;
      this.#y += offset.y;
    }
    /** displaces this rectangle by the given vector2 value */
    static displace(rect, offset){
      rect.x += offset.x;
      rect.y += offset.y;
    }
    /** displaces this rectangle by the given vector2 value produces a new rectangle*/
    displaceNew(offset){
      return new Rectangle(this.x += offset.x, this.y += offset.y, this.w, this.h);
    }
    /** displaces this rectangle by the given vector2 value produces a new rectangle*/
    static displaceNew(rect, offset){
      return new Rectangle(rect.x += offset.x, rect.y += offset.y, rect.w, rect.h);
    }
    //??how should this Worker, should be inflate/deflate really
    flate(offsets){
        this.#x -= offsets.x;
        this.#y -= offsets.y;
        this.#w += (offsets.x + offsets.w);
        this.#h += (offsets.y + offsets.h);
    }
    /** alters each side of the rectangle by the given amount */
    adjust(sides){
      this.#x += sides.x;
      this.#y += sides.y;
      this.#w += sides.w;
      this.#h += sides.h;
    }
    /** alters each side of the given rectangle by the given amount */
    static adjust(rect, sides){
      return new Rectangle(rect.x + sides.x, rect.y + sides.y, rect.w + sides.w, rect.h + sides.h);
    }
}
