//1:banker, 2:big blind, 3:small blind, 4:utg, 5:mp, 6: hj, 7:utg+1, 8: mp+2, 9:CO
var texas_seat = {
    [2]:[1, 2],
    [3]:[1, 2, 3],
    [4]:[1, 2, 3, 4],
    [5]:[1, 2, 3, 4, 5],
    [6]:[1, 2, 3, 4, 5, 6],
    [7]:[1, 2, 3, 4, 7, 5, 6],
    [8]:[1, 2, 3, 4, 7, 5, 8, 6],
    [9]:[1, 2, 3, 4, 7, 5, 8, 6, 9],
};

var texas_seat_desc = ["BTN", "BB", "SB", "UTG", "MP", "HJ", "UTG+1", "MP+2", "CO"]

module.exports = {
    texas_seat : texas_seat,
    texas_seat_desc: texas_seat_desc,
}