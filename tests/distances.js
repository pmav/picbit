var manhattanDistance = function(p1, p2) {
    return Math.abs(p1[0] - p2[0]) +
        Math.abs(p1[1] - p2[1]) +
        Math.abs(p1[2] - p2[2]);
};

var canberraDistance = function(p1, p2) {
	return (Math.abs(p1[0] - p2[0]) / (p1[0] + p2[0])) +
		   (Math.abs(p1[1] - p2[1]) / (p1[1] + p2[1])) +
		   (Math.abs(p1[2] - p2[2]) / (p1[2] + p2[2]));
};

var brayCurtisDistance = function(p1, p2) {
	return (Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]) + Math.abs(p1[2] - p2[2])) /
		   (Math.abs(p1[0] + p2[0]) + Math.abs(p1[1] + p2[1]) + Math.abs(p1[2] + p2[2]));
};

var chebyshevDistance = function(p1, p2) {
    return Math.max(
        Math.abs(p1[2] - p2[2]),
        Math.max(Math.abs(p1[0] - p2[0]), Math.abs(p1[1] - p2[1])));
};

var p1 = [132,  67, 255];
var p2 = [100, 100, 100];

console.log(manhattanDistance(p1, p2));
console.log(canberraDistance(p1, p2));
console.log(brayCurtisDistance(p1, p2));
console.log(chebyshevDistance(p1, p2));
