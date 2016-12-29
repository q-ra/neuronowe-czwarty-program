class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  distance(otherPoint) {
    return (this.x - otherPoint.x) ** 2 + (this.y - otherPoint.y) ** 2
  }

  update(alpha, G, otherPoint) {
    this.x += alpha * G * (otherPoint.x - this.x);
    this.y += alpha * G * (otherPoint.y - this.y);
  }

}
